import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: String,
      required: true,
      trim: true,
    },
    participants: {
      type: [String],
      default: [],
    },
    splitAmount: {
      type: Number,
    },
    billImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
