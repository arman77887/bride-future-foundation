'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';

type Status = 'new' | 'read' | 'replied' | 'closed';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: Status;
  read_at: string | null;
  created_at: string;
};

export default function ContactMessagesPage() {
  const params = useParams();
  const isBn = params?.locale === 'bn';

  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'all' | Status>('all');
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/contact-messages', {
        params: status === 'all' ? {} : { status },
      });

      const data = response?.data?.data;

      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isBn ? 'বার্তা লোড করা যায়নি।' : 'Failed to load messages.')
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function openMessage(item: ContactMessage) {
    try {
      const response = await api.get(`/admin/contact-messages/${item.id}`);
      setSelected(response?.data?.data || item);
      await load();
    } catch {
      setSelected(item);
    }
  }

  async function changeStatus(id: string, nextStatus: Status) {
    try {
      setSaving(true);

      const response = await api.put(
        `/admin/contact-messages/${id}/status`,
        { status: nextStatus }
      );

      const updated = response?.data?.data;

      if (selected?.id === id && updated) {
        setSelected(updated);
      }

      await load();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isBn ? 'স্ট্যাটাস পরিবর্তন করা যায়নি।' : 'Failed to update status.')
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeMessage(id: string) {
    if (
      !window.confirm(
        isBn
          ? 'এই বার্তাটি মুছে ফেলতে চান?'
          : 'Are you sure you want to delete this message?'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setSelected(null);
      await load();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isBn ? 'বার্তাটি মুছে ফেলা যায়নি।' : 'Failed to delete message.')
      );
    }
  }

  const statusLabel = (value: Status) => {
    const labels: Record<Status, string> = {
      new: isBn ? 'নতুন' : 'New',
      read: isBn ? 'পঠিত' : 'Read',
      replied: isBn ? 'উত্তর দেওয়া হয়েছে' : 'Replied',
      closed: isBn ? 'বন্ধ' : 'Closed',
    };

    return labels[value];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isBn ? 'যোগাযোগের বার্তা' : 'Contact Messages'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isBn
              ? 'ওয়েবসাইট থেকে আসা যোগাযোগের বার্তা পরিচালনা করুন।'
              : 'View and manage messages submitted through the website.'}
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {isBn ? 'রিফ্রেশ' : 'Refresh'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'read', 'replied', 'closed'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              status === item
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {item === 'all'
              ? isBn
                ? 'সব'
                : 'All'
              : statusLabel(item)}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {isBn ? 'কোনো বার্তা পাওয়া যায়নি।' : 'No messages found.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openMessage(item)}
                  className="block w-full px-5 py-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {item.email}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-gray-700">
                        {item.subject}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {statusLabel(item.status)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {!selected ? (
            <div className="flex min-h-[300px] items-center justify-center text-center text-gray-400">
              {isBn
                ? 'বিস্তারিত দেখতে একটি বার্তা নির্বাচন করুন।'
                : 'Select a message to view its details.'}
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selected.name} · {selected.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <strong>{isBn ? 'নাম:' : 'Name:'}</strong> {selected.name}
                </p>

                <p>
                  <strong>{isBn ? 'ইমেইল:' : 'Email:'}</strong>{' '}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>

                {selected.phone && (
                  <p>
                    <strong>{isBn ? 'ফোন:' : 'Phone:'}</strong>{' '}
                    {selected.phone}
                  </p>
                )}

                <p>
                  <strong>{isBn ? 'তারিখ:' : 'Date:'}</strong>{' '}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {selected.message}
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  {isBn ? 'স্ট্যাটাস' : 'Status'}
                </p>

                <select
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) =>
                    changeStatus(
                      selected.id,
                      e.target.value as Status
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="new">{statusLabel('new')}</option>
                  <option value="read">{statusLabel('read')}</option>
                  <option value="replied">{statusLabel('replied')}</option>
                  <option value="closed">{statusLabel('closed')}</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeMessage(selected.id)}
                className="mt-5 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                {isBn ? 'বার্তা মুছুন' : 'Delete Message'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
