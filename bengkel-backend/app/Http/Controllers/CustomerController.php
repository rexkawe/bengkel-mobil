<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    public function getStats()
    {
        try {
            $total = User::where('role', 'customer')->count();
            $active = User::where('role', 'customer')->where('is_active', true)->count();
            $newThisMonth = User::where('role', 'customer')
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'active' => $active,
                    'new_this_month' => $newThisMonth
                ]
            ]);
        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

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

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
                'role' => 'customer',
                'is_active' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pelanggan berhasil ditambahkan',
                'data' => $user
            ], Response::HTTP_CREATED);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan pelanggan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::where('role', 'customer')->findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'password' => 'nullable|string|min:6', 
                'is_active' => 'boolean'
            ]);

            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ];

            if ($request->has('is_active')) {
                $userData['is_active'] = $request->is_active;
            }

            if ($request->filled('password')) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
            }

            $user->update($userData);

            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil diperbarui',
                'data' => $user
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui pelanggan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::where('role', 'customer')->findOrFail($id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pelanggan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pelanggan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}