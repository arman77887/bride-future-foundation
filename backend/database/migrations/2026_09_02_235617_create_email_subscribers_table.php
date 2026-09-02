<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email', 255)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestampTz('subscribed_at')->useCurrent();
            $table->timestampTz('unsubscribed_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_subscribers');
    }
};
