import React, { useState } from 'react';
import { Star, X, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

const ReviewModal = ({ swap, targetUser, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [skillLearned, setSkillLearned] = useState(swap?.offeredSkill?.name || 'Skill Exchange');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !targetUser) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short testimonial or feedback.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reviews', {
        revieweeId: targetUser._id,
        swapRequestId: swap?._id,
        rating,
        comment: comment.trim(),
        skillLearned,
      });

      if (res.data?.success) {
        setSubmitted(true);
        triggerConfetti();
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-slate-700 shadow-2xl p-6 md:p-8 bg-[#0f172a] text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold font-['Outfit']">Rate & Review Session</h3>
          <p className="text-xs text-slate-400 mt-1">
            How was your exchange session with <span className="text-indigo-300 font-semibold">{targetUser.name}</span>?
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-emerald-300">Thank You for Your Review!</h4>
            <p className="text-xs text-slate-400">
              Your feedback helps keep the SkillSwapLive community high quality and trustworthy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Star Rating Selection */}
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-300">
                {rating === 5 ? '⭐ 5.0 - Outstanding Exchange' : 
                 rating === 4 ? '⭐ 4.0 - Very Good Experience' :
                 rating === 3 ? '⭐ 3.0 - Good Session' : 
                 rating === 2 ? '⭐ 2.0 - Needs Improvement' : '⭐ 1.0 - Poor'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Skill You Learned / Practiced
              </label>
              <input
                type="text"
                value={skillLearned}
                onChange={(e) => setSkillLearned(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. React Hooks, Conversational Spanish"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Testimonial / Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a few words about what made this session helpful, their teaching style, etc."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-90 text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Rating & Review
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReviewModal;
