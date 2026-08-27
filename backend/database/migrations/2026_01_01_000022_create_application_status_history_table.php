<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('application_status_history', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('application_id');
            $table->uuid('changed_by')->nullable();
            $table->string('previous_status', 50);
            $table->string('new_status', 50);
            $table->text('note')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('application_id')->references('id')->on('job_applications')->onDelete('restrict');
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_status_history');
    }
};
