<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('title_bn');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('description_bn');
            $table->text('description_en');
            $table->string('location_bn', 255)->nullable();
            $table->string('location_en', 255)->nullable();
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->string('status', 50)->default('DRAFT');
            $table->string('registration_link', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
