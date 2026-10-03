<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->after('vacancy_id');
            $table->string('applicant_uid', 100)->nullable()->after('application_reference');
            $table->text('applicant_address')->nullable()->after('applicant_phone');
            $table->string('applicant_nid', 100)->nullable()->after('applicant_address');
            $table->string('applicant_passport', 100)->nullable()->after('applicant_nid');
            $table->text('photo_path')->nullable()->after('applicant_passport');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            $table->index('user_id');
            $table->index('applicant_uid');
        });

        DB::statement('ALTER TABLE job_applications ALTER COLUMN applicant_email DROP NOT NULL');
        DB::statement('ALTER TABLE job_applications ALTER COLUMN resume_path DROP NOT NULL');
    }

    public function down(): void
    {
        DB::statement("UPDATE job_applications SET applicant_email = '' WHERE applicant_email IS NULL");
        DB::statement("UPDATE job_applications SET resume_path = '' WHERE resume_path IS NULL");
        DB::statement('ALTER TABLE job_applications ALTER COLUMN applicant_email SET NOT NULL');
        DB::statement('ALTER TABLE job_applications ALTER COLUMN resume_path SET NOT NULL');

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['applicant_uid']);

            $table->dropColumn([
                'user_id',
                'applicant_uid',
                'applicant_address',
                'applicant_nid',
                'applicant_passport',
                'photo_path',
            ]);
        });
    }
};
