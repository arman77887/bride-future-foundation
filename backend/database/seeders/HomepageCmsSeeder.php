<?php

namespace Database\Seeders;

use App\Models\CmsPage;
use App\Models\CmsPageSection;
use Illuminate\Database\Seeder;

class HomepageCmsSeeder extends Seeder
{
    public function run(): void
    {
        $page = CmsPage::updateOrCreate(
            ['slug' => 'homepage'],
            [
                'title_bn' => 'হোমপেজ',
                'title_en' => 'Homepage',

                'content_bn' => null,
                'content_en' => null,

                'status' => 'PUBLISHED',

                'seo_title_bn' => 'Bright Further Foundation',
                'seo_title_en' => 'Bright Further Foundation',

                'seo_description_bn' =>
                    'মানবিক সহায়তা, সামাজিক উন্নয়ন এবং মানুষের ভবিষ্যৎ নির্মাণে কাজ করা একটি সামাজিক উদ্যোগ।',

                'seo_description_en' =>
                    'A humanitarian and social welfare initiative working for people, communities and a better future.',

                'metadata' => [
                    'announcement' => [
                        'enabled' => true,
                        'bn' => 'মানবিকতা, দায়িত্ব ও ভবিষ্যৎ নির্মাণে আমাদের পথচলা',
                        'en' => 'Working together for humanity, responsibility and a better future',
                    ],

                    'hero' => [
                        'badge_bn' => 'ব্রাইড ফিউচার ফাউন্ডেশন',
                        'badge_en' => 'Bright Further Foundation',

                        'title_bn' => 'মানুষের জন্য কাজ, ভবিষ্যতের জন্য অঙ্গীকার',
                        'title_en' => 'Working for People. Building a Better Future.',

                        'description_bn' =>
                            'মানবিক সহায়তা, সামাজিক উন্নয়ন এবং মানুষের সম্ভাবনাকে সামনে রেখে আমরা একটি সুন্দর ও মর্যাদাপূর্ণ ভবিষ্যৎ গড়ার লক্ষ্যে কাজ করি।',

                        'description_en' =>
                            'We work toward a better and more dignified future through humanitarian support, social development and opportunities for people and communities.',

                        'primary_text_bn' => 'সহযোগিতা করুন',
                        'primary_text_en' => 'Support Our Work',
                        'primary_link' => '/donate',

                        'secondary_text_bn' => 'আমাদের সম্পর্কে',
                        'secondary_text_en' => 'Discover Our Work',
                        'secondary_link' => '/about',
                    ],

                    'commitment' => [
                        'label_bn' => 'আমাদের অঙ্গীকার',
                        'label_en' => 'Our Commitment',

                        'title_bn' => 'একসঙ্গে এগিয়ে চলি',
                        'title_en' => 'Moving Forward Together',

                        'items' => [
                            ['bn' => 'মানবিকতা', 'en' => 'Humanity'],
                            ['bn' => 'সামাজিক দায়িত্ব', 'en' => 'Social Responsibility'],
                            ['bn' => 'সমান সুযোগ', 'en' => 'Opportunity'],
                            ['bn' => 'টেকসই ভবিষ্যৎ', 'en' => 'Sustainable Future'],
                        ],
                    ],

                    'intro' => [
                        'label_bn' => 'আমাদের পরিচয়',
                        'label_en' => 'Who We Are',

                        'title_bn' => 'একটি দায়িত্বশীল ও মানবিক সমাজের জন্য',
                        'title_en' => 'For A More Caring and Responsible Society',

                        'content_bn' =>
                            'ব্রাইড ফিউচার ফাউন্ডেশন একটি মানবিক ও সামাজিক কল্যাণমূলক উদ্যোগ। মানুষের প্রয়োজন, সামাজিক দায়িত্ব এবং ভবিষ্যৎ প্রজন্মের সম্ভাবনাকে গুরুত্ব দিয়ে আমরা কার্যক্রম পরিচালনা করতে চাই।',

                        'content_en' =>
                            'Bright Further Foundation is a humanitarian and social welfare initiative. We focus on people’s needs, social responsibility and creating opportunities for future generations.',
                    ],

                    'impact' => [
                        'items' => [
                            ['number' => '01', 'bn' => 'মানবিক উদ্যোগ', 'en' => 'Initiatives'],
                            ['number' => '02', 'bn' => 'চলমান প্রকল্প', 'en' => 'Projects'],
                            ['number' => '03', 'bn' => 'সামাজিক কার্যক্রম', 'en' => 'Activities'],
                            ['number' => '04', 'bn' => 'আমাদের লক্ষ্য', 'en' => 'Our Commitment'],
                        ],
                    ],

                    'activities' => [
                        [
                            'number' => '01',
                            'title_bn' => 'মানবিক সহায়তা',
                            'title_en' => 'Humanitarian Support',
                            'text_bn' => 'প্রয়োজনের সময়ে মানুষের পাশে দাঁড়িয়ে বাস্তব ও কার্যকর সহযোগিতা পৌঁছে দেওয়া।',
                            'text_en' => 'Providing meaningful and practical support to people during times of need.',
                            'enabled' => true,
                        ],
                        [
                            'number' => '02',
                            'title_bn' => 'সামাজিক উন্নয়ন',
                            'title_en' => 'Social Development',
                            'text_bn' => 'সমাজের ইতিবাচক পরিবর্তন ও মানুষের জীবনমান উন্নয়নে বিভিন্ন উদ্যোগ গ্রহণ।',
                            'text_en' => 'Creating initiatives that contribute to positive social change and better lives.',
                            'enabled' => true,
                        ],
                        [
                            'number' => '03',
                            'title_bn' => 'যুব ও ভবিষ্যৎ',
                            'title_en' => 'Youth & Future',
                            'text_bn' => 'তরুণদের সম্ভাবনা বিকাশ এবং একটি শক্তিশালী ভবিষ্যৎ নির্মাণে সহযোগিতা।',
                            'text_en' => 'Supporting young people and helping create a stronger future.',
                            'enabled' => true,
                        ],
                    ],

                    'mission' => [
                        'label_bn' => 'আমাদের লক্ষ্য',
                        'label_en' => 'Our Mission',
                        'title_bn' => 'মানুষের কল্যাণে কার্যকর ভূমিকা রাখা',
                        'title_en' => 'Creating meaningful impact for people',
                        'content_bn' => 'মানবিক সহায়তা, সামাজিক দায়িত্ব এবং মানুষের ক্ষমতায়নের মাধ্যমে একটি কল্যাণমুখী সমাজ গড়ে তুলতে কাজ করা।',
                        'content_en' => 'To contribute to a caring society through humanitarian support, social responsibility and community empowerment.',
                    ],

                    'vision' => [
                        'label_bn' => 'আমাদের ভিশন',
                        'label_en' => 'Our Vision',
                        'title_bn' => 'একটি সম্ভাবনাময় ভবিষ্যৎ নির্মাণ',
                        'title_en' => 'Building a future full of possibility',
                        'content_bn' => 'এমন একটি সমাজের প্রত্যাশা যেখানে মানুষ মর্যাদা, নিরাপত্তা এবং সুযোগ নিয়ে সামনে এগিয়ে যেতে পারে।',
                        'content_en' => 'A future where people can move forward with dignity, security and meaningful opportunities.',
                    ],

                    'projects' => [
                        'label_bn' => 'আমাদের উদ্যোগ',
                        'label_en' => 'Featured Work',
                        'title_bn' => 'প্রধান প্রকল্পসমূহ',
                        'title_en' => 'Featured Projects',
                        'limit' => 3,
                    ],

                    'news' => [
                        'label_bn' => 'সর্বশেষ',
                        'label_en' => 'Latest',
                        'title_bn' => 'নিউজ ও আপডেট',
                        'title_en' => 'News & Updates',
                        'limit' => 3,
                    ],

                    'notices' => [
                        'label_bn' => 'গুরুত্বপূর্ণ তথ্য',
                        'label_en' => 'Important Information',
                        'title_bn' => 'নোটিশ',
                        'title_en' => 'Notices',
                        'limit' => 3,
                    ],

                    'gallery' => [
                        'label_bn' => 'আমাদের মুহূর্তগুলো',
                        'label_en' => 'Our Moments',
                        'title_bn' => 'আমাদের কার্যক্রমের ছবি দেখুন',
                        'title_en' => 'Explore moments from our activities',
                        'button_bn' => 'গ্যালারি দেখুন',
                        'button_en' => 'View Gallery',
                    ],

                    'donation' => [
                        'label_bn' => 'আপনিও অংশ নিন',
                        'label_en' => 'Be Part of the Change',

                        'title_bn' => 'আপনার সহযোগিতা একটি সুন্দর ভবিষ্যৎ গড়তে সাহায্য করতে পারে',
                        'title_en' => 'Your support can help build a better future',

                        'content_bn' => 'একটি ছোট সহযোগিতাও মানুষের জীবনে ইতিবাচক পরিবর্তনের অংশ হতে পারে।',
                        'content_en' => 'Even a small contribution can become part of meaningful positive change.',

                        'button_bn' => 'সহযোগিতা করুন →',
                        'button_en' => 'Support the Foundation →',

                        'button_link' => '/donate',
                    ],
                ],
            ]
        );

        $sections = [
            'announcement',
            'hero',
            'commitment',
            'intro',
            'impact',
            'activities',
            'mission',
            'vision',
            'projects',
            'news',
            'notices',
            'gallery',
            'donation',
        ];

        foreach ($sections as $index => $sectionKey) {
            CmsPageSection::updateOrCreate(
                [
                    'cms_page_id' => $page->id,
                    'section_key' => $sectionKey,
                ],
                [
                    'display_order' => $index,
                    'is_active' => true,
                ]
            );
        }
    }
}
