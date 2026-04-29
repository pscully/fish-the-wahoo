import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Loader2, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/callback?type=recovery`,
    });
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-nautical-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-orange rounded-full mb-4">
            <Anchor className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl text-white uppercase tracking-tight mb-1">Reset Password</h1>
          <p className="text-slate-400 text-sm">Fish The Wahoo Management</p>
        </div>

        <div className="bg-nautical-blue rounded-xl border border-white/10 p-6">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-accent-orange/10 border border-accent-orange/20 rounded-full">
                <Mail className="w-5 h-5 text-accent-orange" />
              </div>
              <p className="text-white text-sm">
                If an account exists for <span className="font-bold">{email}</span>, a reset link is on its way.
              </p>
              <p className="text-slate-400 text-xs">
                Check your inbox and click the link to set a new password.
              </p>
              <Link
                to="/admin/login"
                className="inline-block text-accent-orange text-sm hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@fishthewahoo.com"
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="text-slate-400 text-xs hover:text-white"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
