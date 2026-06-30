import express, { Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { ratings, works } from "../db/schema";
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(ratings).where(eq(ratings.profileId, req.profileId!));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Failed to fetch ratings" }); }
});

router.get("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.select().from(ratings).where(and(eq(ratings.profileId, req.profileId!), eq(ratings.workId, Number(req.params.workId)))).limit(1);
    res.json(r || null);
  } catch (e) { res.status(500).json({ error: "Failed to fetch rating" }); }
});

router.post("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });
    const existing = await db.select().from(ratings).where(and(eq(ratings.profileId, req.profileId!), eq(ratings.workId, Number(req.params.workId)))).limit(1);
    let r;
    if (existing.length) {
      [r] = await db.update(ratings).set({ rating, review: review || "", updatedAt: new Date() }).where(eq(ratings.id, existing[0].id)).returning();
    } else {
      [r] = await db.insert(ratings).values({ profileId: req.profileId!, workId: Number(req.params.workId), rating, review: review || "" }).returning();
    }
    res.json(r);
  } catch (e) { res.status(500).json({ error: "Failed to save rating" }); }
});

router.delete("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.delete(ratings).where(and(eq(ratings.profileId, req.profileId!), eq(ratings.workId, Number(req.params.workId)))).returning();
    if (!r) return res.status(404).json({ error: "Rating not found" });
    res.json({ message: "Rating deleted" });
  } catch (e) { res.status(500).json({ error: "Failed to delete rating" }); }
});

export default router;
