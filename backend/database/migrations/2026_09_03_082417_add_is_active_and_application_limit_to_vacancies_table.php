<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('status');
            $table->unsignedInteger('application_limit')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn([
                'application_limit',
                'is_active',
            ]);
        });
    }
};
