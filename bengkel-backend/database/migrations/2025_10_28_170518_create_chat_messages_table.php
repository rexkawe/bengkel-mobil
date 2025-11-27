<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_id'); // Untuk guest users
            $table->enum('sender_type', ['user', 'admin']);
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->json('metadata')->nullable(); // Untuk menyimpan additional data
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('chat_messages');
    }
};