import express, { Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { favorites, works } from "../db/schema";
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(favorites).where(eq(favorites.profileId, req.profileId!));
    const workIds = rows.map((r) => r.workId);
    const workRows = workIds.length ? await db.select().from(works).where(eq(works.id, workIds[0])) : [];
    res.json(rows.map((r) => ({ ...r, workId: workRows.find((w) => w.id === r.workId) || r.workId })));
  } catch (e) { res.status(500).json({ error: "Failed to fetch favorites" }); }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workId } = req.body;
    if (!workId) return res.status(400).json({ error: "workId is required" });
    const existing = await db.select().from(favorites).where(and(eq(favorites.profileId, req.profileId!), eq(favorites.workId, Number(workId)))).limit(1);
    if (existing.length) return res.status(400).json({ error: "Already in favorites" });
    const [fav] = await db.insert(favorites).values({ profileId: req.profileId!, workId: Number(workId) }).returning();
    res.status(201).json(fav);
  } catch (e) { res.status(500).json({ error: "Failed to add favorite" }); }
});

router.delete("/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.delete(favorites).where(and(eq(favorites.profileId, req.profileId!), eq(favorites.workId, Number(req.params.workId)))).returning();
    if (!r) return res.status(404).json({ error: "Favorite not found" });
    res.json({ message: "Favorite removed" });
  } catch (e) { res.status(500).json({ error: "Failed to remove favorite" }); }
});

router.get("/check/:workId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [r] = await db.select().from(favorites).where(and(eq(favorites.profileId, req.profileId!), eq(favorites.workId, Number(req.params.workId)))).limit(1);
    res.json({ isFavorite: !!r });
  } catch (e) { res.status(500).json({ error: "Failed to check favorite" }); }
});

export default router;
