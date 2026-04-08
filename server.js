import express from 'express';
import multer from 'multer';
import connectDB from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import rootRoutes from './routes/rootRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', rootRoutes);
app.use('/', expenseRoutes);
app.use('/', groupRoutes);

app.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'Image size must be less than or equal to 2MB' });
    }

    return res.status(400).json({ message: error.message });
  }

  if (error.message === 'Only JPEG and PNG images are allowed') {
    return res.status(400).json({ message: error.message });
  }

  return next(error);
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
