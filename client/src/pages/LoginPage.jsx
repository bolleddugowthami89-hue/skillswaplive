import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Repeat, 
  Mail, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { name: 'Elena Rostova', email: 'elena@skillswap.com', role: 'Senior React & Next.js Architect' },
  { name: 'Carlos Mendoza', email: 'carlos@skillswap.com', role: 'Spanish Instructor & Guitarist' },
  { name: 'Aisha Patel', email: 'aisha@skillswap.com', role: 'Lead UI/UX Figma Designer' },
  { name: 'David Kim', email: 'david@skillswap.com', role: 'AI Researcher & Python ML Engineer' },
];

const LoginPage = () => {
  const { login, loginAsDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/explore');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoEmail) => {
    setLoading(true);
    setError('');
    const res = await loginAsDemoUser(demoEmail);
    if (res.success) {
      navigate('/explore');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/images/skillswap-hero-bg.jpg" 
          alt="SkillSwap Backdrop" 
          className="w-full h-full object-cover object-center opacity-20 mix-blend-screen scale-110 filter blur-[1px] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/90 via-[#0b0f19]/70 to-[#0b0f19]" />
      </div>

      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-8 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Repeat className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-['Outfit'] text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your swaps, live sessions, and messages.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <span>Signing In...</span> : <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* 1-Click Instant Demo Accounts */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Or Click to Sign In with Demo Account:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoClick(acc.email)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 truncate">
                  {acc.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{acc.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Register Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
