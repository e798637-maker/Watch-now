import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { UserProgress } from '../models/UserProgress';
import { Work } from '../models/Work';

const router = express.Router();

// Get progress for all works
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await UserProgress.find({ profileId: req.profileId })
      .populate('workId')
      .sort({ lastWatchedAt: -1 });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get progress for specific work
router.get('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await UserProgress.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get work progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update progress (save watch time)
router.post('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentTime, duration, isCompleted } = req.body;

    if (currentTime === undefined || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if work exists
    const work = await Work.findById(req.params.workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    // Find or create progress entry
    let progress = await UserProgress.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!progress) {
      progress = new UserProgress({
        profileId: req.profileId,
        workId: req.params.workId,
        duration,
      });
    }

    progress.currentTime = currentTime;
    progress.duration = duration;
    progress.isCompleted = isCompleted || false;
    progress.lastWatchedAt = new Date();

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get continue watching (not completed, sorted by last watched)
router.get('/continue/watching', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const continueWatching = await UserProgress.find({
      profileId: req.profileId,
      isCompleted: false,
      currentTime: { $gt: 0 },
    })
      .populate('workId')
      .sort({ lastWatchedAt: -1 })
      .limit(10);

    res.json(continueWatching);
  } catch (error) {
    console.error('Get continue watching error:', error);
    res.status(500).json({ error: 'Failed to fetch continue watching' });
  }
});

export default router;
