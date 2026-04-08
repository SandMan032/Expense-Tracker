import fs from 'fs/promises';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import { calculateNetBalances } from '../utils/balanceUtils.js';
import { minimizeTransactions } from '../utils/settlementUtils.js';

const removeUploadedFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup failures for already-missing files.
  }
};

const normalizeParticipants = (participants) => {
  if (Array.isArray(participants)) {
    return participants;
  }

  if (typeof participants === 'string') {
    const trimmedParticipants = participants.trim();

    if (!trimmedParticipants) {
      return [];
    }

    try {
      const parsedParticipants = JSON.parse(trimmedParticipants);

      if (Array.isArray(parsedParticipants)) {
        return parsedParticipants;
      }
    } catch {
      return trimmedParticipants
        .split(',')
        .map((participant) => participant.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const createExpense = async (req, res) => {
  try {
    const { groupId, title, amount, paidBy, participants } = req.body;
    const billImage = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      await removeUploadedFile(billImage);
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    if (!title || !title.trim()) {
      await removeUploadedFile(billImage);
      return res.status(400).json({ message: 'Title is required' });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      await removeUploadedFile(billImage);
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (!paidBy || !paidBy.trim()) {
      await removeUploadedFile(billImage);
      return res.status(400).json({ message: 'paidBy is required' });
    }

    const parsedParticipants = normalizeParticipants(participants);

    if (parsedParticipants.length === 0) {
      await removeUploadedFile(billImage);
      return res
        .status(400)
        .json({ message: 'Participants must contain at least 1 user' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      await removeUploadedFile(billImage);
      return res.status(404).json({ message: 'Group not found' });
    }

    const normalizedPaidBy = paidBy.trim();
    const normalizedParticipants = parsedParticipants
      .map((participant) =>
        typeof participant === 'string' ? participant.trim() : '',
      )
      .filter(Boolean);

    if (!group.members.includes(normalizedPaidBy)) {
      await removeUploadedFile(billImage);
      return res.status(400).json({ message: 'paidBy must be a group member' });
    }

    if (normalizedParticipants.length === 0) {
      await removeUploadedFile(billImage);
      return res
        .status(400)
        .json({ message: 'Participants must contain valid group members' });
    }

    const hasInvalidParticipant = normalizedParticipants.some(
      (participant) => !group.members.includes(participant),
    );

    if (hasInvalidParticipant) {
      await removeUploadedFile(billImage);
      return res
        .status(400)
        .json({ message: 'All participants must be valid group members' });
    }

    const splitAmount = numericAmount / normalizedParticipants.length;

    const expense = await Expense.create({
      groupId,
      title: title.trim(),
      amount: numericAmount,
      paidBy: normalizedPaidBy,
      participants: normalizedParticipants,
      splitAmount,
      billImage,
    });

    return res.status(201).json(expense);
  } catch (error) {
    await removeUploadedFile(req.file?.path);
    return res.status(500).json({ message: 'Failed to create expense' });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ groupId: id }).sort({ createdAt: -1 });

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

const getGroupBalances = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ groupId: id });

    if (expenses.length === 0) {
      return res.status(200).json({});
    }

    const balances = calculateNetBalances(expenses);

    return res.status(200).json(balances);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch balances' });
  }
};

const getGroupSettlements = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ groupId: id });

    if (expenses.length === 0) {
      return res.status(200).json([]);
    }

    const balances = calculateNetBalances(expenses);
    const settlements = minimizeTransactions(balances);

    return res.status(200).json(settlements);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch settlements' });
  }
};

export {
  createExpense,
  getGroupBalances,
  getGroupExpenses,
  getGroupSettlements,
};
