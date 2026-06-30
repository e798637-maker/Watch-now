import express, { Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { userProgress, works } from "../db/schema";
import { eq, and, gt, sql } from "drizzle-orm";

const router = express.Router();

router.get("/continue/watching", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(userProgress)
      .where(and(eq(userProgress.profileId, req.profileId!), eq(userProgress.isCompleted, false), gt(userProgress.currentTime, 0)))
      .orderBy(sql`${userProgress.lastWatchedAt} desc`).limit(10);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Failed to fetch continue watching" }); }
});

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(userProgress).where(eq(userProgress.profileId, req.profileId!));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Failed to fetch progress" }); }
});

router.get("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.select().from(userProgress).where(and(eq(userProgress.profileId, req.profileId!), eq(userProgress.workId, Number(req.params.workId)))).limit(1);
    if (!r) return res.status(404).json({ error: "Progress not found" });
    res.json(r);
  } catch (e) { res.status(500).json({ error: "Failed to fetch progress" }); }
});

router.post("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentTime, duration, isCompleted } = req.body;
    if (currentTime === undefined || !duration) return res.status(400).json({ error: "Missing required fields" });
    const existing = await db.select().from(userProgress).where(and(eq(userProgress.profileId, req.profileId!), eq(userProgress.workId, Number(req.params.workId)))).limit(1);
    let r;
    if (existing.length) {
      [r] = await db.update(userProgress).set({ currentTime, duration, isCompleted: isCompleted || false, lastWatchedAt: new Date() }).where(eq(userProgress.id, existing[0].id)).returning();
    } else {
      [r] = await db.insert(userProgress).values({ profileId: req.profileId!, workId: Number(req.params.workId), currentTime, duration, isCompleted: isCompleted || false }).returning();
    }
    res.json(r);
  } catch (e) { res.status(500).json({ error: "Failed to update progress" }); }
});

export default router;
