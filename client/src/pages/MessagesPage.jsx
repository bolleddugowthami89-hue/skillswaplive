import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Send, 
  Search, 
  MessageSquare, 
  Video, 
  Repeat, 
  Sparkles, 
  Check, 
  CheckCheck,
  User as UserIcon,
  Circle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const partnerIdFromQuery = searchParams.get('userId');

  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const messagesEndRef = useRef(null);

  // Fetch all conversation threads
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data?.success) {
        const convList = res.data.conversations || [];
        setConversations(convList);

        // If partnerId query param is present or pick first
        if (partnerIdFromQuery) {
          const matched = convList.find(c => c.partner._id === partnerIdFromQuery);
          if (matched) {
            setSelectedPartner(matched.partner);
          } else {
            // Fetch target partner profile directly
            try {
              const uRes = await api.get(`/users/${partnerIdFromQuery}`);
              if (uRes.data?.success) {
                setSelectedPartner(uRes.data.user);
              }
            } catch (e) {
              // ignore
            }
          }
        } else if (convList.length > 0 && !selectedPartner) {
          setSelectedPartner(convList[0].partner);
        }
      }
    } catch (err) {
      console.warn('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [partnerIdFromQuery]);

  // Fetch messages when selectedPartner changes
  useEffect(() => {
    if (!selectedPartner?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedPartner._id}`);
        if (res.data?.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.warn('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [selectedPartner]);

  // Socket listener for real-time private messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (selectedPartner && (msg.sender._id === selectedPartner._id || msg.sender === selectedPartner._id)) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    };

    socket.on('receive-private-message', handleReceiveMessage);

    return () => {
      socket.off('receive-private-message', handleReceiveMessage);
    };
  }, [socket, selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedPartner?._id) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');

    try {
      const res = await api.post('/messages', {
        receiverId: selectedPartner._id,
        content: textToSend,
      });

      if (res.data?.success) {
        const createdMsg = res.data.message;
        setMessages((prev) => [...prev, createdMsg]);

        // Send via socket to recipient in real-time
        if (socket) {
          socket.emit('send-private-message', {
            receiverId: selectedPartner._id,
            message: createdMsg,
          });
        }

        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.partner?.name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b0f19] text-slate-100 flex flex-col md:flex-row">
      
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-800/80 bg-[#090d16]/90 flex flex-col shrink-0">
        
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base font-['Outfit'] text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Direct Messages
            </h2>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No conversations active yet. Connect with members from the Explore page!
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedPartner?._id === conv.partner?._id;
              return (
                <button
                  key={conv.partner._id}
                  onClick={() => setSelectedPartner(conv.partner)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.partner.name}`}
                      alt={conv.partner.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700"
                    />
                    <span className={`w-2.5 h-2.5 rounded-full absolute -bottom-0.5 -right-0.5 ring-2 ring-[#090d16] ${
                      conv.partner.isOnline ? 'bg-emerald-400 live-pulse' : 'bg-slate-600'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-100 truncate">{conv.partner.name}</h4>
                      <span className="text-[10px] text-slate-500">
                        {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* Right Area: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-[#0b0f19] h-[calc(100vh-64px)] overflow-hidden">
        
        {selectedPartner ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-800 bg-[#090d16]/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${selectedPartner._id}`} className="flex items-center gap-3 group">
                  <img
                    src={selectedPartner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.name}`}
                    alt={selectedPartner.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {selectedPartner.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedPartner.isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      {selectedPartner.isOnline ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/live/swap-room-${selectedPartner._id.substring(0, 6)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Live Session</span>
                </Link>

                <Link
                  to={`/profile/${selectedPartner._id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="View Profile"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Message History Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
                  <Sparkles className="w-8 h-8 text-indigo-500/40" />
                  <p className="text-xs">Say hello to {selectedPartner.name} to plan your live skill swap session!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = (m.sender?._id || m.sender) === user?._id;
                  return (
                    <div
                      key={m._id || Math.random()}
                      className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${
                        isMine ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isMine
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                            : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#090d16] flex items-center gap-3">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={`Message ${selectedPartner.name}...`}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-700" />
            <h3 className="text-base font-bold text-slate-300">Select a Conversation</h3>
            <p className="text-xs max-w-sm">
              Choose a partner from the left or discover skilled peers to begin exchanging knowledge.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default MessagesPage;
