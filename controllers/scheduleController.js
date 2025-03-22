const moment = require('moment-timezone');
const Message = require('../models/Message');

exports.scheduleMessage = async (req, res) => {
    try {
        const { message, day, time } = req.body;

        if (!message || !day || !time) {
            return res.status(400).json({ error: 'Message, day, and time are required' });
        }

        const scheduledTime = moment.tz(`${day} ${time}`, 'YYYY-MM-DD HH:mm', 'UTC').toDate();

        const newMessage = new Message({ text: message, sendTime: scheduledTime });
        await newMessage.save();

        res.json({ success: true, message: '✅ Message scheduled successfully!', data: newMessage });

    } catch (err) {
        console.error('Error scheduling message:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
