<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\BookingRequest;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $bookings = Booking::with('service')
                ->when($user->role === 'customer', function ($query) use ($user) {
                    return $query->where('user_id', $user->id);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'bookings' => $bookings->map(function ($booking) {
                        return [
                            'id' => $booking->id,
                            'booking_code' => $booking->booking_code,
                            'service_name' => $booking->service->name,
                            'booking_date' => $booking->booking_date->format('Y-m-d'),
                            'booking_time' => $booking->booking_time,
                            'status' => $booking->status,
                            'customer_name' => $booking->customer_name,
                            'vehicle_plate' => $booking->vehicle_plate,
                            'estimated_cost' => $booking->estimated_cost,
                            'formatted_estimated_cost' => $booking->formatted_estimated_cost,
                            'final_cost' => $booking->final_cost,
                            'formatted_final_cost' => $booking->formatted_final_cost,
                            'created_at' => $booking->created_at->format('d/m/Y H:i'),
                        ];
                    })
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

    public function store(BookingRequest $request)
    {
        try {
            $service = Service::findOrFail($request->service_id);

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'service_id' => $request->service_id,
                'booking_date' => $request->booking_date,
                'booking_time' => $request->booking_time,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'vehicle_type' => $request->vehicle_type,
                'vehicle_plate' => $request->vehicle_plate,
                'vehicle_model' => $request->vehicle_model,
                'vehicle_year' => $request->vehicle_year,
                'notes' => $request->notes,
                'estimated_cost' => $service->price,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dibuat',
                'data' => [
                    'booking' => [
                        'id' => $booking->id,
                        'booking_code' => $booking->booking_code,
                        'service_name' => $service->name,
                        'booking_date' => $booking->booking_date->format('d/m/Y'),
                        'booking_time' => $booking->booking_time,
                        'estimated_cost' => $booking->formatted_estimated_cost,
                        'status' => $booking->status,
                    ]
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat booking',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $booking = Booking::with('service', 'user')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'booking' => [
                        'id' => $booking->id,
                        'booking_code' => $booking->booking_code,
                        'service' => [
                            'name' => $booking->service->name,
                            'description' => $booking->service->description,
                            'duration' => $booking->service->duration,
                        ],
                        'booking_date' => $booking->booking_date->format('d/m/Y'),
                        'booking_time' => $booking->booking_time,
                        'status' => $booking->status,
                        'customer_name' => $booking->customer_name,
                        'customer_phone' => $booking->customer_phone,
                        'customer_email' => $booking->customer_email,
                        'vehicle_type' => $booking->vehicle_type,
                        'vehicle_plate' => $booking->vehicle_plate,
                        'vehicle_model' => $booking->vehicle_model,
                        'vehicle_year' => $booking->vehicle_year,
                        'notes' => $booking->notes,
                        'estimated_cost' => $booking->estimated_cost,
                        'formatted_estimated_cost' => $booking->formatted_estimated_cost,
                        'final_cost' => $booking->final_cost,
                        'formatted_final_cost' => $booking->formatted_final_cost,
                        'mechanic_notes' => $booking->mechanic_notes,
                        'created_at' => $booking->created_at->format('d/m/Y H:i'),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function getAvailableTimes(Request $request)
    {
        try {
            $date = $request->validate(['date' => 'required|date'])['date'];
            
            // Time slots yang available
            $allSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
            
            // Cari booking yang sudah ada di tanggal tersebut
            $bookedSlots = Booking::whereDate('booking_date', $date)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->pluck('booking_time')
                ->toArray();

            $availableSlots = array_diff($allSlots, $bookedSlots);

            return response()->json([
                'success' => true,
                'data' => [
                    'date' => $date,
                    'available_times' => array_values($availableSlots),
                    'all_times' => $allSlots,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jadwal tersedia',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}