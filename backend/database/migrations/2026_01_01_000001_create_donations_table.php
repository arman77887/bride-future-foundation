<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('donor_name');
            $table->string('donor_email');
            $table->string('donor_phone');
            $table->decimal('amount', 18, 2);
            $table->string('currency', 3)->default('BDT');
            $table->string('payment_method');
            $table->string('transaction_id')->unique();
            $table->string('status')->default('PENDING');
            $table->text('evidence_path')->nullable();
            $table->text('admin_notes')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('donor_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
