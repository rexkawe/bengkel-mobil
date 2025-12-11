<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('vehicle_type'); // SUV, Sedan, MPV, etc.
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['service_id', 'vehicle_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_prices');
    }
};