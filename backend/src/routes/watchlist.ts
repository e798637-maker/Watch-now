import express, { Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { watchlist, works } from "../db/schema";
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(watchlist).where(eq(watchlist.profileId, req.profileId!));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Failed to fetch watchlist" }); }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workId } = req.body;
    if (!workId) return res.status(400).json({ error: "workId is required" });
    const existing = await db.select().from(watchlist).where(and(eq(watchlist.profileId, req.profileId!), eq(watchlist.workId, Number(workId)))).limit(1);
    if (existing.length) return res.status(400).json({ error: "Already in watchlist" });
    const [item] = await db.insert(watchlist).values({ profileId: req.profileId!, workId: Number(workId) }).returning();
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: "Failed to add to watchlist" }); }
});

router.delete("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.delete(watchlist).where(and(eq(watchlist.profileId, req.profileId!), eq(watchlist.workId, Number(req.params.workId)))).returning();
    if (!r) return res.status(404).json({ error: "Watchlist item not found" });
    res.json({ message: "Removed from watchlist" });
  } catch (e) { res.status(500).json({ error: "Failed to remove from watchlist" }); }
});

router.get("/check/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.select().from(watchlist).where(and(eq(watchlist.profileId, req.profileId!), eq(watchlist.workId, Number(req.params.workId)))).limit(1);
    res.json({ inWatchlist: !!r });
  } catch (e) { res.status(500).json({ error: "Failed to check watchlist" }); }
});

export default router;
