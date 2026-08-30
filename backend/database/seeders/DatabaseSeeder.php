<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RbacSeeder::class,
        ]);

        //[
            PermissionSeeder::class,
            RoleSeeder::class,
            DepartmentSeeder::class,
            PositionSeeder::class,
            SystemSettingSeeder::class,
        ]);
    }
}
