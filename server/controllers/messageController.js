import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all active conversations with latest messages
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name avatar isOnline title')
      .populate('receiver', 'name avatar isOnline title')
      .sort({ createdAt: -1 });

    // Group by unique conversation partner
    const conversationMap = new Map();

    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      // Count unread messages where current user is receiver
      if (msg.receiver._id.toString() === userId.toString() && !msg.read) {
        const conv = conversationMap.get(partnerId);
        conv.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get message history between current user and partner
// @route   GET /api/messages/:partnerId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a direct message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, swapRequestId } = req.body;

    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver and message content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
      swapRequest: swapRequestId || null,
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      message: populatedMsg,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
