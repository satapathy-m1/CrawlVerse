import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(newUser._id);
        return res.status(201).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error("Error in register controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get user Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}