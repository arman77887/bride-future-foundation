<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_menu_items', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(DB::raw('gen_random_uuid()'));

            $table->uuid('cms_menu_id');
            $table->uuid('parent_id')->nullable();

            $table->string('label_bn', 150);
            $table->string('label_en', 150);
            $table->string('url', 255)->nullable();
            $table->string('route', 150)->nullable();
            $table->integer('display_order')->default(0);
            $table->string('target', 50)->default('_self');

            $table->timestamps();

            $table->foreign('cms_menu_id')
                ->references('id')
                ->on('cms_menus')
                ->onDelete('cascade');
        });

        Schema::table('cms_menu_items', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')
                ->on('cms_menu_items')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_menu_items');
    }
};
