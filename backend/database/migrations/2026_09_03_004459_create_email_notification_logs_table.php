<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_notification_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('email_subscriber_id');
            $table->string('update_type', 50);
            $table->uuid('update_id');
            $table->timestampTz('sent_at')->nullable();
            $table->timestampsTz();

            $table->foreign('email_subscriber_id')
                ->references('id')
                ->on('email_subscribers')
                ->cascadeOnDelete();

            $table->unique(
                ['email_subscriber_id', 'update_type', 'update_id'],
                'email_notification_logs_unique_update'
            );

            $table->index(['update_type', 'update_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_notification_logs');
    }
};
