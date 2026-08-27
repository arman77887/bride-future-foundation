<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donation_methods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name_bn');
            $table->string('name_en');
            $table->text('instructions_bn')->nullable();
            $table->text('instructions_en')->nullable();
            $table->string('payment_type'); // e.g., bkash, nagad, bank_transfer
            $table->string('account_identifier'); // e.g., phone number or IBAN
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_methods');
    }
};
