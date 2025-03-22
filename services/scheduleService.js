const schedule = require('node-schedule');
const Message = require('../models/Message');

exports.startScheduler = function () {
    console.log('✅ Scheduler started successfully!');

    schedule.scheduleJob('* * * * *', async () => {
        try {
            console.log('⏳ Checking for scheduled messages...');
            const messages = await Message.find({ sendTime: { $lte: new Date() } });

            for (const msg of messages) {
                console.log('📩 Sending message:', msg.text);

                // TODO: Add actual message sending logic (Email, SMS, Notification)

                await Message.findByIdAndDelete(msg._id);
            }
        } catch (err) {
            console.error('Error in scheduler:', err.message);
        }
    });
};
