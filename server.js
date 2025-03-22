const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const policyRoutes = require('./routes/policyRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cpuMonitor = require('./services/cpuMonitor');
const scheduleRoutes = require('./routes/scheduleRoutes');
const scheduleService = require('./services/scheduleService');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));


app.use('/api/policies', policyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', scheduleRoutes);


const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

cpuMonitor.startMonitoring();

scheduleService.startScheduler();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));