import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-nautical-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-orange rounded-full mb-4">
            <Anchor className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl text-white uppercase tracking-tight mb-1">Admin Login</h1>
          <p className="text-slate-400 text-sm">Fish The Wahoo Management</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-nautical-blue rounded-xl border border-white/10 p-6 space-y-4"
        >
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
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
