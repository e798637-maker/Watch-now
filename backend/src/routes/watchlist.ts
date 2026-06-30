import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Watchlist } from '../models/Watchlist';
import { Work } from '../models/Work';

const router = express.Router();

// Get watchlist for current profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const watchlist = await Watchlist.find({ profileId: req.profileId })
      .populate('workId')
      .sort({ addedAt: -1 });

    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add to watchlist
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

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      profileId: req.profileId,
      workId,
    });

    if (existing) {
      return res.status(400).json({ error: 'Already in watchlist' });
    }

    const watchlistItem = new Watchlist({
      profileId: req.profileId,
      workId,
    });

    await watchlistItem.save();

    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove from watchlist
router.delete('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await Watchlist.findOneAndDelete({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!result) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// Check if work is in watchlist
router.get('/check/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    res.json({ inWatchlist: !!watchlistItem });
  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ error: 'Failed to check watchlist' });
  }
});

export default router;
