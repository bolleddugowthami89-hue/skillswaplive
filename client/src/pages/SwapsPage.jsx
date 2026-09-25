import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Repeat, 
  Video, 
  MessageSquare, 
  Check, 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';
import api from '../services/api';

const SwapsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'accepted' | 'completed'
  const [reviewSwap, setReviewSwap] = useState(null);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/swaps');
      if (res.data?.success) {
        setSwaps(res.data.swaps || []);
      }
    } catch (err) {
      console.warn('Error loading swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleUpdateStatus = async (swapId, newStatus) => {
    try {
      const res = await api.put(`/swaps/${swapId}/status`, { status: newStatus });
      if (res.data?.success) {
        fetchSwaps();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update swap status');
    }
  };

  const filteredSwaps = swaps.filter((s) => {
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'accepted') return s.status === 'accepted' || s.status === 'in_progress';
    if (activeTab === 'completed') return s.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      in_progress: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      completed: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      cancelled: 'bg-slate-700/40 text-slate-400 border-slate-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${map[status] || map.pending}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Dashboard</span>
            <h1 className="text-3xl font-extrabold font-['Outfit'] text-white mt-1">
              My Skill Swaps & Live Sessions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track your pending proposals, scheduled exchanges, and access live classroom rooms.
            </p>
          </div>

          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <Repeat className="w-3.5 h-3.5" />
            Discover New Matches
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'all', label: 'All Swaps', count: swaps.length },
            { id: 'accepted', label: 'Active & Scheduled', count: swaps.filter(s => s.status === 'accepted' || s.status === 'in_progress').length },
            { id: 'pending', label: 'Pending Requests', count: swaps.filter(s => s.status === 'pending').length },
            { id: 'completed', label: 'Completed', count: swaps.filter(s => s.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Swaps List */}
        {loading ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse h-36"></div>
            ))}
          </div>
        ) : filteredSwaps.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-4">
            <Repeat className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No skill swaps found in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore user profiles to propose a 1-on-1 skill exchange session!
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Explore Knowledge Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSwaps.map((swap) => {
              const isSender = swap.sender._id === user?._id;
              const partner = isSender ? swap.receiver : swap.sender;

              const canJoinRoom = swap.status === 'accepted' || swap.status === 'in_progress';

              return (
                <div
                  key={swap._id}
                  className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left info */}
                  <div className="space-y-3 flex-1">
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(swap.status)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {swap.proposedDate ? new Date(swap.proposedDate).toLocaleDateString() : 'Flexible'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {swap.proposedTimeSlot} ({swap.durationMinutes} mins)
                      </span>
                    </div>

                    {/* Skill Exchange flow representation */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                      
                      {/* Partner summary */}
                      <Link to={`/profile/${partner._id}`} className="flex items-center gap-2.5 group">
                        <img
                          src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.name}`}
                          alt={partner.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {partner.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {isSender ? 'Outgoing Proposal' : 'Incoming Request'}
                          </span>
                        </div>
                      </Link>

                      <div className="hidden sm:block text-slate-600">→</div>

                      {/* Skills Pair */}
                      <div className="flex items-center gap-2 text-xs">
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                          <span className="font-semibold text-slate-400 text-[10px] block uppercase">You Give:</span>
                          <span className="font-bold">{isSender ? swap.offeredSkill?.name : swap.requestedSkill?.name}</span>
                        </div>

                        <Repeat className="w-4 h-4 text-slate-500" />

                        <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                          <span className="font-semibold text-slate-400 text-[10px] block uppercase">You Learn:</span>
                          <span className="font-bold">{isSender ? swap.requestedSkill?.name : swap.offeredSkill?.name}</span>
                        </div>
                      </div>

                    </div>

                    {/* Message */}
                    {swap.message && (
                      <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed italic">
                        "{swap.message}"
                      </p>
                    )}

                  </div>

                  {/* Right Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end">
                    
                    {/* If accepted: Launch Live Room */}
                    {canJoinRoom && (
                      <Link
                        to={`/live/${swap.meetingRoomId}`}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95"
                      >
                        <Video className="w-4 h-4" />
                        Enter Live Classroom
                      </Link>
                    )}

                    {/* Incoming request actions (Accept / Decline) */}
                    {!isSender && swap.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-4 h-4" /> Accept Swap
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(swap._id, 'rejected')}
                          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    )}

                    {/* Mark as Completed */}
                    {swap.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(swap._id, 'completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-medium transition-colors"
                      >
                        Mark Session Complete
                      </button>
                    )}

                    {/* Review button if completed */}
                    {swap.status === 'completed' && (
                      <button
                        onClick={() => setReviewSwap(swap)}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                        Leave Rating & Review
                      </button>
                    )}

                    {/* Direct message link */}
                    <button
                      onClick={() => navigate('/messages')}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Chat with partner"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewSwap && (
        <ReviewModal
          swap={reviewSwap}
          targetUser={reviewSwap.sender._id === user?._id ? reviewSwap.receiver : reviewSwap.sender}
          isOpen={!!reviewSwap}
          onClose={() => setReviewSwap(null)}
          onSuccess={() => {
            setReviewSwap(null);
            fetchSwaps();
          }}
        />
      )}

    </div>
  );
};

export default SwapsPage;
