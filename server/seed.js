import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import SwapRequest from './models/SwapRequest.js';
import Review from './models/Review.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Elena Rostova',
    email: 'elena@skillswap.com',
    password: 'password123',
    title: 'Senior Frontend Architect & UI Enthusiast',
    bio: '10+ years building scalable web applications with React, Next.js, and TypeScript. Looking to master conversational Spanish and digital audio production!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    location: 'Berlin, Germany',
    languages: ['English', 'German', 'Russian'],
    rating: 4.9,
    reviewCount: 24,
    completedSwaps: 18,
    totalHoursTaught: 32,
    isOnline: true,
    badges: ['Top Mentor', 'React Guru', 'Fast Responder'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['Morning (9am - 12pm)', 'Evening (6pm - 9pm)'],
    },
    skillsOffered: [
      { name: 'React & Next.js', level: 'Expert', category: 'Web Development', description: 'Advanced state management, SSR, performance optimization, and custom hooks.', yearsOfExp: 6 },
      { name: 'Tailwind CSS', level: 'Expert', category: 'Web Development', description: 'Modern responsive layouts, animations, design system tokens.', yearsOfExp: 4 },
      { name: 'TypeScript', level: 'Advanced', category: 'Web Development', description: 'Type safety, generics, modern patterns.', yearsOfExp: 5 },
    ],
    skillsWanted: [
      { name: 'Spanish Conversation', level: 'Beginner', category: 'Languages' },
      { name: 'Music Production (Ableton)', level: 'Beginner', category: 'Music & Audio' },
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    name: 'Carlos Mendoza',
    email: 'carlos@skillswap.com',
    password: 'password123',
    title: 'Native Spanish Instructor & Acoustic Guitarist',
    bio: 'Certified language tutor from Madrid with a passion for music, acoustic guitar, and Latin jazz. Eager to level up my full-stack web development skills in React & Node.js!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    location: 'Madrid, Spain',
    languages: ['Spanish', 'English', 'Portuguese'],
    rating: 5.0,
    reviewCount: 31,
    completedSwaps: 26,
    totalHoursTaught: 48,
    isOnline: true,
    badges: ['Super Exchanger', 'Language Master', 'Community Star'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      timeSlots: ['Afternoon (2pm - 5pm)', 'Evening (7pm - 10pm)'],
    },
    skillsOffered: [
      { name: 'Spanish Conversation & Grammar', level: 'Expert', category: 'Languages', description: 'Fluency coaching, pronunciation, cultural nuances, and DELE exam prep.', yearsOfExp: 8 },
      { name: 'Acoustic Guitar & Chords', level: 'Advanced', category: 'Music & Audio', description: 'Fingerpicking, rhythm, flamenco basics, and song composition.', yearsOfExp: 7 },
    ],
    skillsWanted: [
      { name: 'React & Next.js', level: 'Intermediate', category: 'Web Development' },
      { name: 'Node.js & MongoDB', level: 'Beginner', category: 'Web Development' },
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    name: 'Aisha Patel',
    email: 'aisha@skillswap.com',
    password: 'password123',
    title: 'Product Designer (Figma) & Design Systems Lead',
    bio: 'Lead UI/UX designer crafting intuitive digital experiences and micro-interactions. Want to learn Python for data visualization and generative AI tools.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    location: 'London, UK',
    languages: ['English', 'Hindi'],
    rating: 4.8,
    reviewCount: 19,
    completedSwaps: 14,
    totalHoursTaught: 22,
    isOnline: false,
    badges: ['Design Visionary', 'Verified Pro'],
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday'],
      timeSlots: ['Evening (6pm - 9pm)'],
    },
    skillsOffered: [
      { name: 'UI/UX Design in Figma', level: 'Expert', category: 'UI/UX Design', description: 'Component variants, auto-layout, interactive prototypes, and design tokens.', yearsOfExp: 5 },
      { name: 'User Research & Wireframing', level: 'Advanced', category: 'UI/UX Design', description: 'Usability testing, customer journey mapping, and low-fi prototyping.', yearsOfExp: 4 },
    ],
    skillsWanted: [
      { name: 'Python for Data Analysis', level: 'Beginner', category: 'Data Science & AI' },
      { name: 'Machine Learning Basics', level: 'Beginner', category: 'Data Science & AI' },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      website: 'https://aishadesign.io',
    },
  },
  {
    name: 'David Kim',
    email: 'david@skillswap.com',
    password: 'password123',
    title: 'AI Researcher & Python ML Engineer',
    bio: 'Data scientist and PyTorch enthusiast focusing on LLMs, NLP, and computer vision. Excited to learn UI/UX design to build beautiful frontend demos for AI apps.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    location: 'San Francisco, USA',
    languages: ['English', 'Korean'],
    rating: 4.9,
    reviewCount: 22,
    completedSwaps: 16,
    totalHoursTaught: 28,
    isOnline: true,
    badges: ['AI Pioneer', 'Top Mentor'],
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning (10am - 2pm)', 'Evening (5pm - 8pm)'],
    },
    skillsOffered: [
      { name: 'Python & Machine Learning', level: 'Expert', category: 'Data Science & AI', description: 'NumPy, Pandas, PyTorch, model fine-tuning, RAG pipelines.', yearsOfExp: 6 },
      { name: 'LangChain & GenAI', level: 'Advanced', category: 'Data Science & AI', description: 'Prompt engineering, vector databases, building autonomous AI agents.', yearsOfExp: 3 },
    ],
    skillsWanted: [
      { name: 'UI/UX Design in Figma', level: 'Beginner', category: 'UI/UX Design' },
      { name: 'Tailwind CSS', level: 'Beginner', category: 'Web Development' },
    ],
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    name: 'Maya Lin',
    email: 'maya@skillswap.com',
    password: 'password123',
    title: 'Growth Marketer & SEO Specialist',
    bio: 'Helped 15+ startups scale from zero to $1M ARR via inbound marketing, SEO, and paid acquisition. Looking to learn iOS Mobile Development with SwiftUI or Flutter.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    location: 'Singapore',
    languages: ['English', 'Mandarin'],
    rating: 4.7,
    reviewCount: 15,
    completedSwaps: 11,
    totalHoursTaught: 19,
    isOnline: false,
    badges: ['Growth Hacker'],
    availability: {
      days: ['Wednesday', 'Saturday'],
      timeSlots: ['Morning (9am - 12pm)'],
    },
    skillsOffered: [
      { name: 'SEO & Content Strategy', level: 'Expert', category: 'Business & Marketing', description: 'Keyword clustering, technical SEO, conversion rate optimization.', yearsOfExp: 5 },
      { name: 'Startup Growth Funnels', level: 'Advanced', category: 'Business & Marketing', description: 'A/B testing, user onboarding optimization, viral loops.', yearsOfExp: 4 },
    ],
    skillsWanted: [
      { name: 'Flutter & Dart', level: 'Beginner', category: 'Mobile Development' },
      { name: 'SwiftUI', level: 'Beginner', category: 'Mobile Development' },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await SwapRequest.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Cleared existing records.');

    // Create users (password hashing happens via pre-save)
    const createdUsers = [];
    for (const u of demoUsers) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} demo users.`);

    // Create a sample accepted swap request between Elena & Carlos
    const elena = createdUsers[0];
    const carlos = createdUsers[1];
    const aisha = createdUsers[2];
    const david = createdUsers[3];

    const swap1 = await SwapRequest.create({
      sender: elena._id,
      receiver: carlos._id,
      offeredSkill: { name: 'React & Next.js', category: 'Web Development', level: 'Expert' },
      requestedSkill: { name: 'Spanish Conversation', category: 'Languages', level: 'Expert' },
      status: 'accepted',
      proposedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      proposedTimeSlot: 'Evening (7pm - 8pm)',
      durationMinutes: 60,
      meetingRoomId: 'swap-live-elena-carlos',
      message: "Hi Carlos! I saw you're looking to learn React and teach Spanish. Let's do an exchange session this week!",
      sessionNotes: "Focus: React useEffect, custom hooks & Spanish conversational greetings.",
    });

    const swap2 = await SwapRequest.create({
      sender: aisha._id,
      receiver: david._id,
      offeredSkill: { name: 'UI/UX Design in Figma', category: 'UI/UX Design', level: 'Expert' },
      requestedSkill: { name: 'Python & Machine Learning', category: 'Data Science & AI', level: 'Expert' },
      status: 'pending',
      proposedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      proposedTimeSlot: 'Morning (10am - 11am)',
      durationMinutes: 45,
      meetingRoomId: 'swap-live-aisha-david',
      message: "Hey David! I'd love to learn how to connect LangChain with custom Python endpoints in exchange for a Figma design workshop.",
    });

    // Sample reviews
    await Review.create({
      reviewer: carlos._id,
      reviewee: elena._id,
      swapRequest: swap1._id,
      rating: 5,
      comment: 'Elena is an exceptional mentor! She explained React props and hooks so clearly with real-world examples. 10/10 recommendation!',
      skillLearned: 'React & Next.js',
    });

    await Review.create({
      reviewer: elena._id,
      reviewee: carlos._id,
      swapRequest: swap1._id,
      rating: 5,
      comment: 'Carlos made speaking Spanish so fun and stress-free! Patient, engaging, and gave amazing pronunciation tips.',
      skillLearned: 'Spanish Conversation',
    });

    // Sample messages
    await Message.create({
      sender: elena._id,
      receiver: carlos._id,
      content: 'Hey Carlos! Looking forward to our upcoming live session on Thursday.',
      swapRequest: swap1._id,
      read: true,
    });

    await Message.create({
      sender: carlos._id,
      receiver: elena._id,
      content: '¡Hola Elena! Me too! I prepared a few React questions and some Spanish conversation prompts for us.',
      swapRequest: swap1._id,
      read: true,
    });

    console.log('[Seed] Database seeded successfully with demo swaps, reviews & messages!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();
