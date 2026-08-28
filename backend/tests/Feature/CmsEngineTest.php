<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\CmsPage;

class CmsEngineTest extends TestCase
{
    public function test_cms_page_crud_publishing_and_audit_logging(): void
    {
        $admin = User::create([
            'email' => 'admin_cms@bff.org.bd',
            'password' => bcrypt('secret'),
            'status' => 'active',
        ]);
        $role = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        $admin->roles()->attach($role);

        $this->actingAs($admin, 'sanctum');

        $response = $this->postJson('/api/v1/cms-pages', [
            'slug' => 'about-us',
            'title_bn' => 'আমাদের সম্পর্কে',
            'title_en' => 'About Us',
            'content_bn' => 'ব্রীড ফিউচার ফাউন্ডেশন সম্পর্কে বিস্তারিত।',
            'content_en' => 'Detailed info about Bride Future Foundation.',
            'status' => 'PUBLISHED',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.slug', 'about-us')
                 ->assertJsonPath('data.status', 'PUBLISHED');

        $pageId = $response->json('data.id');

        $publicResponse = $this->getJson('/api/v1/cms-pages/about-us');
        $publicResponse->assertStatus(200)
                        ->assertJsonPath('data.title_en', 'About Us');

        $this->assertDatabaseHas('audit_logs', ['action' => 'PAGE_CREATED']);
    }
}
