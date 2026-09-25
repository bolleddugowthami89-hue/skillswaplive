import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Get all users / Browse skills with search and filters
// @route   GET /api/users
// @access  Public (Optional Auth)
export const getUsers = async (req, res) => {
  try {
    const { search, category, skillLevel, day, sortBy, limit = 20, page = 1 } = req.query;

    let query = {};

    // Exclude current logged in user from browse results if authenticated
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // Text search in name, bio, title, skills offered, and skills wanted
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { title: regex },
        { bio: regex },
        { 'skillsOffered.name': regex },
        { 'skillsOffered.category': regex },
        { 'skillsWanted.name': regex },
      ];
    }

    // Category filter for skills offered
    if (category && category !== 'All') {
      query['skillsOffered.category'] = category;
    }

    // Skill level filter
    if (skillLevel && skillLevel !== 'All') {
      query['skillsOffered.level'] = skillLevel;
    }

    // Availability day filter
    if (day && day !== 'All') {
      query['availability.days'] = day;
    }

    // Sort order
    let sortOptions = { rating: -1, completedSwaps: -1 };
    if (sortBy === 'rating') sortOptions = { rating: -1 };
    if (sortBy === 'swaps') sortOptions = { completedSwaps: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    if (sortBy === 'hours') sortOptions = { totalHoursTaught: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // If user is authenticated, compute smart match score based on matching skillsOffered vs skillsWanted
    const enrichedUsers = users.map((u) => {
      const userObj = u.toObject();
      let matchScore = 70; // baseline
      let matchingSkills = [];

      if (req.user) {
        const myWanted = (req.user.skillsWanted || []).map(s => s.name.toLowerCase());
        const myOffered = (req.user.skillsOffered || []).map(s => s.name.toLowerCase());

        const partnerOffered = (userObj.skillsOffered || []).map(s => s.name.toLowerCase());
        const partnerWanted = (userObj.skillsWanted || []).map(s => s.name.toLowerCase());

        // Check if what they offer is what I want
        const canTeachMe = partnerOffered.filter(s => myWanted.some(w => w.includes(s) || s.includes(w)));
        // Check if what I offer is what they want
        const canLearnFromMe = myOffered.filter(s => partnerWanted.some(w => w.includes(s) || s.includes(w)));

        if (canTeachMe.length > 0 && canLearnFromMe.length > 0) {
          matchScore = 95 + Math.min(5, (canTeachMe.length + canLearnFromMe.length));
        } else if (canTeachMe.length > 0 || canLearnFromMe.length > 0) {
          matchScore = 80 + Math.min(10, (canTeachMe.length + canLearnFromMe.length) * 5);
        }

        matchingSkills = [...new Set([...canTeachMe, ...canLearnFromMe])];
      }

      return {
        ...userObj,
        matchScore: Math.min(100, matchScore),
        matchingSkills,
      };
    });

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      users: enrichedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile by ID with reviews
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'name avatar title')
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      user,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured mentors / top exchangers
// @route   GET /api/users/featured
// @access  Public
export const getFeaturedUsers = async (req, res) => {
  try {
    const featured = await User.find({})
      .select('-password')
      .sort({ rating: -1, completedSwaps: -1 })
      .limit(6);

    res.json({
      success: true,
      users: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get skill categories statistics
// @route   GET /api/users/categories
// @access  Public
export const getSkillCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'Web Development', name: 'Web Development', icon: 'Code', description: 'React, Node, Python, Next.js, TypeScript', color: 'from-blue-500 to-indigo-600' },
      { id: 'Data Science & AI', name: 'AI & Data Science', icon: 'Cpu', description: 'Machine Learning, PyTorch, LangChain, NLP', color: 'from-purple-500 to-pink-600' },
      { id: 'UI/UX Design', name: 'UI/UX Design', icon: 'Palette', description: 'Figma, Design Systems, Wireframing, Prototyping', color: 'from-amber-500 to-orange-600' },
      { id: 'Languages', name: 'Languages', icon: 'Globe', description: 'Spanish, Japanese, French, German, English Fluency', color: 'from-emerald-500 to-teal-600' },
      { id: 'Mobile Development', name: 'Mobile Apps', icon: 'Smartphone', description: 'Flutter, React Native, iOS Swift, Android Kotlin', color: 'from-cyan-500 to-blue-600' },
      { id: 'Music & Audio', name: 'Music & Audio', icon: 'Music', description: 'Guitar, Piano, Ableton, Audio Mixing & Production', color: 'from-rose-500 to-red-600' },
      { id: 'Business & Marketing', name: 'Business & Growth', icon: 'TrendingUp', description: 'Growth Hacking, SEO, Pitching, Product Strategy', color: 'from-violet-500 to-purple-600' },
      { id: 'Photography & Video', name: 'Video & Visuals', icon: 'Camera', description: 'Premiere Pro, DaVinci, Cinematography, Lightroom', color: 'from-yellow-500 to-amber-600' },
    ];

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
