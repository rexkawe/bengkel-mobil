<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Import Log Facade
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     *
     * @param RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                // Pastikan password selalu di-hash saat pendaftaran
                'password' => Hash::make($request->password), 
                'phone' => $request->phone,
                'address' => $request->address,
                'role' => 'customer',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // Log error untuk debugging server side
            Log::error("Registration failed: " . $e->getMessage()); 
            
            return response()->json([
                'success' => false,
                'message' => 'Registrasi gagal',
                'error' => 'Terjadi kesalahan internal server.' // Pesan umum untuk klien
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handle user login.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            // Perbaikan: Bersihkan input password dari spasi di awal/akhir
            $inputPassword = trim($request->password);

            // CARI USER
            $user = User::where('email', $request->email)->first();

            // 1. Cek User dan Password
            if (!$user || !Hash::check($inputPassword, $user->password)) {
                
                // Logging detail HANYA untuk membantu Anda mendiagnosis masalah:
                if ($user) {
                    Log::debug('*** DEBUG GAGAL LOGIN ***');
                    Log::debug('Input Password (trimmed): ' . $inputPassword);
                    Log::debug('DB Hashed Password: ' . $user->password);
                    Log::debug('Hash Check Result: ' . (Hash::check($inputPassword, $user->password) ? 'Success' : 'Failure'));
                    Log::debug('***************************');
                } else {
                    Log::warning('Login attempt for unknown email: ' . $request->email);
                }

                // Pesan keamanan umum
                return response()->json([
                    'success' => false,
                    'message' => 'Email atau Password salah'
                ], Response::HTTP_UNAUTHORIZED);
            }
            
            // 2. CHECK ACTIVE STATUS
            // Asumsi kolom 'is_active' ada di model User.
            if (isset($user->is_active) && !$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.'
                ], Response::HTTP_FORBIDDEN);
            }

            // CREATE TOKEN SANCTUM
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Login failed: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Login gagal',
                'error' => 'Terjadi kesalahan internal server.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handle user logout (revoke current token).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil'
            ]);

        } catch (\Exception $e) {
            Log::error("Logout failed: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Logout gagal',
                'error' => 'Terjadi kesalahan internal server.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get authenticated user details.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'address' => $user->address,
                        'role' => $user->role,
                        'profile_picture' => $user->profile_picture,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to fetch user data: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data user',
                'error' => 'Terjadi kesalahan internal server.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}