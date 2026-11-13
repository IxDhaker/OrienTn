import express from 'express';
import { generateSummerPrepRoadmap } from '../controllers/aiController.js';

const router = express.Router();

router.post('/summer-prep', generateSummerPrepRoadmap);

export default router;
