<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Department;
use App\Models\Vacancy;
use App\Models\Donation;
use App\Models\AuditLog;
use App\Models\User;

class OperationalModelTest extends TestCase
{
    public function test_operational_tables_and_relations_work(): void
    {
        $department = Department::create([
            'name_bn' => 'পরীক্ষামূলক বিভাগ',
            'name_en' => 'Test Department',
            'slug' => 'test-department',
            'display_order' => 99,
        ]);

        $vacancy = Vacancy::create([
            'department_id' => $department->id,
            'title' => 'Software Engineer',
            'slug' => 'software-engineer-test',
            'description' => 'Develop applications',
            'requirements' => 'PHP & Laravel',
            'deadline' => now()->addDays(30),
        ]);

        $donation = Donation::create([
            'donor_name' => 'John Doe',
            'amount' => 5000.00,
            'payment_gateway' => 'bkash',
            'transaction_id' => 'TRX123456789',
            'status' => 'success',
        ]);

        $user = User::create([
            'email' => 'auditor@bff.org.bd',
            'password' => bcrypt('secret'),
        ]);

        $auditLog = AuditLog::create([
            'user_id' => $user->id,
            'action' => 'CREATED',
            'auditable_type' => Donation::class,
            'auditable_id' => $donation->id,
            'ip_address' => '127.0.0.1',
        ]);

        $this->assertDatabaseHas('vacancies', ['slug' => 'software-engineer-test']);
        $this->assertDatabaseHas('donations', ['transaction_id' => 'TRX123456789']);
        $this->assertDatabaseHas('audit_logs', ['action' => 'CREATED']);
        $this->assertEquals('Test Department', $vacancy->department->name_en);
    }
}
