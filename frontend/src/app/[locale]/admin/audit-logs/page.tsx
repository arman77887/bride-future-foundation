'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';

interface Actor {
  id: string;
  uid: string;
  name: string | null;
  email: string;
}

interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  module: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string;
  created_at: string;
  actor: Actor | null;
}

interface Pagination<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

interface FilterResponse {
  modules: string[];
  actions: string[];
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);

  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');
  const [action, setAction] = useState('');
  const [actorId, setActorId] = useState('');
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination<AuditLog> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const locale =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/')[1]
      : 'en';

  const isBn = locale === 'bn';

  const text = useMemo(
    () => ({
      title: isBn ? 'অডিট লগ' : 'Audit Logs',
      subtitle: isBn
        ? 'সিস্টেমে সম্পাদিত প্রশাসনিক কার্যক্রমের রেকর্ড'
        : 'Records of administrative activities performed in the system',
      search: isBn ? 'সার্চ করুন...' : 'Search...',
      allModules: isBn ? 'সব মডিউল' : 'All Modules',
      allActions: isBn ? 'সব অ্যাকশন' : 'All Actions',
      allActors: isBn ? 'সব ব্যবহারকারী' : 'All Actors',
      action: isBn ? 'অ্যাকশন' : 'Action',
      module: isBn ? 'মডিউল' : 'Module',
      actor: isBn ? 'ব্যবহারকারী' : 'Actor',
      entity: isBn ? 'এনটিটি' : 'Entity',
      ip: isBn ? 'IP ঠিকানা' : 'IP Address',
      date: isBn ? 'তারিখ ও সময়' : 'Date & Time',
      details: isBn ? 'বিস্তারিত' : 'Details',
      oldValues: isBn ? 'পুরোনো তথ্য' : 'Old Values',
      newValues: isBn ? 'নতুন তথ্য' : 'New Values',
      userAgent: isBn ? 'User Agent' : 'User Agent',
      noLogs: isBn ? 'কোনো অডিট লগ পাওয়া যায়নি।' : 'No audit logs found.',
      loading: isBn ? 'লোড হচ্ছে...' : 'Loading...',
      previous: isBn ? 'আগের' : 'Previous',
      next: isBn ? 'পরের' : 'Next',
      page: isBn ? 'পৃষ্ঠা' : 'Page',
      of: isBn ? 'এর মধ্যে' : 'of',
      total: isBn ? 'মোট' : 'Total',
      error: isBn
        ? 'অডিট লগ লোড করা যায়নি।'
        : 'Failed to load audit logs.',
    }),
    [isBn]
  );

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [search, module, action, actorId, page]);

  async function loadFilters() {
    try {
      const [filterResponse, usersResponse] = await Promise.all([
        api.get<FilterResponse>('/audit-logs/filters'),
        api.get<Pagination<Actor>>('/users?per_page=100'),
      ]);

      setModules(filterResponse.data.modules || []);
      setActions(filterResponse.data.actions || []);

      const userList = usersResponse.data.data || [];
      setActors(userList);
    } catch {
      // Filters are optional; logs can still load.
    }
  }

  async function loadLogs() {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set('search', search.trim());
      if (module) params.set('module', module);
      if (action) params.set('action', action);
      if (actorId) params.set('actor_id', actorId);

      params.set('page', String(page));
      params.set('per_page', '25');

      const response = await api.get<Pagination<AuditLog>>(
        `/audit-logs?${params.toString()}`
      );

      setLogs(response.data.data || []);
      setPagination(response.data);
    } catch (err) {
      console.error(err);
      setError(text.error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch('');
    setModule('');
    setAction('');
    setActorId('');
    setPage(1);
    setExpanded(null);
  }

  function formatDate(value: string) {
    try {
      return new Intl.DateTimeFormat(isBn ? 'bn-BD' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value));
    } catch {
      return value;
    }
  }

  function formatJson(value: Record<string, unknown> | null) {
    if (!value) return null;

    return JSON.stringify(value, null, 2);
  }

  function actionClass(value: string) {
    const upper = value.toUpperCase();

    if (
      upper.includes('DELETE') ||
      upper.includes('DELETED') ||
      upper.includes('FAILED')
    ) {
      return 'bg-red-100 text-red-700';
    }

    if (
      upper.includes('UPDATE') ||
      upper.includes('UPDATED') ||
      upper.includes('STATUS_CHANGED')
    ) {
      return 'bg-amber-100 text-amber-700';
    }

    if (
      upper.includes('CREATE') ||
      upper.includes('CREATED') ||
      upper.includes('UPLOADED') ||
      upper.includes('SUBMITTED')
    ) {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-blue-100 text-blue-700';
  }

  return (
    <div className="bff-page space-y-6">
      <div className="bff-fade">
        <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{text.subtitle}</p>
      </div>

      <div className="bff-card bff-fade rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {text.search}
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={text.search}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {text.module}
            </label>

            <select
              value={module}
              onChange={(e) => {
                setModule(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">{text.allModules}</option>
              {modules.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {text.action}
            </label>

            <select
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">{text.allActions}</option>
              {actions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {text.actor}
            </label>

            <select
              value={actorId}
              onChange={(e) => {
                setActorId(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">{text.allActors}</option>

              {actors.map((actor) => (
                <option key={actor.id} value={actor.id}>
                  {actor.name || actor.email} ({actor.uid})
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || module || action || actorId) && (
          <div className="mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="bff-button rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bff-card overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            {text.loading}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            {text.noLogs}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.date}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.action}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.module}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.actor}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.entity}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.ip}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {text.details}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.map((log) => {
                    const isExpanded = expanded === log.id;

                    return (
                      <tr key={log.id} className="align-top">
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                          {formatDate(log.created_at)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${actionClass(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                          {log.module}
                        </td>

                        <td className="px-4 py-4">
                          {log.actor ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {log.actor.name || log.actor.email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {log.actor.uid}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        <td className="max-w-xs px-4 py-4">
                          <div className="truncate text-sm text-gray-700">
                            {log.entity_type}
                          </div>
                          {log.entity_id && (
                            <div className="truncate text-xs text-gray-400">
                              {log.entity_id}
                            </div>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                          {log.ip_address || '—'}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(isExpanded ? null : log.id)
                            }
                            className="bff-button rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            {isExpanded
                              ? isBn
                                ? 'বন্ধ করুন'
                                : 'Collapse'
                              : text.details}
                          </button>

                          {isExpanded && (
                            <div className="mt-4 w-[420px] max-w-[80vw] space-y-4">
                              {log.old_values && (
                                <div>
                                  <div className="mb-1 text-xs font-semibold text-gray-700">
                                    {text.oldValues}
                                  </div>
                                  <pre className="max-h-64 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                                    {formatJson(log.old_values)}
                                  </pre>
                                </div>
                              )}

                              {log.new_values && (
                                <div>
                                  <div className="mb-1 text-xs font-semibold text-gray-700">
                                    {text.newValues}
                                  </div>
                                  <pre className="max-h-64 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                                    {formatJson(log.new_values)}
                                  </pre>
                                </div>
                              )}

                              <div>
                                <div className="mb-1 text-xs font-semibold text-gray-700">
                                  {text.userAgent}
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 text-xs break-all text-gray-600">
                                  {log.user_agent || '—'}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  {text.total}: {pagination.total}
                  {' • '}
                  {text.page} {pagination.current_page} {text.of}{' '}
                  {pagination.last_page}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.current_page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="bff-button rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {text.previous}
                  </button>

                  <span className="min-w-10 text-center text-sm font-medium text-gray-700">
                    {pagination.current_page}
                  </span>

                  <button
                    type="button"
                    disabled={
                      pagination.current_page >= pagination.last_page
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination.last_page, current + 1)
                      )
                    }
                    className="bff-button rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {text.next}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
