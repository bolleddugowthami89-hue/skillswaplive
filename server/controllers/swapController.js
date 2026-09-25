import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create a new skill swap request
// @route   POST /api/swaps
// @access  Private
export const createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, message, proposedDate, proposedTimeSlot, durationMinutes } = req.body;

    if (!receiverId || !offeredSkill || !requestedSkill || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a skill swap with yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    const swap = await SwapRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      offeredSkill,
      requestedSkill,
      message,
      proposedDate: proposedDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      proposedTimeSlot: proposedTimeSlot || 'Flexible',
      durationMinutes: durationMinutes || 45,
    });

    // Create notification for receiver
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'swap_request',
      title: 'New Skill Swap Request!',
      message: `${req.user.name} wants to swap skills: "${offeredSkill.name}" for your "${requestedSkill.name}"`,
      link: `/swaps?id=${swap._id}`,
    });

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('sender', 'name avatar title rating')
      .populate('receiver', 'name avatar title rating');

    res.status(201).json({
      success: true,
      swap: populatedSwap,
      message: 'Skill swap request sent successfully!',
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all swaps for current user (sent & received)
// @route   GET /api/swaps
// @access  Private
export const getMySwaps = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('sender', 'name email avatar title rating completedSwaps')
      .populate('receiver', 'name email avatar title rating completedSwaps')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: swaps.length,
      swaps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single swap details
// @route   GET /api/swaps/:id
// @access  Private
export const getSwapById = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('sender', 'name email avatar title rating skillsOffered skillsWanted')
      .populate('receiver', 'name email avatar title rating skillsOffered skillsWanted');

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    // Check if user is either sender or receiver
    if (
      swap.sender._id.toString() !== req.user._id.toString() &&
      swap.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this swap' });
    }

    res.json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update swap status (accept, reject, cancel, in_progress, completed)
// @route   PUT /api/swaps/:id/status
// @access  Private
export const updateSwapStatus = async (req, res) => {
  try {
    const { status, sessionNotes } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const isSender = swap.sender.toString() === req.user._id.toString();
    const isReceiver = swap.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this swap' });
    }

    // Authorization checks based on action
    if (status === 'accepted' || status === 'rejected') {
      if (!isReceiver) {
        return res.status(403).json({ success: false, message: 'Only the recipient can accept or reject this request' });
      }
    }

    swap.status = status;
    if (sessionNotes !== undefined) {
      swap.sessionNotes = sessionNotes;
    }

    if (status === 'completed') {
      swap.completedAt = new Date();

      // Increment counters for both users
      await User.findByIdAndUpdate(swap.sender, {
        $inc: { completedSwaps: 1, totalHoursTaught: 1 },
      });
      await User.findByIdAndUpdate(swap.receiver, {
        $inc: { completedSwaps: 1, totalHoursTaught: 1 },
      });
    }

    await swap.save();

    // Notify the other user
    const otherUserId = isSender ? swap.receiver : swap.sender;
    const statusMessages = {
      accepted: `${req.user.name} accepted your skill swap request! Ready to schedule a live session.`,
      rejected: `${req.user.name} declined the skill swap request.`,
      in_progress: `${req.user.name} started the live skill swap session!`,
      completed: `The skill swap session with ${req.user.name} was marked as completed. Please leave a review!`,
      cancelled: `${req.user.name} cancelled the swap request.`,
    };

    if (statusMessages[status]) {
      await Notification.create({
        recipient: otherUserId,
        sender: req.user._id,
        type: status === 'accepted' ? 'swap_accepted' : 'swap_rejected',
        title: `Swap Status: ${status.toUpperCase().replace('_', ' ')}`,
        message: statusMessages[status],
        link: `/swaps?id=${swap._id}`,
      });
    }

    const updatedSwap = await SwapRequest.findById(swap._id)
      .populate('sender', 'name avatar title rating')
      .populate('receiver', 'name avatar title rating');

    res.json({
      success: true,
      swap: updatedSwap,
      message: `Swap request updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating swap:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
