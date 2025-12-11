<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date|after:today',
            'booking_time' => 'required|date_format:H:i',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:15',
            'customer_email' => 'required|email',
            'vehicle_type' => 'required|string|max:100',
            'vehicle_plate' => 'required|string|max:20',
            'vehicle_model' => 'required|string|max:100',
            'vehicle_year' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'notes' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'service_id.required' => 'Pilih layanan servis',
            'service_id.exists' => 'Layanan servis tidak valid',
            'booking_date.required' => 'Tanggal booking harus diisi',
            'booking_date.after' => 'Tanggal booking harus setelah hari ini',
            'booking_time.required' => 'Waktu booking harus diisi',
            'customer_name.required' => 'Nama pelanggan harus diisi',
            'customer_phone.required' => 'Nomor telepon harus diisi',
            'customer_email.required' => 'Email harus diisi',
            'customer_email.email' => 'Format email tidak valid',
            'vehicle_type.required' => 'Tipe kendaraan harus diisi',
            'vehicle_plate.required' => 'Plat nomor harus diisi',
            'vehicle_model.required' => 'Model kendaraan harus diisi',
            'vehicle_year.required' => 'Tahun kendaraan harus diisi',
        ];
    }
}