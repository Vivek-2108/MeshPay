const User = require("../models/user");

const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");

const Account = require("../models/account");

// logic for register 

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Sanitize name for VPA generation (remove spaces and special chars)
        const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        let vpa = `${sanitizedName}@upimesh`;

        // Prevent duplicate VPAs
        const existingVpa = await User.findOne({ vpa });
        if (existingVpa) {
            const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
            vpa = `${sanitizedName}${uniqueSuffix}@upimesh`;
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            vpa
        });

        // Generate default active account with starting balance
        const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        await Account.create({
            user: user._id,
            accountNumber,
            balance: 10000,
            currency: "INR",
            status: "ACTIVE"
        });

        // Send response
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            vpa: user.vpa,
            token: generateToken(user._id)
        });

    } catch (error) {
        // Internal Server Error 
        res.status(500).json({
            message: error.message
        });
    }
};


// logic for login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (user && (await bcrypt.compare(password, user.password))) {   // user.password --> hashed password stored in user model
            res.status(200).json({
                message: "Login successful",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(401).json({           //401 : Unauthorized
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};