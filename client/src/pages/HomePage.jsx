import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Repeat, 
  Search, 
  Sparkles, 
  Video, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Code2, 
  Cpu, 
  Globe, 
  Palette, 
  Music, 
  Users, 
  CheckCircle,
  Zap,
  BookOpen
} from 'lucide-react';
import UserCard from '../components/UserCard';
import SwapRequestModal from '../components/SwapRequestModal';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, catRes] = await Promise.all([
          api.get('/users/featured'),
          api.get('/users/categories'),
        ]);

        if (usersRes.data?.success) {
          setFeaturedUsers(usersRes.data.users || []);
        }
        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
        }
      } catch (err) {
        console.warn('Using fallback initial state');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The #1 Live Peer-to-Peer Knowledge Exchange</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Outfit'] max-w-4xl mx-auto leading-[1.15]">
            Exchange Skills 1-on-1. <br />
            <span className="gradient-text">Zero Money Involved.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Teach what you are great at, learn what you have always wanted. Connect via live video classroom, real-time whiteboard, and collaborative code workspace.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto p-2 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="What skill do you want to learn? (e.g. React, Spanish, Figma, Python, Guitar)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Find Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Popular:</span>
            {['React & Node.js', 'Spanish Fluency', 'Figma UI/UX', 'Python AI', 'Acoustic Guitar'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/explore?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-['Outfit']">10,000+</div>
              <div className="text-xs text-slate-400 mt-1">Skills Exchanged</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-['Outfit']">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 mt-1">Community Rating</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-['Outfit']">100% Free</div>
              <div className="text-xs text-slate-400 mt-1">Barter Knowledge Model</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Outfit']">Live HD</div>
              <div className="text-xs text-slate-400 mt-1">Interactive Video Room</div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Skill Categories */}
      <section className="py-16 border-t border-slate-800/60 bg-[#090d16]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Discover</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white mt-1">
                Explore Top Skill Domains
              </h2>
            </div>
            <Link
              to="/explore"
              className="mt-4 md:mt-0 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              View all skill categories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.id)}`)}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} p-2 text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Zap className="w-full h-full" />
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Live Classroom Teaser / Feature Showcase */}
      <section className="py-20 border-t border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Interactive Workspace</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] leading-tight">
                Everything You Need for a Seamless <span className="gradient-text">Live Skill Exchange</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                No third-party downloads required. Launch a private, encrypted live classroom directly in your browser with synchronized tools designed specifically for teaching.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">1-on-1 WebRTC Video & Audio</h4>
                    <p className="text-xs text-slate-400">Crystal clear peer-to-peer audio and screen sharing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">Live Synchronized Whiteboard</h4>
                    <p className="text-xs text-slate-400">Sketch architectural diagrams, math formulas, and design ideas together.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">Collaborative Code & Notes Editor</h4>
                    <p className="text-xs text-slate-400">Live syntax highlighting with real-time text sync and console execution.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/live/demo-room"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Video className="w-4 h-4" />
                  Try Live Classroom Demo
                </Link>
              </div>
            </div>

            {/* Right Interactive Preview */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl glass-panel p-3 border border-slate-700/80 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 rounded-t-2xl border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                    <span className="ml-2 font-mono text-[11px] text-slate-300">swap-live-session-room</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
                    Live Connected
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#080c14] rounded-b-2xl">
                  <div className="space-y-3">
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-900 relative border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                        alt="Participant"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                        Carlos Mendoza (Speaking...)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <span className="text-indigo-400 font-semibold">Live Whiteboard Sync</span>
                      <p className="text-[11px] text-slate-400 mt-1">Drawing diagrams with low latency WebSockets.</p>
                    </div>
                  </div>

                  <div className="h-full min-h-[220px] rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500">// Collaborative React Code</span>
                      <p className="text-purple-400 mt-1">function <span className="text-blue-400">useSkillSwap</span>() &#123;</p>
                      <p className="text-slate-300 ml-4">const [partner, setPartner] = useState();</p>
                      <p className="text-emerald-400 ml-4">// Real-time peer exchange</p>
                      <p className="text-slate-300 ml-4">return &#123; isConnected: true &#125;;</p>
                      <p className="text-purple-400">&#125;</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready to test together
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Mentors / Swappers Section */}
      <section className="py-20 border-t border-slate-800/60 bg-[#090d16]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Community</span>
            <h2 className="text-3xl font-extrabold font-['Outfit'] text-white mt-1">
              Featured Skill Masters Ready to Swap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Connect with experienced software architects, language tutors, designers, and growth experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUsers.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onRequestSwap={(target) => setSelectedUserForSwap(target)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse All 1,200+ Available Skill Profiles
            </Link>
          </div>

        </div>
      </section>

      {/* How it Works: 3 Simple Steps */}
      <section className="py-20 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">How It Works</span>
            <h2 className="text-3xl font-extrabold font-['Outfit'] text-white mt-1">
              Start Swapping in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 relative text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-xl mb-5">
                01
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-slate-100">Set Up Your Profile</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                List the skills you can teach (programming, languages, design) and what you want to learn in return.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 relative text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-xl mb-5">
                02
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-slate-100">Match & Propose Swap</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Discover matched peers based on smart compatibility algorithms and propose a 1-on-1 swap schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 relative text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-extrabold text-xl mb-5">
                03
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-slate-100">Join Live Classroom</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Jump into the encrypted live video room with built-in whiteboard and code workspace to exchange skills.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Swap Request Modal */}
      {selectedUserForSwap && (
        <SwapRequestModal
          targetUser={selectedUserForSwap}
          isOpen={!!selectedUserForSwap}
          onClose={() => setSelectedUserForSwap(null)}
          onSuccess={() => {
            setSelectedUserForSwap(null);
          }}
        />
      )}

    </div>
  );
};

export default HomePage;
