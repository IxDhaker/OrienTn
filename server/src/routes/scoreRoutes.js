import express from 'express';
import { getSections, calculateScore } from '../controllers/scoreController.js';

const router = express.Router();

router.get('/sections', getSections);
router.post('/calculate', calculateScore);

export default router;
