<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['news', 'events', 'projects', 'notices'] as $table) {
            Schema::table($table, function (Blueprint $tableBlueprint) {
                $tableBlueprint
                    ->uuid('cover_media_id')
                    ->nullable()
                    ->index();

                $tableBlueprint
                    ->foreign('cover_media_id')
                    ->references('id')
                    ->on('media')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['news', 'events', 'projects', 'notices'] as $table) {
            Schema::table($table, function (Blueprint $tableBlueprint) {
                $tableBlueprint->dropForeign([$table === 'news'
                    ? 'cover_media_id'
                    : 'cover_media_id']);

                $tableBlueprint->dropIndex([$table === 'news'
                    ? 'cover_media_id'
                    : 'cover_media_id']);

                $tableBlueprint->dropColumn('cover_media_id');
            });
        }
    }
};
