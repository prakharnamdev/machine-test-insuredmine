const workerpool = require('workerpool');
const path = require('path');
const fs = require('fs');
const pool = workerpool.pool(__dirname + '/../workers/uploadWorker.js');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.resolve(__dirname, '../uploads', req.file.filename);
        console.log("Uploaded file path:", filePath);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!fs.existsSync(filePath)) {
            console.error("File not found after upload:", filePath);
            return res.status(500).json({ error: 'File not found after upload' });
        }

        const result = await pool.exec('processFile', [filePath]);
        res.json({ success: true, result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};