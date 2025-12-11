<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->date('booking_date');
            $table->time('booking_time');
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending');
            
            // Customer & Vehicle Info
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email');
            $table->string('vehicle_type');
            $table->string('vehicle_plate');
            $table->string('vehicle_model');
            $table->year('vehicle_year');
            
            // Service Details
            $table->text('notes')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->decimal('final_cost', 10, 2)->nullable();
            $table->text('mechanic_notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};