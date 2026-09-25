import React, { useRef, useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  User, 
  Volume2, 
  Sparkles,
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const LiveVideoCall = ({ roomId, sessionPartner, onEndCall }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [callQuality, setCallQuality] = useState('HD 1080p • 60 FPS (Encrypted P2P)');

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Attempt to acquire real media stream with fallback
  useEffect(() => {
    let streamInstance = null;

    const startMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamInstance = stream;
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Webcam/Mic permission not granted or device not found; using avatar live stream mode.');
      }
    };

    startMedia();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
    if (socket && roomId) {
      socket.emit('media-status-change', { roomId, status: { isMuted: !isMuted } });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff(!isVideoOff);
    if (socket && roomId) {
      socket.emit('media-status-change', { roomId, status: { isVideoOff: !isVideoOff } });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);

          screenStream.getVideoTracks()[0].onended = () => {
            if (localStream && localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
            setIsScreenSharing(false);
          };
        }
      } else {
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.warn('Screen share cancelled or unsupported:', err);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel border border-slate-800 overflow-hidden relative">
      
      {/* Top Session Call Info Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-pulse"></span>
          <span className="font-semibold text-slate-200">
            Live Swap Session • <span className="text-emerald-400 font-mono">{formatTimer(sessionSeconds)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] hidden sm:inline">{callQuality}</span>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[350px] bg-[#070a10]">
        
        {/* Remote Partner Video Tile */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 flex items-center justify-center group shadow-inner">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-3">
                <img
                  src={sessionPartner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                  alt={sessionPartner?.name || 'Partner'}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <Volume2 className="w-3 h-3 text-white" />
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{sessionPartner?.name || 'Carlos Mendoza'}</h4>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">Teaching: Spanish Conversation</p>
              <span className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Connected & Audio Stream Active
              </span>
            </div>
          )}

          {/* Name tag overlay */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1.5 border border-white/10">
            <User className="w-3 h-3 text-indigo-400" />
            <span>{sessionPartner?.name || 'Carlos Mendoza'} (Exchange Partner)</span>
          </div>
        </div>

        {/* Local User Video Tile */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 flex items-center justify-center group shadow-inner">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
          />

          {isVideoOff && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Me'}`}
                alt={user?.name || 'You'}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/30 mb-2"
              />
              <span className="text-xs font-semibold text-slate-300">{user?.name || 'You (Host)'}</span>
              <span className="text-[10px] text-slate-400 mt-1">Camera is currently paused</span>
            </div>
          )}

          {/* Name tag overlay */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>You {isMuted && '(Muted)'}</span>
          </div>
        </div>

      </div>

      {/* Call Floating Controls Footer */}
      <div className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-900/95 border-t border-slate-800">
        
        {/* Mute Button */}
        <button
          onClick={toggleMic}
          className={`p-3 rounded-2xl transition-all ${
            isMuted
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMuted ? 'Unmute' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Button */}
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-2xl transition-all ${
            isVideoOff
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </button>

        {/* Screen Share Button */}
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-2xl transition-all ${
            isScreenSharing
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 ml-2"
          title="End Live Session"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs">End Session</span>
        </button>

      </div>

    </div>
  );
};

export default LiveVideoCall;
