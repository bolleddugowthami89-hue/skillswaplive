import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Video, 
  PenTool, 
  Code2, 
  FileText, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  PhoneOff, 
  Users, 
  Layers,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import LiveVideoCall from '../components/LiveVideoCall';
import LiveWhiteboard from '../components/LiveWhiteboard';
import LiveCodeEditor from '../components/LiveCodeEditor';
import ReviewModal from '../components/ReviewModal';

const LiveRoomPage = () => {
  const { roomId = 'demo-room' } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('whiteboard'); // 'whiteboard' | 'code' | 'notes'
  const [chatMessages, setChatMessages] = useState([
    {
      sender: { name: 'SkillSwapLive Bot' },
      text: `Welcome to Live Classroom ${roomId}! The interactive whiteboard and collaborative code editor are synchronized.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [notes, setNotes] = useState(
    "🎯 Session Goals:\n1. Master React State & Custom Hooks\n2. Spanish conversational greetings practice\n3. Review practical project scenarios"
  );

  const chatEndRef = useRef(null);

  // Join Live Room via Socket
  useEffect(() => {
    if (!socket) return;

    socket.emit('join-live-room', {
      roomId,
      user: user || { _id: 'guest', name: 'Skill Exchanger', avatar: '' },
    });

    // Listen to in-room chat messages
    const handleRoomChat = (message) => {
      setChatMessages((prev) => [...prev, message]);
    };

    socket.on('live-room-chat', handleRoomChat);

    return () => {
      socket.emit('leave-live-room', { roomId });
      socket.off('live-room-chat', handleRoomChat);
    };
  }, [socket, roomId, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const messageData = {
      sender: {
        _id: user?._id || 'guest',
        name: user?.name || 'Guest Exchanger',
        avatar: user?.avatar || '',
      },
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (socket) {
      socket.emit('live-room-chat', {
        roomId,
        message: messageData,
      });
    } else {
      setChatMessages((prev) => [...prev, messageData]);
    }

    setChatInput('');
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedRoomId(true);
    setTimeout(() => setCopiedRoomId(false), 2000);
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to conclude this live exchange session?')) {
      setShowReviewModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col">
      
      {/* Top Session Bar */}
      <header className="h-14 border-b border-slate-800/80 bg-[#090d16] px-4 flex items-center justify-between z-30 shrink-0">
        
        {/* Left: Room details */}
        <div className="flex items-center gap-3">
          <Link to="/swaps" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Exit Room
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-pulse" />
            <h1 className="font-bold text-xs sm:text-sm text-slate-100 font-['Outfit'] flex items-center gap-1.5">
              Live Session: <span className="font-mono text-indigo-400">{roomId}</span>
            </h1>
          </div>

          <button
            onClick={copyRoomLink}
            className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 transition-colors ml-1 hidden sm:flex"
            title="Copy Invite Link"
          >
            {copiedRoomId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedRoomId ? 'Copied Link' : 'Copy Invite'}</span>
          </button>
        </div>

        {/* Center: Workspace Tab Selectors */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'whiteboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>
        </div>

        {/* Right: End Session button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEndSession}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-all"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>

      </header>

      {/* Main Classroom Workspace Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* Left / Center Column (7 Cols on desktop): Interactive Tool Workspace */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
          {activeTab === 'whiteboard' && (
            <LiveWhiteboard roomId={roomId} />
          )}

          {activeTab === 'code' && (
            <LiveCodeEditor roomId={roomId} />
          )}

          {activeTab === 'notes' && (
            <div className="flex flex-col h-full rounded-2xl glass-panel border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Live Shared Session Agenda
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Autosaved</span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write shared session takeaways, links, code references..."
                className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Video Stream + In-Room Chat */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full min-h-[500px]">
          
          {/* Video Stream Tile */}
          <div className="h-60 shrink-0">
            <LiveVideoCall
              roomId={roomId}
              sessionPartner={{
                name: 'Carlos Mendoza',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
              }}
              onEndCall={handleEndSession}
            />
          </div>

          {/* In-Room Live Chat */}
          <div className="flex-1 flex flex-col rounded-2xl glass-panel border border-slate-800 overflow-hidden bg-[#0a0f1d]/90">
            
            {/* Chat header */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Live In-Room Chat
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2 Participants</span>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                    msg.isSystem
                      ? 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] mx-auto w-full text-center'
                      : msg.sender?.name === user?.name
                      ? 'bg-indigo-600 text-white ml-auto rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 mr-auto rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  {!msg.isSystem && (
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-0.5">
                      <span className="font-semibold">{msg.sender?.name || 'Exchanger'}</span>
                      <span>{msg.time}</span>
                    </div>
                  )}
                  <p className="break-words">{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input box */}
            <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to peer..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* Review Modal after session completion */}
      {showReviewModal && (
        <ReviewModal
          swap={{ _id: 'demo-swap', offeredSkill: { name: 'React Architecture & Spanish' } }}
          targetUser={{
            _id: 'carlos-id',
            name: 'Carlos Mendoza',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          }}
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            navigate('/swaps');
          }}
          onSuccess={() => {
            setShowReviewModal(false);
            navigate('/swaps');
          }}
        />
      )}

    </div>
  );
};

export default LiveRoomPage;
