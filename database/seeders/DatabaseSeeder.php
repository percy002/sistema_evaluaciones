<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::query()->updateOrCreate([
            'email' => 'admin@admin.com',
        ], [
            'name' => 'admin',
            'role' => UserRole::Administrator,
            'password' => Hash::make('admin'),
            'email_verified_at' => now(),
        ]);
    }
}
