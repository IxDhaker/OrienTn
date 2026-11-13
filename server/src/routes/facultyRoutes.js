import express from 'express';
import { getFaculties, getFacultyById } from '../controllers/facultyController.js';

const router = express.Router();

router.get('/', getFaculties);
router.get('/:id', getFacultyById);

export default router;
