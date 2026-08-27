<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('actor_id')->nullable();
            $table->string('action', 100);
            $table->string('module', 100);
            $table->string('entity_type', 100);
            $table->string('entity_id', 100)->nullable();
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->timestampTz('created_at')->useCurrent();

            $table->foreign('actor_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index('actor_id');
            $table->index(['entity_type', 'entity_id']);
            $table->index('created_at');
        });

        DB::unprepared("
            CREATE OR REPLACE FUNCTION prevent_audit_modification()
            RETURNS TRIGGER AS \$\$
            BEGIN
                RAISE EXCEPTION 'Audit logs are immutable and cannot be updated or deleted.';
            END;
            \$\$ LANGUAGE plpgsql;

            CREATE TRIGGER audit_immutable_trigger
            BEFORE UPDATE OR DELETE ON audit_logs
            FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS audit_immutable_trigger ON audit_logs;');
        DB::unprepared('DROP FUNCTION IF EXISTS prevent_audit_modification();');
        Schema::dropIfExists('audit_logs');
    }
};
