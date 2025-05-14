const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define file storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/xml';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File filter: Only allow XML files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/xml' || file.mimetype === 'text/xml') {
    cb(null, true);
  } else {
    cb(new Error('Only XML files are allowed!'), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
});

module.exports = upload;
