<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->string('applicant_name', 255)->after('application_reference');
            $table->string('applicant_email', 255)->after('applicant_name');
            $table->string('applicant_phone', 20)->after('applicant_email');
            $table->text('resume_path')->after('applicant_phone');
            $table->text('cover_letter')->nullable()->after('resume_path');

            $table->index('applicant_email');
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropIndex(['applicant_email']);

            $table->dropColumn([
                'applicant_name',
                'applicant_email',
                'applicant_phone',
                'resume_path',
                'cover_letter',
            ]);
        });
    }
};
