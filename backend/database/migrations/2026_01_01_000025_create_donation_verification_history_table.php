<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donation_verification_history', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('donation_id');
            $table->uuid('reviewer_id');
            $table->string('previous_status', 50);
            $table->string('new_status', 50);
            $table->text('notes')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('donation_id')->references('id')->on('donations')->onDelete('restrict');
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_verification_history');
    }
};
