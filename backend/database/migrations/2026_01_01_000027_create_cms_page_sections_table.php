<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cms_page_sections', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('cms_page_id');
            $table->string('section_key', 100);
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->text('content_bn')->nullable();
            $table->text('content_en')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('cms_page_id')->references('id')->on('cms_pages')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_page_sections');
    }
};
