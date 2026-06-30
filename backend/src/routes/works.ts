import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Work } from '../models/Work';

const router = express.Router();

// Get all works
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { type, genre, search } = req.query;

    let query: any = {};

    if (type) query.type = type;
    if (genre) query.genre = genre;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const works = await Work.find(query).sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    console.error('Get works error:', error);
    res.status(500).json({ error: 'Failed to fetch works' });
  }
});

// Get single work
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json(work);
  } catch (error) {
    console.error('Get work error:', error);
    res.status(500).json({ error: 'Failed to fetch work' });
  }
});

// Create work (Admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      genre,
      year,
      director,
      cast,
      poster,
      thumbnail,
      videoUrl,
      duration,
      rating,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !type ||
      !year ||
      !director ||
      !poster ||
      !thumbnail ||
      !videoUrl ||
      !duration
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const work = new Work({
      title,
      description,
      type,
      genre: genre || [],
      year,
      director,
      cast: cast || [],
      poster,
      thumbnail,
      videoUrl,
      duration,
      rating: rating || 0,
    });

    await work.save();

    res.status(201).json(work);
  } catch (error) {
    console.error('Create work error:', error);
    res.status(500).json({ error: 'Failed to create work' });
  }
});

// Update work (Admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;

    const work = await Work.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json(work);
  } catch (error) {
    console.error('Update work error:', error);
    res.status(500).json({ error: 'Failed to update work' });
  }
});

// Delete work (Admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);

    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json({ message: 'Work deleted successfully' });
  } catch (error) {
    console.error('Delete work error:', error);
    res.status(500).json({ error: 'Failed to delete work' });
  }
});

export default router;
