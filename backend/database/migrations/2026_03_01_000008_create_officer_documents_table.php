<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('officer_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('officer_profile_id')->constrained('officer_profiles')->cascadeOnDelete();
            $table->string('document_type');
            $table->string('file_path');
            $table->string('original_name');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_documents');
    }
};
