import { useEffect, useState } from 'react';
import { Search, X, ChevronDown, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactSubmission } from '../../lib/types';
import { formatDateShort } from '../../lib/format';

const MODAL_LABEL = 'block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5';

function statusColor(status: ContactSubmission['status']): string {
  switch (status) {
    case 'new':
      return 'bg-amber-900/40 text-amber-400';
    case 'read':
      return 'bg-sky-900/40 text-sky-400';
    case 'replied':
      return 'bg-green-900/40 text-green-400';
    case 'spam':
      return 'bg-red-900/40 text-red-400';
  }
}

function preview(msg: string, len = 70): string {
  const trimmed = msg.trim().replace(/\s+/g, ' ');
  return trimmed.length > len ? trimmed.slice(0, len) + '…' : trimmed;
}

export default function AdminContacts() {
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactSubmission['status']>('all');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [editStatus, setEditStatus] = useState<ContactSubmission['status']>('new');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRows(data as ContactSubmission[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = rows.filter((r) => {
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (row: ContactSubmission) => {
    setSelected(row);
    // New submissions auto-advance to 'read' on save
    setEditStatus(row.status === 'new' ? 'read' : row.status);
    setEditNotes(row.admin_notes);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await supabase
      .from('contact_submissions')
      .update({ status: editStatus, admin_notes: editNotes })
      .eq('id', selected.id);
    setSaving(false);
    setSelected(null);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by name, email, or message..."
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="input-field appearance-none pr-10 min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="spam">Spam</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      <div className="bg-nautical-blue rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Received', 'Name', 'Email', 'Message', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => openDetail(r)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-sm text-slate-400 whitespace-nowrap">
                      {formatDateShort(r.created_at.slice(0, 10))}
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-white">{r.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{r.email}</td>
                    <td className="px-5 py-3 text-sm text-slate-400 max-w-md">{preview(r.message)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor(r.status)}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-nautical-blue rounded-xl border border-white/10 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white uppercase">
                {selected.name}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <span className={MODAL_LABEL}>Received</span>
                <p className="text-sm text-slate-300">
                  {formatDateShort(selected.created_at.slice(0, 10))}
                </p>
              </div>
              <div>
                <span className={MODAL_LABEL}>Email</span>
                <a
                  href={`mailto:${selected.email}?subject=Re: your Fish The Wahoo inquiry`}
                  className="text-sm text-accent-orange hover:underline inline-flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div>
                  <span className={MODAL_LABEL}>Phone</span>
                  <a
                    href={`tel:${selected.phone.replace(/\D/g, '')}`}
                    className="text-sm text-accent-orange hover:underline"
                  >
                    {selected.phone}
                  </a>
                </div>
              )}
              <div>
                <span className={MODAL_LABEL}>Message</span>
                <p className="text-sm text-slate-200 whitespace-pre-wrap bg-nautical-dark/60 border border-white/5 rounded p-3">
                  {selected.message}
                </p>
              </div>
              <div>
                <label className={MODAL_LABEL}>Status</label>
                <div className="relative">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ContactSubmission['status'])}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="spam">Spam</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={MODAL_LABEL}>Admin Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Internal notes (not visible to customer)..."
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 py-3 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="btn-outline px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
