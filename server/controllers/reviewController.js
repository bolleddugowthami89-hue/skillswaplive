import Review from '../models/Review.js';
import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';

// @desc    Create a review for a skill swap partner
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { revieweeId, swapRequestId, rating, comment, skillLearned } = req.body;

    if (!revieweeId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating, comment, and reviewee are required' });
    }

    if (revieweeId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Check if swap exists and is completed
    if (swapRequestId) {
      const swap = await SwapRequest.findById(swapRequestId);
      if (swap) {
        if (swap.sender.toString() === req.user._id.toString()) {
          swap.isReviewedBySender = true;
        } else if (swap.receiver.toString() === req.user._id.toString()) {
          swap.isReviewedByReceiver = true;
        }
        await swap.save();
      }
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      swapRequest: swapRequestId || null,
      rating: Number(rating),
      comment: comment.trim(),
      skillLearned: skillLearned || 'General Skill',
    });

    // Recalculate reviewee average rating and count
    const allReviews = await Review.find({ reviewee: revieweeId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 5.0;

    await User.findByIdAndUpdate(revieweeId, {
      rating: Number(avgRating),
      reviewCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar title');

    res.status(201).json({
      success: true,
      review: populatedReview,
      message: 'Thank you for leaving a review!',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
