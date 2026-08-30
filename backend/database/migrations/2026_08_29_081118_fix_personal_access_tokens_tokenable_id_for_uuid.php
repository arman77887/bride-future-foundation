<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex([
                'tokenable_type',
                'tokenable_id',
            ]);
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->uuid('tokenable_id_new')->nullable();

            $table->index([
                'tokenable_type',
                'tokenable_id_new',
            ]);
        });

        DB::statement('
            UPDATE personal_access_tokens pat
            SET tokenable_id_new = u.id
            FROM users u
            WHERE pat.tokenable_type = \'App\\\\Models\\\\User\'
              AND pat.tokenable_id::text = u.id::text
        ');

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('tokenable_id');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->renameColumn('tokenable_id_new', 'tokenable_id');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex([
                'tokenable_type',
                'tokenable_id_new',
            ]);

            $table->index([
                'tokenable_type',
                'tokenable_id',
            ]);
        });
    }

    public function down(): void
    {
        throw new RuntimeException(
            'Cannot automatically reverse UUID tokenable_id back to bigint.'
        );
    }
};
