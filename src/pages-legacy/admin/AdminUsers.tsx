import { useEffect, useState } from 'react';
import { Search, X, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDateShort } from '../../lib/format';

interface AdminUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  invited_at: string | null;
  email_confirmed_at: string | null;
}

const MODAL_LABEL = 'block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5';

function userStatus(u: AdminUser): { label: string; color: string } {
  if (!u.email_confirmed_at && u.invited_at) {
    return { label: 'Invited', color: 'bg-amber-900/40 text-amber-400' };
  }
  if (u.last_sign_in_at) {
    return { label: 'Active', color: 'bg-green-900/40 text-green-400' };
  }
  return { label: 'Pending', color: 'bg-sky-900/40 text-sky-400' };
}

async function callAdminUsers<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('admin-users', { body });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    throw new Error(message);
  }
  if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await callAdminUsers<{ users: AdminUser[] }>({ action: 'list' });
      setUsers(result.users);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
    loadUsers();
  }, []);

  const filtered = users.filter(
    (u) => !search || (u.email ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError('');
    try {
      await callAdminUsers({ action: 'invite', email: inviteEmail.trim() });
      setInviteEmail('');
      setInviteOpen(false);
      loadUsers();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite.');
    }
    setInviting(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await callAdminUsers({ action: 'delete', id: confirmDelete.id });
      setConfirmDelete(null);
      loadUsers();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete user.');
    }
    setDeleting(false);
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
            placeholder="Search by email..."
          />
        </div>
        <button
          onClick={() => {
            setInviteEmail('');
            setInviteError('');
            setInviteOpen(true);
          }}
          className="btn-primary px-5 py-2.5 inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {loadError && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-sm text-red-300">
          {loadError}
        </div>
      )}

      <div className="bg-nautical-blue rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Email', 'Status', 'Last Sign In', 'Created', ''].map((h) => (
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
                    No admins yet
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const status = userStatus(u);
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-bold text-white">
                        {u.email ?? '—'}
                        {isSelf && (
                          <span className="ml-2 text-xs font-normal text-slate-500">(you)</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400 whitespace-nowrap">
                        {u.last_sign_in_at ? formatDateShort(u.last_sign_in_at.slice(0, 10)) : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400 whitespace-nowrap">
                        {formatDateShort(u.created_at.slice(0, 10))}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setDeleteError('');
                            setConfirmDelete(u);
                          }}
                          disabled={isSelf}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                          title={isSelf ? 'You cannot delete yourself' : 'Delete user'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !inviting && setInviteOpen(false)}
          />
          <div className="relative bg-nautical-blue rounded-xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white uppercase">Invite Admin</h3>
              <button
                onClick={() => !inviting && setInviteOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className={MODAL_LABEL}>Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input-field"
                  placeholder="newadmin@fishthewahoo.com"
                  required
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">
                  We'll email them a link to set their password.
                </p>
              </div>

              {inviteError && <p className="text-red-400 text-sm">{inviteError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn-primary flex-1 py-3 disabled:opacity-60"
                >
                  {inviting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Invite'}
                </button>
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  disabled={inviting}
                  className="btn-outline px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !deleting && setConfirmDelete(null)}
          />
          <div className="relative bg-nautical-blue rounded-xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white uppercase">Delete Admin</h3>
              <button
                onClick={() => !deleting && setConfirmDelete(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300">
                Permanently remove <span className="font-bold text-white">{confirmDelete.email}</span>?
                They'll lose admin access immediately.
              </p>

              {deleteError && <p className="text-red-400 text-sm">{deleteError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider disabled:opacity-60 transition-colors"
                >
                  {deleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={deleting}
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
