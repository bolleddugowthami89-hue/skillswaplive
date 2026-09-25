import express from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user/:userId', getReviewsForUser);
router.post('/', protect, createReview);

export default router;
