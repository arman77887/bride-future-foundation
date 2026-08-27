<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('officer_verification_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('officer_profile_id')->constrained('officer_profiles')->cascadeOnDelete();
            $table->foreignUuid('verified_by')->constrained('users')->cascadeOnDelete();
            $table->string('action');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_verification_histories');
    }
};
