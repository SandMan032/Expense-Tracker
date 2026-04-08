import fs from 'fs';
import multer from 'multer';

const uploadsDir = 'uploads/';

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${sanitizedOriginalName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Only JPEG and PNG images are allowed'));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;
