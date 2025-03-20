<?php

namespace Database\Seeders;

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
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@puskesmaspana.com',
            'nik' => '1234567890123456',
            'phone' => '081234567890',
            'address' => 'Puskesmas Pana, Kabupaten Mamasa',
            'gender' => 'male',
            'birthdate' => '1990-01-01',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);
    }
}
