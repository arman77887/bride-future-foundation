<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('uid', 32)->nullable()->unique()->after('id');
            $table->string('name', 150)->nullable()->after('email');
            $table->string('phone', 30)->nullable()->after('name');
            $table->text('address')->nullable()->after('phone');
        });

        DB::table('users')
            ->whereNull('uid')
            ->orderBy('id')
            ->get()
            ->each(function ($user) {
                do {
                    $uid = 'BFF-' . strtoupper(Str::random(10));
                } while (DB::table('users')->where('uid', $uid)->exists());

                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['uid' => $uid]);
            });

        Schema::table('users', function (Blueprint $table) {
            $table->string('uid', 32)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['uid']);
            $table->dropColumn(['uid', 'name', 'phone', 'address']);
        });
    }
};
