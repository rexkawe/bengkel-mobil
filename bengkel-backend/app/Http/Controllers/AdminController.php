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
                        'estimated_cost' => $booking->formatted_estimated_cost,
                        'final_cost' => $booking->formatted_final_cost,
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