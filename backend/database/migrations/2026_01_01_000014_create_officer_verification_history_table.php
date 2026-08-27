<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officer_verification_history', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('officer_profile_id');
            $table->uuid('reviewer_id');
            $table->string('previous_status', 50);
            $table->string('new_status', 50);
            $table->text('review_note')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('officer_profile_id')->references('id')->on('officer_profiles')->onDelete('restrict');
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_verification_history');
    }
};
