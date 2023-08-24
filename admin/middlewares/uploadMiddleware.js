import multer from "multer";

// Set storage engine
const storage = multer.memoryStorage();

// Configure multer upload
const upload = multer({ storage: storage });

export { upload };
