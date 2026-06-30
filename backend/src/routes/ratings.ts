import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Rating } from '../models/Rating';
import { Work } from '../models/Work';

const router = express.Router();

// Get all ratings for current profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const ratings = await Rating.find({ profileId: req.profileId })
      .populate('workId')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get rating for specific work
router.get('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rating = await Rating.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    res.json(rating || null);
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

// Create or update rating
router.post('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if work exists
    const work = await Work.findById(req.params.workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    // Find or create rating
    let ratingDoc = await Rating.findOne({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!ratingDoc) {
      ratingDoc = new Rating({
        profileId: req.profileId,
        workId: req.params.workId,
        rating,
        review: review || '',
      });
    } else {
      ratingDoc.rating = rating;
      ratingDoc.review = review || '';
    }

    await ratingDoc.save();

    res.json(ratingDoc);
  } catch (error) {
    console.error('Create/update rating error:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// Delete rating
router.delete('/:workId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await Rating.findOneAndDelete({
      profileId: req.profileId,
      workId: req.params.workId,
    });

    if (!result) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

export default router;
