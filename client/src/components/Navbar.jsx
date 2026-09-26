import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Repeat, 
  Search, 
  MessageSquare, 
  Video, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, loginAsDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('/notifications');
          if (res.data?.success) {
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (e) {
          // ignore
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all/read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      // ignore
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f19]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Repeat className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight font-['Outfit'] flex items-center gap-1.5">
                SkillSwap<span className="gradient-text">Live</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Peer Knowledge Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/explore')
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                Explore Skills
              </span>
            </Link>

            {user && (
              <>
                <Link
                  to="/swaps"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/swaps')
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    My Swaps
                  </span>
                </Link>

                <Link
                  to="/messages"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/messages')
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </span>
                </Link>

                <Link
                  to="/live/demo-room"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname.startsWith('/live')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-400" />
                    Live Classroom
                  </span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Auth Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeSwitcher />

            {!user ? (
              <>
                <button
                  onClick={async () => {
                    await loginAsDemoUser('elena@skillswap.com');
                    navigate('/explore');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Demo Login
                </button>

                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 hover:shadow-indigo-600/50 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel shadow-2xl py-2 border border-slate-700/60 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n._id}
                              to={n.link || '/swaps'}
                              onClick={() => setNotificationsOpen(false)}
                              className={`block px-4 py-3 hover:bg-slate-800/60 transition-colors border-b border-slate-800/40 text-left ${
                                !n.read ? 'bg-indigo-950/20' : ''
                              }`}
                            >
                              <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                              <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">{n.message}</div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
                    />
                    <span className="text-sm font-medium text-slate-200 hidden lg:inline-block max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl py-2 border border-slate-700/60 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <div className="text-sm font-semibold text-slate-100">{user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      </div>
                      
                      <Link
                        to={`/profile/${user._id}`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-400" />
                        View Public Profile
                      </Link>

                      <Link
                        to="/profile/edit"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Edit Skills & Bio
                      </Link>

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-400 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
                )}
              </button>
            )}
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[var(--color-bg)] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Skills
          </Link>
          <Link
            to="/kage"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-indigo-950/30"
          >
            ⛩️ Zen 3D Showcase (Kage)
          </Link>
          {user ? (
            <>
              <Link
                to="/swaps"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Swaps
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Messages
              </Link>
              <Link
                to="/live/demo-room"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-emerald-950/30"
              >
                Live Classroom Room
              </Link>
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-950/30"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await loginAsDemoUser();
                  navigate('/explore');
                }}
                className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              >
                Quick Demo Login
              </button>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-slate-800 text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 text-white"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
