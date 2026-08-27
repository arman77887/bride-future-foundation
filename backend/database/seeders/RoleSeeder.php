<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Administrator', 'slug' => 'super-admin'],
            ['name' => 'Executive Director', 'slug' => 'executive-director'],
            ['name' => 'HR Officer', 'slug' => 'hr-officer'],
            ['name' => 'Finance Officer', 'slug' => 'finance-officer'],
            ['name' => 'Content Editor', 'slug' => 'content-editor'],
        ];

        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(['slug' => $roleData['slug']], $roleData);
            
            if ($role->slug === 'super-admin') {
                $role->permissions()->sync(Permission::all());
            }
        }
    }
}
