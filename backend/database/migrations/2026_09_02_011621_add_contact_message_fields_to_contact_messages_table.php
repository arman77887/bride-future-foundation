<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->string('name', 120)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('subject', 200)->nullable();
            $table->text('message')->nullable();
            $table->string('status', 30)->default('new');
            $table->timestampTz('read_at')->nullable();

            $table->index('email');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex(['contact_messages_email_index']);
            $table->dropIndex(['contact_messages_status_index']);

            $table->dropColumn([
                'name',
                'email',
                'phone',
                'subject',
                'message',
                'status',
                'read_at',
            ]);
        });
    }
};
