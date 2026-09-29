// fullstack-capstone-project/giftlink-backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// 1. User Registration API
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = await collection.insertOne({
            firstName,
            lastName,
            email,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, email });
    } catch (e) {
        console.error('Error in registration:', e);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// 2. User Login API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const theUser = await collection.findOne({ email });
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const comparePassword = await bcryptjs.compare(password, theUser.password);
        if (!comparePassword) {
            return res.status(400).json({ error: 'Wrong credentials' });
        }

        const payload = {
            user: {
                id: theUser._id,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
    } catch (e) {
        console.error('Error in login:', e);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// 3. Update User Information API
router.put('/update', async (req, res) => {
    try {
        const { firstName, lastName, updatedEmail } = req.body;
        const email = req.headers.email;

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const updatedUser = await collection.updateOne(
            { email: email },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ message: 'User updated successfully' });
    } catch (e) {
        console.error('Error updating user:', e);
        res.status(500).json({ error: 'Server error updating user' });
    }
});

module.exports = router;
