<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('gallery_album_id');
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->string('file_url', 255);
            $table->integer('display_order')->default(0);
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('gallery_album_id')->references('id')->on('gallery_albums')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
