const User = require("../models/user");

const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");

// logic for register 

exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        //hash(pass from req.body , salt round)
        const hashedPassword = await bcrypt.hash(password, 10);
        /*
            const sanitizedName = name.replace(/\s+/g, "").toLowerCase();
            // Option A: Append a small random number
            const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
            const vpa = `${sanitizedName}${uniqueSuffix}@upimesh`;

        */
        const user = await User.create({  //line 1
            name,
            email,
            password: hashedPassword,
            vpa: `${name.toLowerCase()}@upimesh`
        });
        //send a response back to the client:   :: 201 --> meaing created --> new resource created
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)   // why this --> Many applications automatically log in the user immediately after registration.
        });

        res.send({
            msg:"Registered sucessfully"
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