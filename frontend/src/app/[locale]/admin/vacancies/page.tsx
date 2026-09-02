'use client';

import AdminCrud from '@/components/admin/AdminCrud';

export default function VacanciesPage() {
  return (
    <AdminCrud
      title="Vacancies"
      titleBn="চাকরির বিজ্ঞপ্তি ব্যবস্থাপনা"
      endpoint="/vacancies"
      updateEnabled={false}
      deleteEnabled={false}
      fields={[
        'title_bn',
        'title_en',
        'description_bn',
        'description_en',
        'location',
        'employment_type',
        'deadline',
      ]}
    />
  );
}
