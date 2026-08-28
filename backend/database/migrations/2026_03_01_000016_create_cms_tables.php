<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_pages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('title_bn');
            $table->string('title_en');
            $table->text('content_bn')->nullable();
            $table->text('content_en')->nullable();
            $table->string('status')->default('DRAFT');
            $table->string('seo_title_bn')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->text('seo_description_bn')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampTz('published_at')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampsTz();
        });

        Schema::create('cms_page_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cms_page_id')->constrained('cms_pages')->cascadeOnDelete();
            $table->string('section_key', 100);
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->text('content_bn')->nullable();
            $table->text('content_en')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });

        Schema::create('cms_menus', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->timestampsTz();
        });

        Schema::create('cms_menu_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cms_menu_id')->constrained('cms_menus')->cascadeOnDelete();
            $table->foreignUuid('parent_id')->nullable()->constrained('cms_menu_items')->cascadeOnDelete();
            $table->string('label_bn', 150);
            $table->string('label_en', 150);
            $table->string('url')->nullable();
            $table->string('route', 150)->nullable();
            $table->integer('display_order')->default(0);
            $table->string('target', 50)->default('_self');
            $table->timestampsTz();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('content_bn');
            $table->text('content_en');
            $table->string('status')->default('DRAFT');
            $table->timestampTz('published_at')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampsTz();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('description_bn');
            $table->text('description_en');
            $table->string('location_bn')->nullable();
            $table->string('location_en')->nullable();
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->string('status')->default('DRAFT');
            $table->string('registration_link')->nullable();
            $table->timestampsTz();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('description_bn');
            $table->text('description_en');
            $table->string('status')->default('ACTIVE');
            $table->timestampsTz();
        });

        Schema::create('notices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->text('content_bn');
            $table->text('content_en');
            $table->timestampTz('expires_at')->nullable();
            $table->string('status')->default('DRAFT');
            $table->timestampsTz();
        });

        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('description_bn')->nullable();
            $table->text('description_en')->nullable();
            $table->timestampsTz();
        });

        Schema::create('gallery_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('gallery_album_id')->constrained('gallery_albums')->cascadeOnDelete();
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->string('file_url');
            $table->integer('display_order')->default(0);
            $table->timestampTz('created_at')->useCurrent();
        });

        Schema::create('public_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('file_url');
            $table->unsignedBigInteger('file_size');
            $table->timestampsTz();
        });

        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('filename');
            $table->string('storage_key')->unique();
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size');
            $table->foreignUuid('uploader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('public_documents');
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('gallery_albums');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('events');
        Schema::dropIfExists('news');
        Schema::dropIfExists('cms_menu_items');
        Schema::dropIfExists('cms_menus');
        Schema::dropIfExists('cms_page_sections');
        Schema::dropIfExists('cms_pages');
    }
};
