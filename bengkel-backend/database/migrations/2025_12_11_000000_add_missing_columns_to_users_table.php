<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('customer')->after('password');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('role');
            }
            if (!Schema::hasColumn('users', 'profile_picture')) {
                 $table->string('profile_picture')->nullable()->after('address');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Note: This might remove columns that existed before if we rollback
            // But for this purpose it is acceptable.
            $columns = [];
            if (Schema::hasColumn('users', 'phone')) $columns[] = 'phone';
            if (Schema::hasColumn('users', 'address')) $columns[] = 'address';
            if (Schema::hasColumn('users', 'role')) $columns[] = 'role';
            if (Schema::hasColumn('users', 'is_active')) $columns[] = 'is_active';
            if (Schema::hasColumn('users', 'profile_picture')) $columns[] = 'profile_picture';
            
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
