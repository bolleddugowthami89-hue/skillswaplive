import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Globe, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Web Development',
  'Data Science & AI',
  'UI/UX Design',
  'Languages',
  'Mobile Development',
  'Music & Audio',
  'Business & Marketing',
  'Photography & Video',
  'Academics & Science',
  'Fitness & Wellness',
  'Other',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [location, setLocation] = useState('');
  const [languagesStr, setLanguagesStr] = useState('');

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlotsStr, setTimeSlotsStr] = useState('');

  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // New Skill Input states
  const [newOffered, setNewOffered] = useState({ name: '', level: 'Intermediate', category: 'Web Development', description: '', yearsOfExp: 1 });
  const [newWanted, setNewWanted] = useState({ name: '', level: 'Beginner', category: 'Languages' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      setLocation(user.location || '');
      setLanguagesStr((user.languages || []).join(', '));
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      setSelectedDays(user.availability?.days || ['Monday', 'Wednesday', 'Saturday']);
      setTimeSlotsStr((user.availability?.timeSlots || ['Morning (9am - 12pm)', 'Evening (6pm - 9pm)']).join('\n'));
      setGithub(user.socialLinks?.github || '');
      setLinkedin(user.socialLinks?.linkedin || '');
    }
  }, [user]);

  const handleAddOfferedSkill = () => {
    if (!newOffered.name.trim()) return;
    setSkillsOffered([...skillsOffered, { ...newOffered, name: newOffered.name.trim() }]);
    setNewOffered({ name: '', level: 'Intermediate', category: 'Web Development', description: '', yearsOfExp: 1 });
  };

  const handleRemoveOfferedSkill = (index) => {
    setSkillsOffered(skillsOffered.filter((_, idx) => idx !== index));
  };

  const handleAddWantedSkill = () => {
    if (!newWanted.name.trim()) return;
    setSkillsWanted([...skillsWanted, { ...newWanted, name: newWanted.name.trim() }]);
    setNewWanted({ name: '', level: 'Beginner', category: 'Languages' });
  };

  const handleRemoveWantedSkill = (index) => {
    setSkillsWanted(skillsWanted.filter((_, idx) => idx !== index));
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        name,
        title,
        bio,
        avatar,
        location,
        languages: languagesStr.split(',').map((s) => s.trim()).filter(Boolean),
        skillsOffered,
        skillsWanted,
        availability: {
          days: selectedDays,
          timeSlots: timeSlotsStr.split('\n').map((s) => s.trim()).filter(Boolean),
        },
        socialLinks: {
          github,
          linkedin,
        },
      };

      const res = await updateProfile(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
              Edit Your Skill Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Keep your offered & wanted skills updated to receive the best match proposals.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Information */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>General Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title / Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer | Spanish Learner"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bio & Knowledge Background</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your background, what topics you are excited to teach or learn..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Berlin, Germany or Remote"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  value={languagesStr}
                  onChange={(e) => setLanguagesStr(e.target.value)}
                  placeholder="e.g. English, Spanish, German"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Skills Offered (Teaching) */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold font-['Outfit'] text-emerald-400">
              Skills You Can Teach (Offered)
            </h2>

            {/* List of current offered skills */}
            <div className="space-y-2">
              {skillsOffered.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{skill.name}</span>
                    <span className="text-indigo-400 ml-2 font-mono">({skill.level})</span>
                    <span className="text-slate-500 ml-2">• {skill.category}</span>
                    {skill.description && <p className="text-[11px] text-slate-400 mt-0.5">{skill.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOfferedSkill(idx)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Offered Skill Form */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Add a Skill You Can Teach:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g. React.js)"
                  value={newOffered.name}
                  onChange={(e) => setNewOffered({ ...newOffered, name: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <select
                  value={newOffered.level}
                  onChange={(e) => setNewOffered({ ...newOffered, level: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  {SKILL_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <select
                  value={newOffered.category}
                  onChange={(e) => setNewOffered({ ...newOffered, category: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <input
                type="text"
                placeholder="Short description of what you'll cover (e.g. State management, hooks, architecture)"
                value={newOffered.description}
                onChange={(e) => setNewOffered({ ...newOffered, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddOfferedSkill}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Taught Skill
              </button>
            </div>
          </div>

          {/* Skills Wanted (Learning) */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold font-['Outfit'] text-rose-400">
              Skills You Want to Learn (Wanted)
            </h2>

            <div className="flex flex-wrap gap-2">
              {skillsWanted.map((skill, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                  <span>{skill.name} ({skill.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWantedSkill(idx)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Add a Skill You Want to Learn:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Spanish Conversation)"
                  value={newWanted.name}
                  onChange={(e) => setNewWanted({ ...newWanted, name: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <select
                  value={newWanted.level}
                  onChange={(e) => setNewWanted({ ...newWanted, level: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  {SKILL_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <select
                  value={newWanted.category}
                  onChange={(e) => setNewWanted({ ...newWanted, category: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddWantedSkill}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Wanted Skill
              </button>
            </div>
          </div>

          {/* Availability Schedule */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Exchange Availability Days & Slots</span>
            </h2>

            <div>
              <span className="text-xs font-medium text-slate-300 block mb-2">Select Days Available:</span>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((d) => {
                  const selected = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Time Slots (one per line)
              </label>
              <textarea
                rows={2}
                value={timeSlotsStr}
                onChange={(e) => setTimeSlotsStr(e.target.value)}
                placeholder="Morning (9am - 12pm)&#10;Evening (6pm - 9pm)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save & Publish Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfilePage;
