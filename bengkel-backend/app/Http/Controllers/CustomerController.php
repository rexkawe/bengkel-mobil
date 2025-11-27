<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->get('search');
            
            $customers = User::where('role', 'customer')
                ->when($search, function ($query) use ($search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%")
                          ->orWhere('phone', 'like', "%{$search}%");
                    });
                })
                ->withCount(['bookings'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => [
                    'customers' => $customers->map(function ($customer) {
                        return [
                            'id' => $customer->id,
                            'name' => $customer->name,
                            'email' => $customer->email,
                            'phone' => $customer->phone,
                            'address' => $customer->address,
                            'bookings_count' => $customer->bookings_count,
                            'is_active' => $customer->is_active,
                            'created_at' => $customer->created_at->format('d/m/Y'),
                        ];
                    }),
                    'pagination' => [
                        'current_page' => $customers->currentPage(),
                        'last_page' => $customers->lastPage(),
                        'per_page' => $customers->perPage(),
                        'total' => $customers->total(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pelanggan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $customer = User::with(['bookings.service'])
                ->where('role', 'customer')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'customer' => [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'email' => $customer->email,
                        'phone' => $customer->phone,
                        'address' => $customer->address,
                        'bookings' => $customer->bookings->map(function ($booking) {
                            return [
                                'booking_code' => $booking->booking_code,
                                'service_name' => $booking->service->name,
                                'status' => $booking->status,
                                'booking_date' => $booking->booking_date->format('d/m/Y'),
                                'estimated_cost' => $booking->formatted_estimated_cost,
                            ];
                        })
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pelanggan tidak ditemukan',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }
}