<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->uuid('media_id')
                ->nullable()
                ->after('gallery_album_id')
                ->index();

            $table->foreign('media_id')
                ->references('id')
                ->on('media')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->dropForeign(['media_id']);
            $table->dropIndex(['media_id']);
            $table->dropColumn('media_id');
        });
    }
};
