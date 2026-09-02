<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_subscribers', function (Blueprint $table) {
            $table->uuid('unsubscribe_token')->unique()->nullable()->after('email');
        });

        \Illuminate\Support\Facades\DB::table('email_subscribers')
            ->whereNull('unsubscribe_token')
            ->orderBy('id')
            ->eachById(function ($subscriber) {
                \Illuminate\Support\Facades\DB::table('email_subscribers')
                    ->where('id', $subscriber->id)
                    ->update([
                        'unsubscribe_token' => (string) \Illuminate\Support\Str::uuid(),
                    ]);
            });
    }

    public function down(): void
    {
        Schema::table('email_subscribers', function (Blueprint $table) {
            $table->dropUnique(['unsubscribe_token']);
            $table->dropColumn('unsubscribe_token');
        });
    }
};
