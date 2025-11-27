<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Services (Public)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/services/categories/all', [ServiceController::class, 'categories']);
Route::get('/services/category/{category}', [ServiceController::class, 'byCategory']);

// Chat (Public - untuk guest users)
Route::get('/chat/messages', [ChatController::class, 'getMessages']);
Route::post('/chat/send', [ChatController::class, 'sendMessage']);
Route::get('/chat/unread-count', [ChatController::class, 'getUnreadCount']);
Route::put('/chat/messages/{messageId}/read', [ChatController::class, 'markAsRead']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/bookings/available-times', [BookingController::class, 'getAvailableTimes']);

    // Chat (Authenticated users)
    Route::apiResource('chat', ChatController::class)->only(['index', 'store']);
});

// Admin Routes - SEMUA ROUTES ADMIN DI SATU GROUP
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard & Stats
    Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
    Route::get('/recent-bookings', [AdminController::class, 'getRecentBookings']);
    Route::get('/all-bookings', [AdminController::class, 'getAllBookings']);
    Route::put('/bookings/{id}/status', [AdminController::class, 'updateBookingStatus']);
    Route::get('/chat-statistics', [AdminController::class, 'getChatStatistics']);
    
    // Customer Management
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    
    // Service Management
    Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
    Route::put('/services/{id}/toggle', [ServiceController::class, 'toggleStatus']);
});

// Fallback for undefined API routes
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint tidak ditemukan'
    ], 404);
});