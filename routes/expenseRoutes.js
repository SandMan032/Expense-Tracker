import { Router } from 'express';
import {
  createExpense,
  getGroupBalances,
  getGroupExpenses,
  getGroupSettlements,
} from '../controllers/expenseController.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/expenses', upload.single('bill'), createExpense);
router.get('/groups/:id/balances', getGroupBalances);
router.get('/groups/:id/expenses', getGroupExpenses);
router.get('/groups/:id/settlements', getGroupSettlements);

export default router;
