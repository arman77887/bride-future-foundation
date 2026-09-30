<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('officer_profiles', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->change();

            $table->uuid('avatar_media_id')
                ->nullable()
                ->after('avatar_url');

            $table->foreign('avatar_media_id')
                ->references('id')
                ->on('media')
                ->nullOnDelete();

            $table->index('avatar_media_id');
        });
    }

    public function down(): void
    {
        Schema::table('officer_profiles', function (Blueprint $table) {
            $table->dropForeign(['avatar_media_id']);
            $table->dropIndex(['avatar_media_id']);
            $table->dropColumn('avatar_media_id');

            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};
