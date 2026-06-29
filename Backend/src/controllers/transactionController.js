const Transaction = require("../models/transaction");
const Account = require("../models/account");

// @desc    Get user's transactions
// @route   GET /api/transactions
// @access  Private
exports.getUserTransactions = async (req, res) => {
    try {
        const account = await Account.findOne({ user: req.user._id });

        if (!account) {
            return res.status(200).json({
                success: true,
                transactions: []
            });
        }

        const transactions = await Transaction.find({
            $or: [
                { sender: account._id },
                { receiver: account._id }
            ]
        })
        .populate({
            path: "sender",
            populate: { path: "user", select: "name email vpa" }
        })
        .populate({
            path: "receiver",
            populate: { path: "user", select: "name email vpa" }
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
