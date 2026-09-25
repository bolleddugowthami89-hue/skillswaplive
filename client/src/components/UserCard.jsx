import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Repeat, Sparkles, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import SkillTag from './SkillTag';

const UserCard = ({ user, onRequestSwap }) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 relative group">
      
      {/* Top Bar: Match Score & Online Status */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {user.matchScore && user.matchScore >= 80 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {user.matchScore}% Match
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {user.completedSwaps || 0} swaps completed
          </span>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-400 live-pulse' : 'bg-slate-600'}`}></span>
          <span className="text-[11px] text-slate-400">{user.isOnline ? 'Active Now' : 'Offline'}</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex items-start gap-3.5 mb-4">
        <Link to={`/profile/${user._id}`} className="relative shrink-0">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all"
          />
          {user.isVerified && (
            <CheckCircle2 className="w-4 h-4 text-indigo-400 bg-[#0b0f19] rounded-full absolute -bottom-1 -right-1" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/profile/${user._id}`} className="hover:text-indigo-400 transition-colors">
            <h3 className="font-bold text-base text-slate-100 truncate font-['Outfit']">{user.name}</h3>
          </Link>
          <p className="text-xs text-indigo-300/90 truncate font-medium">{user.title || 'Skill Exchanger'}</p>
          
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {user.rating ? user.rating.toFixed(1) : '5.0'}
              <span className="text-slate-500 font-normal">({user.reviewCount || 0})</span>
            </span>

            {user.location && (
              <span className="flex items-center gap-1 truncate text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate max-w-[110px]">{user.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio excerpt */}
      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {user.bio || 'Passionate about sharing knowledge and discovering new skill sets.'}
      </p>

      {/* Skills Offered (Teaches) */}
      <div className="mb-3 space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
          <span>Can Teach (Offers)</span>
          <span className="text-indigo-400 text-[10px]">
            {user.skillsOffered?.length || 0} skills
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {user.skillsOffered?.slice(0, 3).map((skill, idx) => (
            <SkillTag key={idx} skill={skill} type="offered" />
          ))}
          {user.skillsOffered?.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center px-1">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted (Learns) */}
      <div className="mb-5 space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
          <span>Wants to Learn</span>
          <span className="text-rose-400 text-[10px]">
            {user.skillsWanted?.length || 0} skills
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {user.skillsWanted?.slice(0, 3).map((skill, idx) => (
            <SkillTag key={idx} skill={skill} type="wanted" />
          ))}
          {user.skillsWanted?.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center px-1">
              +{user.skillsWanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onRequestSwap(user)}
          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <Repeat className="w-3.5 h-3.5" />
          Request Skill Swap
        </button>

        <Link
          to={`/profile/${user._id}`}
          className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
          title="View Profile"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

export default UserCard;
