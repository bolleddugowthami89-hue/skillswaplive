import express from 'express';
import { getUsers, getUserById, getFeaturedUsers, getSkillCategories } from '../controllers/userController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getUsers);
router.get('/featured', getFeaturedUsers);
router.get('/categories', getSkillCategories);
router.get('/:id', getUserById);

export default router;
