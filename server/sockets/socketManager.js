import User from '../models/User.js';

export const setupSockets = (io) => {
  // Map of userId -> socketId
  const onlineUsers = new Map();
  // Map of socketId -> userId
  const socketUserMap = new Map();
  // Active Live Rooms: roomId -> Set of { socketId, userId, userName, userAvatar }
  const roomParticipants = new Map();

  io.on('connection', (socket) => {
    // console.log(`[Socket.io] New client connected: ${socket.id}`);

    // User authentication / identification
    socket.on('user-online', async (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      socketUserMap.set(socket.id, userId);

      try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
        io.emit('user-status-changed', { userId, isOnline: true });
      } catch (err) {
        // silent
      }
    });

    // -------------------------------------------------------------
    // Direct Messaging via Sockets
    // -------------------------------------------------------------
    socket.on('send-private-message', (data) => {
      const { receiverId, message } = data;
      const recipientSocketId = onlineUsers.get(receiverId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive-private-message', message);
      }
    });

    socket.on('typing', ({ receiverId, senderId, senderName }) => {
      const recipientSocketId = onlineUsers.get(receiverId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user-typing', { senderId, senderName });
      }
    });

    socket.on('stop-typing', ({ receiverId, senderId }) => {
      const recipientSocketId = onlineUsers.get(receiverId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user-stop-typing', { senderId });
      }
    });

    // -------------------------------------------------------------
    // LIVE SKILL SESSION & WEBRTC ROOMS
    // -------------------------------------------------------------
    socket.on('join-live-room', ({ roomId, user }) => {
      socket.join(roomId);

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map());
      }

      const room = roomParticipants.get(roomId);
      const participantInfo = {
        socketId: socket.id,
        user: user || { _id: socket.id, name: 'Guest Exchanger', avatar: '' },
      };
      room.set(socket.id, participantInfo);

      // Notify others in room
      const existingParticipants = Array.from(room.values()).filter(p => p.socketId !== socket.id);
      
      // Send list of already present peers to the newcomer
      socket.emit('existing-room-participants', existingParticipants);

      // Tell existing participants a new user joined
      socket.to(roomId).emit('participant-joined', participantInfo);

      console.log(`[Live Room] User ${user?.name || socket.id} joined room ${roomId}. Total: ${room.size}`);
    });

    // WebRTC Signaling: Offer
    socket.on('webrtc-offer', ({ targetSocketId, offer, callerInfo }) => {
      io.to(targetSocketId).emit('webrtc-offer', {
        callerSocketId: socket.id,
        offer,
        callerInfo,
      });
    });

    // WebRTC Signaling: Answer
    socket.on('webrtc-answer', ({ targetSocketId, answer }) => {
      io.to(targetSocketId).emit('webrtc-answer', {
        responderSocketId: socket.id,
        answer,
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('webrtc-ice-candidate', {
        senderSocketId: socket.id,
        candidate,
      });
    });

    // Live Room: Collaborative Whiteboard drawing sync
    socket.on('whiteboard-draw', ({ roomId, drawData }) => {
      socket.to(roomId).emit('whiteboard-draw', drawData);
    });

    socket.on('whiteboard-clear', ({ roomId }) => {
      socket.to(roomId).emit('whiteboard-clear');
    });

    // Live Room: Collaborative Code / Notes Sync
    socket.on('code-update', ({ roomId, code, language }) => {
      socket.to(roomId).emit('code-update', { code, language });
    });

    // Live Room: In-Call Chat message
    socket.on('live-room-chat', ({ roomId, message }) => {
      io.to(roomId).emit('live-room-chat', message);
    });

    // Media status update (e.g., mute / video off / screen share)
    socket.on('media-status-change', ({ roomId, status }) => {
      socket.to(roomId).emit('participant-media-status', {
        socketId: socket.id,
        status,
      });
    });

    // Leave Live Room
    socket.on('leave-live-room', ({ roomId }) => {
      handleLeaveRoom(socket, roomId);
    });

    // Disconnect handler
    socket.on('disconnect', async () => {
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        socketUserMap.delete(socket.id);

        try {
          await User.findByIdAndUpdate(userId, { isOnline: false });
          io.emit('user-status-changed', { userId, isOnline: false });
        } catch (err) {
          // silent
        }
      }

      // Check all live rooms and remove this socket
      for (const [roomId, room] of roomParticipants.entries()) {
        if (room.has(socket.id)) {
          handleLeaveRoom(socket, roomId);
        }
      }
    });
  });

  const handleLeaveRoom = (socket, roomId) => {
    socket.leave(roomId);
    if (roomParticipants.has(roomId)) {
      const room = roomParticipants.get(roomId);
      const participant = room.get(socket.id);
      room.delete(socket.id);

      socket.to(roomId).emit('participant-left', {
        socketId: socket.id,
        participant,
      });

      if (room.size === 0) {
        roomParticipants.delete(roomId);
      }
    }
  };
};
