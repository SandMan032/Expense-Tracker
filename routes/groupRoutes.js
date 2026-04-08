import { Router } from 'express';
import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
} from '../controllers/groupController.js';

const router = Router();

router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.delete('/groups/:id', deleteGroup);
router.get('/groups/:id', getGroupById);

export default router;
