import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Repeat, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  BookOpen,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Info, 2: Skills
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote / Global');

  // Skill fields
  const [teachSkillName, setTeachSkillName] = useState('React.js');
  const [teachLevel, setTeachLevel] = useState('Intermediate');
  const [teachCategory, setTeachCategory] = useState('Web Development');

  const [learnSkillName, setLearnSkillName] = useState('Spanish Conversation');
  const [learnLevel, setLearnLevel] = useState('Beginner');
  const [learnCategory, setLearnCategory] = useState('Languages');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in your name, email, and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCompleteRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = {
      name,
      email,
      password,
      title: title || `${teachSkillName} Mentor & Learner`,
      location,
      skillsOffered: [
        {
          name: teachSkillName,
          level: teachLevel,
          category: teachCategory,
          description: `Ready to teach and share knowledge in ${teachSkillName}.`,
          yearsOfExp: 2,
        },
      ],
      skillsWanted: [
        {
          name: learnSkillName,
          level: learnLevel,
          category: learnCategory,
        },
      ],
    };

    const res = await register(userData);
    if (res.success) {
      navigate('/explore');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b0f19] flex items-start sm:items-center justify-center p-4 sm:py-8 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden overflow-y-auto">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/images/skillswap-hero-bg.jpg" 
          alt="SkillSwap Backdrop" 
          className="w-full h-full object-cover object-center opacity-20 mix-blend-screen scale-110 filter blur-[1px] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/90 via-[#0b0f19]/70 to-[#0b0f19]" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-pink-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-lg my-4 sm:my-0 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-6 sm:p-8 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Repeat className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-['Outfit'] text-white">Create Free Account</h1>
          <p className="text-xs text-slate-400">
            Join the peer-to-peer knowledge exchange community.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            1. Account Info
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            2. Initial Skills
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Info */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password (min 6 chars)</label>
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location / Timezone</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA or Remote"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Continue to Skills Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Skill Setup */}
        {step === 2 && (
          <form onSubmit={handleCompleteRegister} className="space-y-4">
            
            {/* Teach Skill */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                1. What is your primary skill to teach?
              </span>
              <input
                type="text"
                value={teachSkillName}
                onChange={(e) => setTeachSkillName(e.target.value)}
                placeholder="e.g. React.js, Python, UI Design, Guitar"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={teachLevel}
                  onChange={(e) => setTeachLevel(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <option value="Intermediate">Level: Intermediate</option>
                  <option value="Advanced">Level: Advanced</option>
                  <option value="Expert">Level: Expert</option>
                </select>
                <select
                  value={teachCategory}
                  onChange={(e) => setTeachCategory(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science & AI">AI & Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Languages">Languages</option>
                  <option value="Music & Audio">Music & Audio</option>
                  <option value="Business & Marketing">Business</option>
                </select>
              </div>
            </div>

            {/* Learn Skill */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                2. What skill do you want to learn?
              </span>
              <input
                type="text"
                value={learnSkillName}
                onChange={(e) => setLearnSkillName(e.target.value)}
                placeholder="e.g. Spanish, Figma, PyTorch, SEO"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={learnLevel}
                  onChange={(e) => setLearnLevel(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <option value="Beginner">Goal: Beginner</option>
                  <option value="Intermediate">Goal: Intermediate</option>
                </select>
                <select
                  value={learnCategory}
                  onChange={(e) => setLearnCategory(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300"
                >
                  <option value="Languages">Languages</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science & AI">AI & Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Music & Audio">Music & Audio</option>
                  <option value="Business & Marketing">Business</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <span>Creating Account...</span> : <span>Complete Registration & Launch</span>}
              </button>
            </div>

          </form>
        )}

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
