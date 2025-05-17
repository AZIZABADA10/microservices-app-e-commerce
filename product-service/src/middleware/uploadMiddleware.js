const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');
const fs = require('fs');

// Assure que le dossier uploads existe
const uploadPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedName = sanitize(file.originalname.replace(/\s+/g, '_'));
    const uniqueName = Date.now() + '-' + sanitizedName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
