'use client';

import AdminCrud from '@/components/admin/AdminCrud';

export default function DocumentsPage() {
  return (
    <AdminCrud
      title="Public Documents"
      titleBn="পাবলিক ডকুমেন্ট ব্যবস্থাপনা"
      endpoint="/public-documents"
      fields={[
        'title_bn',
        'title_en',
        'description_bn',
        'description_en',
        'document_url',
        'document_type',
      ]}
    />
  );
}
