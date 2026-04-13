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
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Anchor className="w-10 h-10 text-sea-400 mx-auto mb-3" />
          <h1 className="text-2xl text-white mb-1">Admin Login</h1>
          <p className="text-navy-400 font-body text-sm">Fish The Wahoo Management</p>
        </div>

        <form onSubmit={handleLogin} className="bg-navy-900 rounded-xl border border-navy-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-navy-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white font-body placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-sea-500 focus:border-sea-500"
              placeholder="admin@fishthewahoo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-navy-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white font-body placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-sea-500 focus:border-sea-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 font-body text-sm">{error}</p>
          )}

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
