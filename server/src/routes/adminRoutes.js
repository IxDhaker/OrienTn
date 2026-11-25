import express from 'express';
import authAdmin from '../middleware/authAdmin.js';
import {
  createFaculty, updateFaculty, deleteFaculty,
  createOffre, updateOffre, deleteOffre,
  createClub, updateClub, deleteClub, listSectionsBac
} from '../controllers/adminController.js';

const router = express.Router();
router.use(authAdmin); // tout est protégé

router.post('/faculties', createFaculty);
router.put('/faculties/:id', updateFaculty);
router.delete('/faculties/:id', deleteFaculty);

router.post('/faculties/:id/offres', createOffre);
router.put('/offres/:id', updateOffre);
router.delete('/offres/:id', deleteOffre);

router.post('/faculties/:id/clubs', createClub);
router.put('/clubs/:id', updateClub);
router.delete('/clubs/:id', deleteClub);

router.get('/sections-bac', listSectionsBac);

export default router;