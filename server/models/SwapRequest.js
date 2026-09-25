import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offeredSkill: {
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    level: { type: String, default: 'Intermediate' },
  },
  requestedSkill: {
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    level: { type: String, default: 'Intermediate' },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  message: {
    type: String,
    required: [true, 'Please include a message describing what you want to learn & teach'],
  },
  proposedDate: {
    type: Date,
  },
  proposedTimeSlot: {
    type: String,
    default: 'Flexible',
  },
  durationMinutes: {
    type: Number,
    default: 45,
  },
  meetingRoomId: {
    type: String,
    default: () => 'swap-' + Math.random().toString(36).substring(2, 10),
  },
  sessionNotes: {
    type: String,
    default: '',
  },
  isReviewedBySender: {
    type: Boolean,
    default: false,
  },
  isReviewedByReceiver: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
