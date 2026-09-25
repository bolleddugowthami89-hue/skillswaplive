import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Globe, 
  Calendar, 
  Repeat, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Clock, 
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/SkillTag';
import SwapRequestModal from '../components/SwapRequestModal';
import api from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swapModalOpen, setSwapModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${id}`);
        if (res.data?.success) {
          setProfileUser(res.data.user);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.warn('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-100">User Profile Not Found</h2>
          <Link to="/explore" className="text-indigo-400 text-xs mt-2 inline-block">← Back to explore</Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header Banner Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          {/* Ambient header glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={profileUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileUser.name)}`}
                  alt={profileUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-500/30"
                />
                <span className={`w-4 h-4 rounded-full absolute bottom-1 right-1 ring-2 ring-slate-900 ${
                  profileUser.isOnline ? 'bg-emerald-400 live-pulse' : 'bg-slate-600'
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
                    {profileUser.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                
                <p className="text-sm font-medium text-indigo-300 mt-0.5">{profileUser.title}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {profileUser.rating ? profileUser.rating.toFixed(1) : '5.0'}
                    <span className="text-slate-400 font-normal">({profileUser.reviewCount || 0} reviews)</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {profileUser.location || 'Remote / Global'}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {profileUser.completedSwaps || 0} Swaps • {profileUser.totalHoursTaught || 0} Hours
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {isOwnProfile ? (
                <Link
                  to="/profile/edit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-indigo-400" />
                  Edit Profile & Skills
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setSwapModalOpen(true)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Repeat className="w-4 h-4" />
                    Propose Skill Swap
                  </button>

                  <button
                    onClick={() => navigate('/messages')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
                    title="Send Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Badges */}
          {profileUser.badges?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Badges:</span>
              {profileUser.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: About & Skills */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800">
              <h2 className="text-base font-bold font-['Outfit'] text-white mb-3">About Me</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {profileUser.bio || 'No bio provided yet.'}
              </p>
            </div>

            {/* Skills Offered (Teaching) */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-['Outfit'] text-emerald-400 flex items-center gap-2">
                  <span>Skills I Can Teach (Offered)</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {profileUser.skillsOffered?.length || 0} registered
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileUser.skillsOffered?.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-100">{skill.name}</span>
                      <SkillTag skill={skill} type="offered" />
                    </div>
                    {skill.description && (
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                    <div className="text-[10px] text-indigo-400 font-mono">
                      Category: {skill.category} {skill.yearsOfExp ? `• ${skill.yearsOfExp} yrs exp` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Wanted (Learning) */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-['Outfit'] text-rose-400 flex items-center gap-2">
                  <span>Skills I Want to Learn (Wanted)</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {profileUser.skillsWanted?.length || 0} requested
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {profileUser.skillsWanted?.map((skill, idx) => (
                  <div key={idx} className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-rose-400/70 font-normal">({skill.level})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-['Outfit'] text-white">
                  Exchange Partner Reviews ({reviews.length})
                </h2>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{profileUser.rating ? profileUser.rating.toFixed(1) : '5.0'} / 5.0</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No reviews posted yet for this user.
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.reviewer?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=rev'}
                            alt={rev.reviewer?.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-200">{rev.reviewer?.name}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 italic">"{rev.comment}"</p>
                      <div className="text-[10px] text-indigo-400">
                        Swapped skill: {rev.skillLearned}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Availability & Links */}
          <div className="space-y-6">
            
            {/* Availability Schedule */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Exchange Availability</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Available Days:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.availability?.days?.map((day, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Time Windows:
                  </span>
                  <div className="space-y-1">
                    {profileUser.availability?.timeSlots?.map((slot, idx) => (
                      <div key={idx} className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{slot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Languages Spoken</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {profileUser.languages?.map((lang, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {profileUser.socialLinks && (
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                <h2 className="text-sm font-bold font-['Outfit'] text-white">Links & Profiles</h2>
                <div className="space-y-2 text-xs">
                  {profileUser.socialLinks.github && (
                    <a
                      href={profileUser.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {profileUser.socialLinks.linkedin && (
                    <a
                      href={profileUser.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Swap Proposal Modal */}
      {swapModalOpen && (
        <SwapRequestModal
          targetUser={profileUser}
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          onSuccess={() => setSwapModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
