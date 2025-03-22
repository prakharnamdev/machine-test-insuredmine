const PolicyInfo = require('../models/PolicyInfo');
const User = require('../models/User');

exports.searchPolicy = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).send({
                success: false,
                message: 'Username is required',
                data: null
            });
        }

        const pipeline = [
            {
                $match: {
                    $or: [{ email: username }, { firstname: username }]
                }
            },
            {
                $lookup: {
                    from: 'policyinfos',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'policies'
                }
            },
            {
                $lookup: {
                    from: 'policycategories',
                    localField: 'policies.policy_category',
                    foreignField: '_id',
                    as: 'policyCategories'
                }
            },
            {
                $lookup: {
                    from: 'policycarriers',
                    localField: 'policies.company',
                    foreignField: '_id',
                    as: 'companies'
                }
            },
            {
                $project: {
                    _id: 1,
                    firstname: 1,
                    email: 1,
                    policies: {
                        policy_number: 1,
                        policy_start_date: 1,
                        policy_end_date: 1,
                        policy_category: { $arrayElemAt: ['$policyCategories.category_name', 0] },
                        company: { $arrayElemAt: ['$companies.company_name', 0] }
                    }
                }
            }
        ];

        const result = await User.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
                data: null
            });
        }

        res.status(200).send({
            success: true,
            message: "User policy data retrieved successfully.",
            meta: {
                totalRecords: result.length
            },
            data: result[0]
        });

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

exports.getPolicySummary = async (req, res) => {
    try {
        const summary = await PolicyInfo.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $group: {
                    _id: "$userInfo._id",
                    user: { $first: "$userInfo.firstname" },
                    email: { $first: "$userInfo.email" },
                    totalPolicies: { $sum: 1 },
                    totalPremium: { $sum: "$premium_amount" }
                }
            }
        ]);

        if (summary.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No policy summary found',
                data: null
            });
        }

        res.status(200).send({
            success: true,
            message: "Policy summary retrieved successfully.",
            meta: {
                totalRecords: summary.length
            },
            data: summary
        });

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
