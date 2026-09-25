import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Intermediate' 
  },
  category: { 
    type: String, 
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science & AI',
      'UI/UX Design',
      'Languages',
      'Music & Audio',
      'Business & Marketing',
      'Photography & Video',
      'Academics & Science',
      'Fitness & Wellness',
      'Other'
    ], 
    default: 'Other' 
  },
  description: { type: String, default: '' },
  yearsOfExp: { type: Number, default: 1 }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  title: {
    type: String,
    default: 'Skill Enthusiast & Learner',
    trim: true,
  },
  bio: {
    type: String,
    default: 'Excited to exchange knowledge, teach what I love, and learn new skills!',
  },
  avatar: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: 'Global / Remote',
  },
  languages: {
    type: [String],
    default: ['English'],
  },
  skillsOffered: [skillItemSchema],
  skillsWanted: [skillItemSchema],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  completedSwaps: {
    type: Number,
    default: 0,
  },
  totalHoursTaught: {
    type: Number,
    default: 0,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  badges: {
    type: [String],
    default: ['Skill Explorer'],
  },
  availability: {
    days: {
      type: [String],
      default: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
    },
    timeSlots: {
      type: [String],
      default: ['Morning (9am - 12pm)', 'Evening (6pm - 9pm)'],
    },
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
