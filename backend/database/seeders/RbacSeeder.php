<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | ROLES
        |--------------------------------------------------------------------------
        */

        $roles = [
            [
                'name' => 'Developer',
                'slug' => 'developer',
            ],
            [
                'name' => 'President',
                'slug' => 'president',
            ],
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
            ],
            [
                'name' => 'Account Manager',
                'slug' => 'account-manager',
            ],
            [
                'name' => 'Recruitment Manager',
                'slug' => 'recruitment-manager',
            ],
            [
                'name' => 'Secretary',
                'slug' => 'secretary',
            ],
            [
                'name' => 'Media Manager',
                'slug' => 'media-manager',
            ],
            [
                'name' => 'Officer',
                'slug' => 'officer',
            ],
            [
                'name' => 'Auditor',
                'slug' => 'auditor',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                ['name' => $role['name']]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PERMISSIONS
        |--------------------------------------------------------------------------
        */

        $permissions = [
            // Dashboard
            ['name' => 'View Dashboard', 'slug' => 'dashboard.view', 'module' => 'dashboard'],

            // Officers
            ['name' => 'View Officers', 'slug' => 'officers.view', 'module' => 'officers'],
            ['name' => 'Create Officers', 'slug' => 'officers.create', 'module' => 'officers'],
            ['name' => 'Update Officers', 'slug' => 'officers.update', 'module' => 'officers'],
            ['name' => 'Verify Officers', 'slug' => 'officers.verify', 'module' => 'officers'],
            ['name' => 'Delete Officers', 'slug' => 'officers.delete', 'module' => 'officers'],

            // Vacancies
            ['name' => 'View Vacancies', 'slug' => 'vacancies.view', 'module' => 'vacancies'],
            ['name' => 'Create Vacancies', 'slug' => 'vacancies.create', 'module' => 'vacancies'],
            ['name' => 'Update Vacancies', 'slug' => 'vacancies.update', 'module' => 'vacancies'],
            ['name' => 'Delete Vacancies', 'slug' => 'vacancies.delete', 'module' => 'vacancies'],

            // Applications
            ['name' => 'View Applications', 'slug' => 'applications.view', 'module' => 'applications'],
            ['name' => 'Review Applications', 'slug' => 'applications.review', 'module' => 'applications'],
            ['name' => 'Update Application Status', 'slug' => 'applications.status', 'module' => 'applications'],

            // Donations
            ['name' => 'View Donations', 'slug' => 'donations.view', 'module' => 'donations'],
            ['name' => 'Verify Donations', 'slug' => 'donations.verify', 'module' => 'donations'],
            ['name' => 'Export Donations', 'slug' => 'donations.export', 'module' => 'donations'],

            // Donation Methods
            ['name' => 'View Donation Methods', 'slug' => 'donation-methods.view', 'module' => 'donation-methods'],
            ['name' => 'Create Donation Methods', 'slug' => 'donation-methods.create', 'module' => 'donation-methods'],
            ['name' => 'Update Donation Methods', 'slug' => 'donation-methods.update', 'module' => 'donation-methods'],
            ['name' => 'Delete Donation Methods', 'slug' => 'donation-methods.delete', 'module' => 'donation-methods'],

            // CMS
            ['name' => 'View CMS', 'slug' => 'cms.view', 'module' => 'cms'],
            ['name' => 'Create CMS Content', 'slug' => 'cms.create', 'module' => 'cms'],
            ['name' => 'Update CMS Content', 'slug' => 'cms.update', 'module' => 'cms'],
            ['name' => 'Delete CMS Content', 'slug' => 'cms.delete', 'module' => 'cms'],

            // News
            ['name' => 'View News', 'slug' => 'news.view', 'module' => 'news'],
            ['name' => 'Create News', 'slug' => 'news.create', 'module' => 'news'],
            ['name' => 'Update News', 'slug' => 'news.update', 'module' => 'news'],
            ['name' => 'Delete News', 'slug' => 'news.delete', 'module' => 'news'],

            // Events
            ['name' => 'View Events', 'slug' => 'events.view', 'module' => 'events'],
            ['name' => 'Create Events', 'slug' => 'events.create', 'module' => 'events'],
            ['name' => 'Update Events', 'slug' => 'events.update', 'module' => 'events'],
            ['name' => 'Delete Events', 'slug' => 'events.delete', 'module' => 'events'],

            // Projects
            ['name' => 'View Projects', 'slug' => 'projects.view', 'module' => 'projects'],
            ['name' => 'Create Projects', 'slug' => 'projects.create', 'module' => 'projects'],
            ['name' => 'Update Projects', 'slug' => 'projects.update', 'module' => 'projects'],
            ['name' => 'Delete Projects', 'slug' => 'projects.delete', 'module' => 'projects'],

            // Notices
            ['name' => 'View Notices', 'slug' => 'notices.view', 'module' => 'notices'],
            ['name' => 'Create Notices', 'slug' => 'notices.create', 'module' => 'notices'],
            ['name' => 'Update Notices', 'slug' => 'notices.update', 'module' => 'notices'],
            ['name' => 'Delete Notices', 'slug' => 'notices.delete', 'module' => 'notices'],

            // Gallery
            ['name' => 'View Gallery', 'slug' => 'gallery.view', 'module' => 'gallery'],
            ['name' => 'Create Gallery', 'slug' => 'gallery.create', 'module' => 'gallery'],
            ['name' => 'Update Gallery', 'slug' => 'gallery.update', 'module' => 'gallery'],
            ['name' => 'Delete Gallery', 'slug' => 'gallery.delete', 'module' => 'gallery'],

            // Documents
            ['name' => 'View Documents', 'slug' => 'documents.view', 'module' => 'documents'],
            ['name' => 'Create Documents', 'slug' => 'documents.create', 'module' => 'documents'],
            ['name' => 'Update Documents', 'slug' => 'documents.update', 'module' => 'documents'],
            ['name' => 'Delete Documents', 'slug' => 'documents.delete', 'module' => 'documents'],

            // Media
            ['name' => 'View Media', 'slug' => 'media.view', 'module' => 'media'],
            ['name' => 'Upload Media', 'slug' => 'media.create', 'module' => 'media'],
            ['name' => 'Delete Media', 'slug' => 'media.delete', 'module' => 'media'],

            // Users / RBAC
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Update Users', 'slug' => 'users.update', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],

            ['name' => 'View Roles', 'slug' => 'roles.view', 'module' => 'rbac'],
            ['name' => 'Manage Roles', 'slug' => 'roles.manage', 'module' => 'rbac'],
            ['name' => 'View Permissions', 'slug' => 'permissions.view', 'module' => 'rbac'],
            ['name' => 'Manage Permissions', 'slug' => 'permissions.manage', 'module' => 'rbac'],

            // Audit
            ['name' => 'View Audit Logs', 'slug' => 'audit.view', 'module' => 'audit'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'module' => $permission['module'],
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ROLE PERMISSIONS
        |--------------------------------------------------------------------------
        */

        $allPermissions = Permission::pluck('id')->all();

        // Developer = full system access
        $developer = Role::where('slug', 'developer')->first();
        $developer?->permissions()->sync($allPermissions);

        // President = full administrative access
        $president = Role::where('slug', 'president')->first();
        $president?->permissions()->sync($allPermissions);

        // Super Admin = full administrative access
        $superAdmin = Role::where('slug', 'super-admin')->first();
        $superAdmin?->permissions()->sync($allPermissions);

        // Account Manager
        $accountManager = Role::where('slug', 'account-manager')->first();
        $accountManager?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'donations.view',
                'donations.verify',
                'donations.export',
                'donation-methods.view',
                'donation-methods.create',
                'donation-methods.update',
                'donation-methods.delete',
            ])->pluck('id')
        );

        // Recruitment Manager
        $recruitment = Role::where('slug', 'recruitment-manager')->first();
        $recruitment?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'officers.view',
                'officers.create',
                'officers.update',
                'officers.verify',
                'vacancies.view',
                'vacancies.create',
                'vacancies.update',
                'vacancies.delete',
                'applications.view',
                'applications.review',
                'applications.status',
            ])->pluck('id')
        );

        // Secretary
        $secretary = Role::where('slug', 'secretary')->first();
        $secretary?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'officers.view',
                'vacancies.view',
                'applications.view',
                'applications.review',
                'news.view',
                'news.create',
                'news.update',
                'events.view',
                'events.create',
                'events.update',
                'projects.view',
                'projects.create',
                'projects.update',
                'notices.view',
                'notices.create',
                'notices.update',
                'documents.view',
            ])->pluck('id')
        );

        // Media Manager
        $media = Role::where('slug', 'media-manager')->first();
        $media?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'news.view',
                'news.create',
                'news.update',
                'news.delete',
                'events.view',
                'events.create',
                'events.update',
                'events.delete',
                'projects.view',
                'projects.create',
                'projects.update',
                'projects.delete',
                'gallery.view',
                'gallery.create',
                'gallery.update',
                'gallery.delete',
                'media.view',
                'media.create',
                'media.delete',
            ])->pluck('id')
        );

        // Officer
        $officer = Role::where('slug', 'officer')->first();
        $officer?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'officers.view',
                'vacancies.view',
                'applications.view',
            ])->pluck('id')
        );

        // Auditor
        $auditor = Role::where('slug', 'auditor')->first();
        $auditor?->permissions()->sync(
            Permission::whereIn('slug', [
                'dashboard.view',
                'donations.view',
                'donations.export',
                'audit.view',
                'officers.view',
                'vacancies.view',
                'applications.view',
            ])->pluck('id')
        );

        /*
        |--------------------------------------------------------------------------
        | ADMIN USERS
        |--------------------------------------------------------------------------
        */

        // Existing admin@example.com
        $adminUser = User::where('email', 'admin@example.com')->first();

        if ($adminUser) {
            $adminUser->update(['status' => 'ACTIVE']);

            $adminRole = Role::where('slug', 'super-admin')->first();

            if ($adminRole) {
                $adminUser->roles()->syncWithoutDetaching([$adminRole->id]);
            }
        }

        // Existing user gets developer access if already present
        $developerUser = User::where(
            'email',
            'tha.crypticx.official@gmail.com'
        )->first();

        if ($developerUser) {
            $developerUser->update(['status' => 'ACTIVE']);

            $developerRole = Role::where('slug', 'developer')->first();

            if ($developerRole) {
                $developerUser->roles()->syncWithoutDetaching([$developerRole->id]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | REMOVE OLD GENERIC ADMIN ROLE FROM ADMIN USERS
        |--------------------------------------------------------------------------
        */

        $oldAdminRole = Role::where('slug', 'admin')->first();

        if ($oldAdminRole) {
            $oldAdminRoleId = $oldAdminRole->id;

            User::whereIn('email', [
                'admin@example.com',
                'tha.crypticx.official@gmail.com',
            ])->get()->each(function (User $user) use ($oldAdminRoleId) {
                $user->roles()->detach($oldAdminRoleId);
            });

            DB::table('role_permissions')
                ->where('role_id', $oldAdminRoleId)
                ->delete();

            $oldAdminRole->delete();
        }

        $this->command?->info('RBAC seeded successfully.');
    }
}
