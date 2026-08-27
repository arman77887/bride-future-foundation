<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name_bn' => 'নির্বাহী বিভাগ', 'name_en' => 'Executive Department', 'slug' => 'executive-department', 'display_order' => 1],
            ['name_bn' => 'মানব সম্পদ ও প্রশাসন', 'name_en' => 'Human Resources & Administration', 'slug' => 'hr-administration', 'display_order' => 2],
            ['name_bn' => 'অর্থ ও হিসাব রক্ষণ', 'name_en' => 'Finance & Accounts', 'slug' => 'finance-accounts', 'display_order' => 3],
            ['name_bn' => 'প্রোগ্রাম ও প্রকল্প বাস্তবায়ন', 'name_en' => 'Program & Project Implementation', 'slug' => 'program-implementation', 'display_order' => 4],
            ['name_bn' => 'আইসিটি ও মিডিয়া', 'name_en' => 'ICT & Media', 'slug' => 'ict-media', 'display_order' => 5],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(['slug' => $dept['slug']], $dept);
        }
    }
}
