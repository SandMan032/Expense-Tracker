import fs from 'fs/promises';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

const deleteExpenseImages = async (expenses) => {
  await Promise.all(
    expenses
      .map((expense) => expense.billImage)
      .filter(Boolean)
      .map(async (billImage) => {
        try {
          await fs.unlink(billImage);
        } catch {
          // Ignore missing files during group cleanup.
        }
      }),
  );
};

const getGroups = async (_req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });

    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    if (!Array.isArray(members) || members.length < 2) {
      return res
        .status(400)
        .json({ message: 'Members must contain at least 2 users' });
    }

    const normalizedMembers = members
      .map((member) => (typeof member === 'string' ? member.trim() : ''))
      .filter(Boolean);

    if (normalizedMembers.length < 2) {
      return res
        .status(400)
        .json({ message: 'Members must contain at least 2 valid users' });
    }

    const group = await Group.create({
      name: name.trim(),
      members: normalizedMembers,
    });

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create group' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch group' });
  }
};

const deleteGroup = async (req, res) => {
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

    await deleteExpenseImages(expenses);
    await Expense.deleteMany({ groupId: id });
    await group.deleteOne();

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete group' });
  }
};

export { createGroup, deleteGroup, getGroupById, getGroups };
