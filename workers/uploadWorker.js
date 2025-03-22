const workerpool = require('workerpool');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const User = require('../models/User');
const UserAccount = require('../models/UserAccount');
const PolicyCategory = require('../models/PolicyCategory');
const PolicyCarrier = require('../models/PolicyCarrier');
const PolicyInfo = require('../models/PolicyInfo');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Worker: MongoDB Connected'))
    .catch(err => console.log('Worker: MongoDB Connection Error:', err));

async function processFile(filePath) {
    try {
        console.log("Worker received file:", filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            throw new Error('File is empty or incorrectly formatted.');
        }

        const bulkOperations = [];

        for (const row of data) {
            const agent = await Agent.findOneAndUpdate(
                { name: row.agent },
                { name: row.agent },
                { upsert: true, new: true }
            );

            const user = await User.findOneAndUpdate(
                { email: row.email },
                {
                    firstname: row.firstname,
                    dob: new Date(row.dob),
                    address: row.address,
                    phone: row.phone,
                    state: row.state,
                    zip: row.zip,
                    email: row.email,
                    gender: row.gender,
                    userType: row.userType
                },
                { upsert: true, new: true }
            );

            const userAccount = await UserAccount.findOneAndUpdate(
                { account_name: row.account_name },
                { account_name: row.account_name },
                { upsert: true, new: true }
            );

            const policyCategory = await PolicyCategory.findOneAndUpdate(
                { category_name: row.category_name },
                { category_name: row.category_name },
                { upsert: true, new: true }
            );

            const policyCarrier = await PolicyCarrier.findOneAndUpdate(
                { company_name: row.company_name },
                { company_name: row.company_name },
                { upsert: true, new: true }
            );

            bulkOperations.push({
                updateOne: {
                    filter: { policy_number: row.policy_number },
                    update: {
                        policy_number: row.policy_number,
                        policy_start_date: new Date(row.policy_start_date),
                        policy_end_date: new Date(row.policy_end_date),
                        policy_category: policyCategory._id,
                        company: policyCarrier._id,
                        user: user._id
                    },
                    upsert: true
                }
            });
        }

        await PolicyInfo.bulkWrite(bulkOperations);
        return `File processed successfully, inserted ${data.length} records.`;
    } catch (err) {
        throw new Error(`File processing failed: ${err.message}`);
    }
}

workerpool.worker({
    processFile
});
