<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            ['title_bn' => 'প্রধান নির্বাহী কর্মকর্তা (সিইও)', 'title_en' => 'Chief Executive Officer (CEO)', 'slug' => 'ceo', 'display_order' => 1],
            ['title_bn' => 'নির্বাহী পরিচালক', 'title_en' => 'Executive Director', 'slug' => 'executive-director', 'display_order' => 2],
            ['title_bn' => 'পরিচালক (প্রোগ্রাম)', 'title_en' => 'Director (Program)', 'slug' => 'director-program', 'display_order' => 3],
            ['title_bn' => 'পরিচালক (অর্থ)', 'title_en' => 'Director (Finance)', 'slug' => 'director-finance', 'display_order' => 4],
            ['title_bn' => 'পরিচালক (প্রশাসন)', 'title_en' => 'Director (Administration)', 'slug' => 'director-administration', 'display_order' => 5],
            ['title_bn' => 'উপ-পরিচালক', 'title_en' => 'Deputy Director', 'slug' => 'deputy-director', 'display_order' => 6],
            ['title_bn' => 'সহকারী পরিচালক', 'title_en' => 'Assistant Director', 'slug' => 'assistant-director', 'display_order' => 7],
            ['title_bn' => 'প্রকল্প ব্যবস্থাপক', 'title_en' => 'Project Manager', 'slug' => 'project-manager', 'display_order' => 8],
            ['title_bn' => 'এইচআর ম্যানেজার', 'title_en' => 'HR Manager', 'slug' => 'hr-manager', 'display_order' => 9],
            ['title_bn' => 'হিসাবরক্ষক কর্মকর্তা', 'title_en' => 'Accounts Officer', 'slug' => 'accounts-officer', 'display_order' => 10],
            ['title_bn' => 'আইসিটি কর্মকর্তা', 'title_en' => 'ICT Officer', 'slug' => 'ict-officer', 'display_order' => 11],
            ['title_bn' => 'মাঠ সমন্বয়কারী', 'title_en' => 'Field Coordinator', 'slug' => 'field-coordinator', 'display_order' => 12],
            ['title_bn' => 'কম্যুনিকেশন অফিসার', 'title_en' => 'Communication Officer', 'slug' => 'communication-officer', 'display_order' => 13],
            ['title_bn' => 'গবেষণা কর্মকর্তা', 'title_en' => 'Research Officer', 'slug' => 'research-officer', 'display_order' => 14],
            ['title_bn' => 'অফিস সহকারী', 'title_en' => 'Office Assistant', 'slug' => 'office-assistant', 'display_order' => 15],
            ['title_bn' => 'আইনি উপদেষ্টা', 'title_en' => 'Legal Advisor', 'slug' => 'legal-advisor', 'display_order' => 16],
            ['title_bn' => 'জনসংযোগ কর্মকর্তা', 'title_en' => 'Public Relations Officer', 'slug' => 'public-relations-officer', 'display_order' => 17],
            ['title_bn' => 'লজিস্টিক অফিসার', 'title_en' => 'Logistics Officer', 'slug' => 'logistics-officer', 'display_order' => 18],
            ['title_bn' => 'মনিটরিং ও মূল্যায়ন কর্মকর্তা', 'title_en' => 'Monitoring & Evaluation Officer', 'slug' => 'monitoring-evaluation-officer', 'display_order' => 19],
            ['title_bn' => 'স্বেচ্ছাসেবক সমন্বয়কারী', 'title_en' => 'Volunteer Coordinator', 'slug' => 'volunteer-coordinator', 'display_order' => 20],
        ];

        foreach ($positions as $position) {
            Position::updateOrCreate(['slug' => $position['slug']], $position);
        }
    }
}
