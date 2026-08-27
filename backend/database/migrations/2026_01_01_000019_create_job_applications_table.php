<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('vacancy_id');
            $table->string('application_reference', 100)->unique();
            $table->string('status', 50)->default('PENDING');
            $table->timestamps();

            $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('restrict');
        });

        DB::statement("ALTER TABLE job_applications ADD CONSTRAINT check_app_status CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'));");
        
        Schema::table('job_applications', function (Blueprint $table) {
            $table->index('application_reference');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
