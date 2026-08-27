<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cms_pages', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('slug')->unique();
            $table->string('title_bn');
            $table->string('title_en');
            $table->text('content_bn')->nullable();
            $table->text('content_en')->nullable();
            $table->string('status', 50)->default('DRAFT');
            $table->string('seo_title_bn')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->text('seo_description_bn')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampTz('published_at')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_pages');
    }
};
