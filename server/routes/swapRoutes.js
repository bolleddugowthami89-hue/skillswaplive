import express from 'express';
import { createSwapRequest, getMySwaps, getSwapById, updateSwapStatus } from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createSwapRequest);
router.get('/', getMySwaps);
router.get('/:id', getSwapById);
router.put('/:id/status', updateSwapStatus);

export default router;
