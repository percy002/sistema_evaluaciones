<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->index('collaborator_id');
            $table->dropUnique(['collaborator_id', 'period_id']);
            $table->index(['collaborator_id', 'period_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->dropIndex(['collaborator_id', 'period_id']);
            $table->dropIndex(['collaborator_id']);
            $table->unique(['collaborator_id', 'period_id']);
        });
    }
};
