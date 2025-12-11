<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getDashboardStats()
    {
        try {
            $now = Carbon::now();
            $lastMonth = Carbon::now()->subMonth();

            // 1. Total Bookings
            $totalBookings = Booking::count();
            
            // 2. Pending Bookings (Need Attention)
            $pendingBookings = Booking::where('status', 'pending')->count();
            
            // 3. Total Customers (role = customer)
            $totalCustomers = User::where('role', 'customer')->count();
            
            // 4. Revenue This Month (Completed only using final_cost)
            $revenueMonth = Booking::where('status', 'completed')
                ->whereYear('booking_date', $now->year)
                ->whereMonth('booking_date', $now->month)
                ->sum('final_cost');

            // 5. Growth (Revenue comparison with last month)
            $revenueLastMonth = Booking::where('status', 'completed')
                ->whereYear('booking_date', $lastMonth->year)
                ->whereMonth('booking_date', $lastMonth->month)
                ->sum('final_cost');

            $growth = 0;
            if ($revenueLastMonth > 0) {
                $growth = (($revenueMonth - $revenueLastMonth) / $revenueLastMonth) * 100;
            } else if ($revenueMonth > 0) {
                $growth = 100; // 100% growth if previous was 0
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'total_bookings' => $totalBookings,
                    'pending_bookings' => $pendingBookings,
                    'total_customers' => $totalCustomers,
                    'revenue_month' => (float)$revenueMonth,
                    'growth' => round($growth, 1)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data statistik',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getRecentBookings()
    {
        try {
            $bookings = Booking::with(['service', 'user'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $bookings->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'booking_code' => $booking->booking_code ?? 'BK-' . $booking->id,
                        'customer_name' => $booking->user ? $booking->user->name : $booking->customer_name, // Fallback if no relation
                        'service_name' => $booking->service ? $booking->service->name : 'Service Deleted',
                        'status' => $booking->status,
                        'booking_date' => Carbon::parse($booking->booking_date)->format('Y-m-d'),
                        'total_price' => $booking->final_cost ?? $booking->estimated_cost ?? 0
                    ];
                })
            ]);

        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil booking terbaru',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getAllBookings(Request $request)
    {
        try {
            $status = $request->get('status');
            $date = $request->get('date');
            $search = $request->get('search');
            
            $bookings = Booking::with(['service', 'user'])
                ->when($status, function ($query) use ($status) {
                    return $query->where('status', $status);
                })
                ->when($date, function ($query) use ($date) {
                    return $query->whereDate('booking_date', $date);
                })
                ->when($search, function ($query) use ($search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('booking_code', 'like', "%{$search}%")
                          ->orWhere('customer_name', 'like', "%{$search}%")
                          ->orWhere('customer_phone', 'like', "%{$search}%")
                          ->orWhere('vehicle_plate', 'like', "%{$search}%");
                    });
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10);
    
            return response()->json([
                'success' => true,
                'data' => [
                    'bookings' => $bookings->map(function ($booking) {
                        return [
                            'id' => $booking->id,
                            'booking_code' => $booking->booking_code,
                            'customer_name' => $booking->customer_name,
                            'customer_phone' => $booking->customer_phone,
                            'service_name' => $booking->service->name,
                            'status' => $booking->status,
                            'booking_date' => $booking->booking_date->format('d/m/Y'),
                            'booking_time' => $booking->booking_time,
                            'vehicle_plate' => $booking->vehicle_plate,
                            'estimated_cost' => $booking->estimated_cost,
                            'final_cost' => $booking->final_cost,
                            'created_at' => $booking->created_at->format('d/m/Y H:i'),
                        ];
                    }),
                    'pagination' => [
                        'current_page' => $bookings->currentPage(),
                        'last_page' => $bookings->lastPage(),
                        'per_page' => $bookings->perPage(),
                        'total' => $bookings->total(),
                    ]
                ]
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data booking',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateBookingStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled'
            ]);

            $booking = Booking::findOrFail($id);
            $booking->status = $request->status;
            
            // If completed, ensure final_cost is set (fallback to estimated_cost if not provided)
            if ($request->status === 'completed' && !$booking->final_cost) {
                $booking->final_cost = $booking->estimated_cost;
            }

            $booking->save();

            return response()->json([
                'success' => true,
                'message' => 'Status booking berhasil diperbarui',
                'data' => $booking
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}