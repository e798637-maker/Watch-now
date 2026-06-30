import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Favorite } from '../models/Favorite';
import { Work } from '../models/Work';

const router = express.Router();

// Get favorites for current profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ profileId: req.profileId })
      .populate('workId')
      .sort({ addedAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workId } = req.body;

    if (!workId) {
      return res.status(400).json({ error: 'workId is required' });
    }

    // Check if work exists
    const work = await Work.findById(workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    // Check if already in favorites
    const existing = await Favorite.findOne({
      profileId: req.profileId,
      workId,
    });

    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    const favorite = new Favorite({
      profileId: req.profileId,
      workId,
    });

    await favorite.save();

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove from favorites
router.delete('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await Favorite.findOneAndDelete({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!result) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Check if work is in favorites
router.get('/check/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const favorite = await Favorite.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

export default router;
