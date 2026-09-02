<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemSetting;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name_bn', 'value' => 'ব্রাইট ফিউচার ফাউন্ডেশন', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'site_name_en', 'value' => 'Bright Future Foundation', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'contact_email', 'value' => 'info@bff.org.bd', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'system', 'is_public' => false],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
