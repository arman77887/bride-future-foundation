<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->citext('email')->unique();
            $table->string('password');
            $table->string('status')->default('INVITED');
            $table->text('two_factor_secret')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestampTz('two_factor_confirmed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement("ALTER TABLE users ADD CONSTRAINT check_user_status CHECK (status IN ('INVITED', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED'));");
        Schema::table('users', function (Blueprint $table) {
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
