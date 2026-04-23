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
        Schema::table('collaborators', function (Blueprint $table) {
            if (! Schema::hasColumn('collaborators', 'role')) {
                $table->string('role', 20)->default('ventas')->after('position')->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('collaborators', function (Blueprint $table) {
            if (Schema::hasColumn('collaborators', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
