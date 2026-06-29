const Account = require("../models/account");
const User = require("../models/user");

// @desc    Get current user's account details
// @route   GET /api/accounts
// @access  Private
exports.getAccountDetails = async (req, res) => {
    try {
        let account = await Account.findOne({ user: req.user._id });

        // Fallback: If no account exists for some reason, create one
        if (!account) {
            const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            account = await Account.create({
                user: req.user._id,
                accountNumber,
                balance: 10000,
                currency: "INR",
                status: "ACTIVE"
            });
        }

        res.status(200).json({
            success: true,
            accountNumber: account.accountNumber,
            balance: account.balance,
            currency: account.currency,
            status: account.status,
            user: {
                name: req.user.name,
                email: req.user.email,
                vpa: req.user.vpa
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
