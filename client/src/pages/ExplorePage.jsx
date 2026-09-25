import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Star, 
  Layers, 
  ChevronDown,
  RotateCcw,
  Users
} from 'lucide-react';
import UserCard from '../components/UserCard';
import SwapRequestModal from '../components/SwapRequestModal';
import api from '../services/api';

const CATEGORIES = [
  'All',
  'Web Development',
  'Data Science & AI',
  'UI/UX Design',
  'Languages',
  'Mobile Development',
  'Music & Audio',
  'Business & Marketing',
  'Photography & Video',
];

const SKILL_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [skillLevel, setSkillLevel] = useState('All');
  const [day, setDay] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync search params
  useEffect(() => {
    const qSearch = searchParams.get('search');
    const qCat = searchParams.get('category');
    if (qSearch !== null) setSearch(qSearch);
    if (qCat !== null) setCategory(qCat);
  }, [searchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (skillLevel !== 'All') params.skillLevel = skillLevel;
      if (day !== 'All') params.day = day;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/users', { params });
      if (res.data?.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [search, category, skillLevel, day, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSkillLevel('All');
    setDay('All');
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Marketplace</span>
          <h1 className="text-3xl font-extrabold font-['Outfit'] text-white mt-1">
            Discover Skill Exchange Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search across hundreds of mentors & learners ready to exchange real-time live sessions.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill name, topic, or keyword (e.g. React, Spanish, Figma)..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-medium shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
              >
                <option value="rating">Top Rated (⭐)</option>
                <option value="swaps">Most Swaps Completed</option>
                <option value="newest">Recently Joined</option>
                <option value="hours">Hours Taught</option>
              </select>

              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset All Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Skill Level & Availability */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Min Level:</span>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                {SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Availability Day:</span>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-[11px] text-slate-400 font-medium">
              Showing <span className="text-indigo-400 font-bold">{users.length}</span> matching partners
            </div>
          </div>

        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-800/60 rounded"></div>
                <div className="h-8 bg-slate-800/40 rounded"></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 p-8">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-200">No matching skill partners found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Try adjusting your search keywords or reset the category filters to discover more community members.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onRequestSwap={(target) => setSelectedUserForSwap(target)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Swap Request Modal */}
      {selectedUserForSwap && (
        <SwapRequestModal
          targetUser={selectedUserForSwap}
          isOpen={!!selectedUserForSwap}
          onClose={() => setSelectedUserForSwap(null)}
          onSuccess={() => setSelectedUserForSwap(null)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
