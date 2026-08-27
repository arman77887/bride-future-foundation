<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('application_fields', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('vacancy_id');
            $table->string('label_bn');
            $table->string('label_en');
            $table->string('field_key', 100);
            $table->string('field_type', 50);
            $table->boolean('is_required')->default(false);
            $table->boolean('is_enabled')->default(true);
            $table->integer('field_order')->default(0);
            $table->boolean('is_sensitive')->default(false);
            $table->boolean('encryption_required')->default(false);
            $table->jsonb('validation_rules')->nullable();
            $table->string('visibility_policy', 100)->default('internal_only');
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('cascade');
            $table->unique(['vacancy_id', 'field_key']);
        });

        DB::statement("ALTER TABLE application_fields ADD CONSTRAINT check_field_type CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'email', 'phone', 'select', 'radio', 'checkbox', 'file'));");
    }

    public function down(): void
    {
        Schema::dropIfExists('application_fields');
    }
};
