<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officer_documents', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('officer_profile_id');
            $table->string('document_type', 100);
            $table->string('original_filename');
            $table->string('storage_key');
            $table->string('mime_type', 100);
            $table->bigInteger('file_size');
            $table->string('checksum', 64);
            $table->uuid('uploaded_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('officer_profile_id')->references('id')->on('officer_profiles')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_documents');
    }
};
