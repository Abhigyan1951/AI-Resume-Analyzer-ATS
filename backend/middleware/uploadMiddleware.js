import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ApiError from '../utils/apiError.js';

/**
 * @file uploadMiddleware.js
 * @description Multer configuration middleware for secure PDF resume file uploads.
 * Restricts uploads to PDF MIME type, limits maximum file size to 5MB, and manages local disk storage.
 */

// Derive directory path in ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

/**
 * Configure Multer Disk Storage Engine
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Generate unique sanitized file name: resume-<timestamp>-<random>.pdf
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `resume-${uniqueSuffix}${extension}`);
  },
});

/**
 * File Filter: Accept only application/pdf files
 */
const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only PDF documents are allowed.'), false);
  }
};

/**
 * Multer Instance with 5MB file size constraint
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes in bytes
    files: 1, // Single file upload per request
  },
});

/**
 * Middleware Wrapper to catch Multer-specific errors and convert to ApiError
 */
export const uploadResumeFile = (req, res, next) => {
  const singleUpload = upload.single('resume');

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File size exceeds maximum allowed limit of 5MB.'));
      }
      return next(new ApiError(400, `Upload error: ${err.message}`));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

export default uploadResumeFile;
