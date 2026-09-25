import React, { useState } from 'react';
import { X, Repeat, Calendar, Clock, Sparkles, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SwapRequestModal = ({ targetUser, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  const [offeredSkillName, setOfferedSkillName] = useState('');
  const [requestedSkillName, setRequestedSkillName] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTimeSlot, setProposedTimeSlot] = useState('Evening (6pm - 8pm)');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Set initial selected values when opened
  React.useEffect(() => {
    if (targetUser) {
      if (targetUser.skillsOffered?.length > 0) {
        setRequestedSkillName(targetUser.skillsOffered[0].name);
      }
      if (user?.skillsOffered?.length > 0) {
        setOfferedSkillName(user.skillsOffered[0].name);
      } else {
        setOfferedSkillName('Web Development / Coding');
      }
      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setProposedDate(tomorrow.toISOString().split('T')[0]);
      setMessage(`Hi ${targetUser.name}! I'd love to exchange skills with you. Let me know if you're interested!`);
      setError('');
      setSuccess(false);
    }
  }, [targetUser, user]);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login or register to propose a skill swap.');
      return;
    }

    if (!offeredSkillName || !requestedSkillName || !message.trim()) {
      setError('Please select both skills and write a brief introduction message.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        receiverId: targetUser._id,
        offeredSkill: {
          name: offeredSkillName,
          category: 'Skill Swap',
          level: 'Intermediate',
        },
        requestedSkill: {
          name: requestedSkillName,
          category: 'Skill Swap',
          level: 'Intermediate',
        },
        proposedDate: proposedDate ? new Date(proposedDate) : undefined,
        proposedTimeSlot,
        durationMinutes: Number(durationMinutes),
        message: message.trim(),
      };

      const res = await api.post('/swaps', payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(res.data.swap);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send swap proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-6 md:p-8 bg-[#0f172a]/95 text-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Outfit']">Propose Skill Swap</h2>
            <p className="text-xs text-slate-400">
              with <span className="text-indigo-400 font-semibold">{targetUser.name}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-300">Swap Proposal Sent!</h3>
            <p className="text-xs text-slate-400">
              We notified {targetUser.name}. You can track the status in your Swaps dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Skill Exchange Pair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              {/* What you teach */}
              <div>
                <label className="block text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                  You Will Teach:
                </label>
                {user?.skillsOffered?.length > 0 ? (
                  <select
                    value={offeredSkillName}
                    onChange={(e) => setOfferedSkillName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {user.skillsOffered.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name} ({s.level})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. React & JavaScript"
                    value={offeredSkillName}
                    onChange={(e) => setOfferedSkillName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>

              {/* What you want to learn */}
              <div>
                <label className="block text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
                  You Want to Learn:
                </label>
                {targetUser.skillsOffered?.length > 0 ? (
                  <select
                    value={requestedSkillName}
                    onChange={(e) => setRequestedSkillName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {targetUser.skillsOffered.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name} ({s.level})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Spanish Conversation"
                    value={requestedSkillName}
                    onChange={(e) => setRequestedSkillName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Preferred Time & Duration
                </label>
                <select
                  value={proposedTimeSlot}
                  onChange={(e) => setProposedTimeSlot(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                  <option value="Afternoon (1pm - 5pm)">Afternoon (1pm - 5pm)</option>
                  <option value="Evening (6pm - 9pm)">Evening (6pm - 9pm)</option>
                  <option value="Flexible / Async">Flexible / Discuss in Chat</option>
                </select>
              </div>
            </div>

            {/* Introduction Message */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Personalized Message / Learning Goals
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what specific topics you want to cover and how you can help them..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <span>Sending Proposal...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Swap Request
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default SwapRequestModal;
