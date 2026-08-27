<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('application_answers', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('application_id');
            $table->uuid('field_id');
            $table->text('answer_value');
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('application_id')->references('id')->on('job_applications')->onDelete('cascade');
            $table->foreign('field_id')->references('id')->on('application_fields')->onDelete('cascade');
            $table->unique(['application_id', 'field_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_answers');
    }
};
