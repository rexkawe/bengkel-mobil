<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->timestamps();
            });

            // Seed default values
            DB::table('settings')->insert([
                ['key' => 'shop_name', 'value' => 'Bengkel Mobil Premier', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'shop_address', 'value' => 'Jl. Otomotif No. 1, Jakarta', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'shop_phone', 'value' => '081234567890', 'created_at' => now(), 'updated_at' => now()],
                ['key' => 'working_hours', 'value' => 'Senin - Sabtu, 08:00 - 17:00 wib', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
};
