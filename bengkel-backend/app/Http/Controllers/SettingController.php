<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        try {
            $settings = DB::table('settings')->pluck('value', 'key');
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengaturan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->validate([
                'shop_name' => 'nullable|string',
                'shop_address' => 'nullable|string',
                'shop_phone' => 'nullable|string',
                'working_hours' => 'nullable|string',
            ]);

            foreach ($data as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value, 'updated_at' => now()]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Pengaturan berhasil diperbarui',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui pengaturan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
