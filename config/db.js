import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/expense-tracker';

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};

export default connectDB;
