<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'user_id',
        'service_id',
        'booking_date',
        'booking_time',
        'status',
        'customer_name',
        'customer_phone',
        'customer_email',
        'vehicle_type',
        'vehicle_plate',
        'vehicle_model',
        'vehicle_year',
        'notes',
        'estimated_cost',
        'final_cost',
        'mechanic_notes'
    ];

    protected $casts = [
        'booking_date' => 'date',
        'estimated_cost' => 'decimal:2',
        'final_cost' => 'decimal:2'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            $booking->booking_code = 'BK-' . date('Ymd') . '-' . strtoupper(uniqid());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function getFormattedEstimatedCostAttribute()
    {
        return $this->estimated_cost ? 'Rp ' . number_format($this->estimated_cost, 0, ',', '.') : '-';
    }

    public function getFormattedFinalCostAttribute()
    {
        return $this->final_cost ? 'Rp ' . number_format($this->final_cost, 0, ',', '.') : '-';
    }

    public function getBookingDateTimeAttribute()
    {
        return $this->booking_date->format('d/m/Y') . ' ' . $this->booking_time;
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}