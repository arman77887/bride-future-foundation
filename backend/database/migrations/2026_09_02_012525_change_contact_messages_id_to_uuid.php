<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->uuid('new_id')->nullable();
        });

        DB::statement('UPDATE contact_messages SET new_id = gen_random_uuid()');

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropPrimary(['id']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->renameColumn('new_id', 'id');
        });

        DB::statement('ALTER TABLE contact_messages ALTER COLUMN id SET NOT NULL');
        DB::statement('ALTER TABLE contact_messages ADD PRIMARY KEY (id)');
        DB::statement('ALTER TABLE contact_messages ALTER COLUMN id SET DEFAULT gen_random_uuid()');
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->bigInteger('old_id')->nullable();
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropPrimary(['id']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->renameColumn('old_id', 'id');
        });

        DB::statement('ALTER TABLE contact_messages ALTER COLUMN id SET NOT NULL');
        DB::statement('ALTER TABLE contact_messages ADD PRIMARY KEY (id)');
    }
};
