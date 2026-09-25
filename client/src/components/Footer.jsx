import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Heart, Shield, Sparkles, Globe, Share2, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d16] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5">
                <div className="w-full h-full bg-[#0b0f19] rounded-[6px] flex items-center justify-center">
                  <Repeat className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-base text-white tracking-tight font-['Outfit']">
                SkillSwap<span className="text-indigo-400">Live</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier live peer-to-peer knowledge exchange platform. Teach what you love, learn what you desire, without spending a dime.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"><Share2 className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"><ExternalLink className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?category=Web%20Development" className="hover:text-indigo-400 transition-colors">Web & Software Dev</Link></li>
              <li><Link to="/explore?category=Data%20Science%20%26%20AI" className="hover:text-indigo-400 transition-colors">AI & Data Science</Link></li>
              <li><Link to="/explore?category=UI%2FUX%20Design" className="hover:text-indigo-400 transition-colors">UI/UX Design</Link></li>
              <li><Link to="/explore?category=Languages" className="hover:text-indigo-400 transition-colors">Languages & Fluency</Link></li>
              <li><Link to="/explore?category=Music%20%26%20Audio" className="hover:text-indigo-400 transition-colors">Music & Audio</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Smart Skill Matchmaking</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> WebRTC 1-on-1 Video</li>
              <li className="flex items-center gap-1.5"><Repeat className="w-3.5 h-3.5 text-indigo-400" /> Real-time Whiteboard</li>
              <li>Collaborative Code Editor</li>
              <li>Instant In-App Chat & Notes</li>
            </ul>
          </div>

          {/* Stack details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-indigo-300 font-mono">React.js</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-purple-300 font-mono">Express.js</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-cyan-300 font-mono">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-emerald-300 font-mono">MongoDB Atlas</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-pink-300 font-mono">JWT Auth</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-amber-300 font-mono">Socket.io</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-[11px] text-rose-300 font-mono">WebRTC</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-4">
              Designed with high-performance real-time synchronization.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} SkillSwapLive. Open Knowledge Initiative.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for peer-to-peer learners worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
