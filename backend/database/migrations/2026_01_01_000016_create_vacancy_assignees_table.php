<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vacancy_assignees', function (Blueprint $table) {
            $table->uuid('vacancy_id');
            $table->uuid('user_id');

            $table->primary(['vacancy_id', 'user_id']);
            $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancy_assignees');
    }
};
