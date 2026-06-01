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
            // $table->dropUnique(['collaborator_id', 'period_id']); // Eliminado para evitar error si no existe
            $table->dropForeign(['period_id']);
            $table->unsignedBigInteger('period_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->unsignedBigInteger('period_id')->nullable(false)->change();
            $table->foreign('period_id')->references('id')->on('periods')->restrictOnDelete();
            $table->unique(['collaborator_id', 'period_id']);
        });
    }
};
