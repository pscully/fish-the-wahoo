import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Anchor, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type FlowType = 'invite' | 'recovery';

export default function AdminAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [flowType, setFlowType] = useState<FlowType>('invite');
  const [linkError, setLinkError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function verify() {
      const tokenHash = searchParams.get('token_hash');
      const code = searchParams.get('code');
      const queryType = searchParams.get('type');
      const detectedType: FlowType = queryType === 'recovery' ? 'recovery' : 'invite';
      setFlowType(detectedType);

      if (tokenHash && (queryType === 'invite' || queryType === 'recovery')) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: queryType,
        });
        if (error) {
          setLinkError(error.message);
          setVerifying(false);
          return;
        }
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setLinkError(error.message);
          setVerifying(false);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLinkError('This link is invalid or has expired. Request a new one and try again.');
      }
      setVerifying(false);
    }
    verify();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (password.length < 8) {
      setSubmitError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSubmitError(error.message);
      setSaving(false);
      return;
    }
    navigate('/admin');
  };

  const headline = flowType === 'recovery' ? 'Reset Your Password' : 'Welcome Aboard';
  const subheadline =
    flowType === 'recovery'
      ? 'Choose a new password to access the admin dashboard.'
      : 'Set a password to finish setting up your Fish The Wahoo admin account.';

  return (
    <div className="min-h-screen bg-nautical-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-orange rounded-full mb-4">
            <Anchor className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl text-white uppercase tracking-tight mb-1">{headline}</h1>
          <p className="text-slate-400 text-sm">{subheadline}</p>
        </div>

        <div className="bg-nautical-blue rounded-xl border border-white/10 p-6">
          {verifying ? (
            <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying link…
            </div>
          ) : linkError ? (
            <div className="space-y-4 text-center">
              <p className="text-red-400 text-sm">{linkError}</p>
              <Link
                to="/admin/forgot-password"
                className="inline-block text-accent-orange text-sm hover:underline"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                />
              </div>

              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
