<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],
            
            ['name' => 'View Officers', 'slug' => 'officers.view', 'module' => 'officers'],
            ['name' => 'Verify Officers', 'slug' => 'officers.verify', 'module' => 'officers'],
            ['name' => 'Manage Officers', 'slug' => 'officers.manage', 'module' => 'officers'],

            ['name' => 'View Vacancies', 'slug' => 'vacancies.view', 'module' => 'vacancies'],
            ['name' => 'Manage Vacancies', 'slug' => 'vacancies.manage', 'module' => 'vacancies'],
            ['name' => 'Review Applications', 'slug' => 'applications.review', 'module' => 'vacancies'],

            ['name' => 'View Donations', 'slug' => 'donations.view', 'module' => 'donations'],
            ['name' => 'Verify Donations', 'slug' => 'donations.verify', 'module' => 'donations'],

            ['name' => 'Manage CMS', 'slug' => 'cms.manage', 'module' => 'cms'],
            ['name' => 'View Audit Logs', 'slug' => 'audit_logs.view', 'module' => 'security'],
            ['name' => 'Manage Settings', 'slug' => 'settings.manage', 'module' => 'settings'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
