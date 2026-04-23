<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('evaluation_categories', function (Blueprint $table) {
            if (! Schema::hasColumn('evaluation_categories', 'role')) {
                $table->string('role', 20)->default('ventas')->after('evaluation_type_id')->index();
            }
        });

        $database = DB::connection()->getDatabaseName();

        if (! $this->indexExists($database, 'evaluation_categories', 'evaluation_categories_evaluation_type_id_name_role_unique')) {
            Schema::table('evaluation_categories', function (Blueprint $table) {
                $table->unique(['evaluation_type_id', 'name', 'role']);
            });
        }

        if ($this->indexExists($database, 'evaluation_categories', 'evaluation_categories_evaluation_type_id_name_unique')) {
            Schema::table('evaluation_categories', function (Blueprint $table) {
                $table->dropUnique('evaluation_categories_evaluation_type_id_name_unique');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $database = DB::connection()->getDatabaseName();

        if (! $this->indexExists($database, 'evaluation_categories', 'evaluation_categories_evaluation_type_id_name_unique')) {
            Schema::table('evaluation_categories', function (Blueprint $table) {
                $table->unique(['evaluation_type_id', 'name']);
            });
        }

        if ($this->indexExists($database, 'evaluation_categories', 'evaluation_categories_evaluation_type_id_name_role_unique')) {
            Schema::table('evaluation_categories', function (Blueprint $table) {
                $table->dropUnique('evaluation_categories_evaluation_type_id_name_role_unique');
            });
        }

        Schema::table('evaluation_categories', function (Blueprint $table) {
            if (Schema::hasColumn('evaluation_categories', 'role')) {
                $table->dropColumn('role');
            }
        });
    }

    private function indexExists(?string $database, string $table, string $indexName): bool
    {
        if (! $database) {
            return false;
        }

        $result = DB::selectOne(
            'select count(*) as count from information_schema.statistics where table_schema = ? and table_name = ? and index_name = ?',
            [$database, $table, $indexName],
        );

        return $result?->count > 0;
    }
};
