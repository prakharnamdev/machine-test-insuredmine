const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const workerpool = require('workerpool');
const pool = workerpool.pool(__dirname + '/../workers/uploadWorker.js');

const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.resolve(__dirname, '../uploads', req.file.filename);
        console.log("Processing file at:", filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ error: 'File not found after upload' });
        }

        const result = await pool.exec('processFile', [filePath]);
        res.json({ success: true, message: result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;