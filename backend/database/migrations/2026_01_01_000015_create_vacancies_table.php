<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('department_id');
            $table->uuid('position_id');
            $table->integer('required_count')->default(1);
            $table->string('title_bn');
            $table->string('title_en');
            $table->text('description_bn')->nullable();
            $table->text('description_en')->nullable();
            $table->text('requirements')->nullable();
            $table->timestampTz('deadline');
            $table->string('status', 50)->default('DRAFT');
            $table->uuid('created_by');
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->onDelete('restrict');
            $table->foreign('position_id')->references('id')->on('positions')->onDelete('restrict');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict');
        });

        DB::statement("ALTER TABLE vacancies ADD CONSTRAINT check_vacancy_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED'));");
        
        Schema::table('vacancies', function (Blueprint $table) {
            $table->index('status');
            $table->index('deadline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
