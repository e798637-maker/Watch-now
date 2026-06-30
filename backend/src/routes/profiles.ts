import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Profile } from '../models/Profile';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all profiles for current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await Profile.find({ userId: req.userId });
    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get single profile
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;

    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { name, avatar },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Switch profile (update token)
router.post('/switch/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;

    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Generate new token with switched profile
    const token = jwt.sign(
      {
        userId,
        profileId: profile._id,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Switch profile error:', error);
    res.status(500).json({ error: 'Failed to switch profile' });
  }
});

export default router;
