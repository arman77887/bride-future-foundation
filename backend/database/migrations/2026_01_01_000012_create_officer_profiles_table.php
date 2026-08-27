<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('officer_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('user_id')->unique();
            $table->uuid('department_id');
            $table->uuid('position_id');
            $table->string('official_id', 50)->unique();
            $table->string('status')->default('INCOMPLETE');
            $table->boolean('is_public')->default(false);
            $table->string('name');
            $table->text('bio_bn')->nullable();
            $table->text('bio_en')->nullable();
            $table->string('avatar_url')->nullable();
            $table->text('email_personal')->nullable();
            $table->text('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('dob')->nullable();
            $table->text('nid')->nullable();
            $table->text('passport')->nullable();
            $table->text('emergency_contact')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('restrict');
            $table->foreign('position_id')->references('id')->on('positions')->onDelete('restrict');
        });

        DB::statement("ALTER TABLE officer_profiles ADD CONSTRAINT check_officer_status CHECK (status IN ('INCOMPLETE', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'));");
        
        Schema::table('officer_profiles', function (Blueprint $table) {
            $table->index('official_id');
            $table->index('status');
            $table->index('department_id');
            $table->index('position_id');
        });
        
        DB::statement("CREATE INDEX idx_officer_public ON officer_profiles (is_public) WHERE is_public = true;");
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_profiles');
    }
};
