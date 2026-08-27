<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Department;
use App\Models\Position;
use App\Models\Role;
use App\Models\Permission;

class SeederTest extends TestCase
{
    public function test_seeders_populate_structural_data_correctly(): void
    {
        $this->seed();

        $this->assertDatabaseCount('departments', 5);
        $this->assertDatabaseCount('positions', 20);
        $this->assertDatabaseCount('roles', 5);
        $this->assertDatabaseHas('roles', ['slug' => 'super-admin']);
        $this->assertDatabaseHas('departments', ['slug' => 'executive-department']);
        $this->assertDatabaseHas('positions', ['slug' => 'ceo']);
    }
}
