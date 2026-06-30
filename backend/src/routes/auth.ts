import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Please provide email, password, and username' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ email, password, username });
    await user.save();

    // Create 4 default profiles
    const profileNames = ['Profile 1', 'Profile 2', 'Profile 3', 'Profile 4'];
    for (const name of profileNames) {
      await Profile.create({
        userId: user._id,
        name,
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Fetch user profiles
    const profiles = await Profile.find({ userId: user._id });

    // Generate token for first profile
    const token = jwt.sign(
      {
        userId: user._id,
        profileId: profiles[0]._id,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      profiles: profiles.map((p) => ({
        id: p._id,
        name: p.name,
        avatar: p.avatar,
      })),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
