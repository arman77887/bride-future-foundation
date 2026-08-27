<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('donation_method_id');
            $table->string('donor_name', 255)->nullable();
            $table->decimal('amount', 18, 2);
            $table->string('currency_code', 3)->default('BDT');
            $table->string('transaction_id', 150)->unique();
            $table->string('sender_info', 255)->nullable();
            $table->string('screenshot_path', 255);
            $table->string('status', 50)->default('PENDING');
            $table->uuid('verified_by')->nullable();
            $table->text('verification_notes')->nullable();
            $table->timestamps();

            $table->foreign('donation_method_id')->references('id')->on('donation_methods')->onDelete('restrict');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
        });

        DB::statement("ALTER TABLE donations ADD CONSTRAINT check_donation_status CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REVERSED'));");
        
        Schema::table('donations', function (Blueprint $table) {
            $table->index('transaction_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
