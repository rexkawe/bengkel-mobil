<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'profile_picture',
        'role',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    protected $attributes = [
        'is_active' => true, // DEFAULT VALUE
        'role' => 'customer', // DEFAULT VALUE
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isMechanic()
    {
        return $this->role === 'mechanic';
    }

    public function isCustomer()
    {
        return $this->role === 'customer';
    }
}