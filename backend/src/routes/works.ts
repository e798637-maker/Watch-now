import express, { Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { works } from "../db/schema";
import { eq, ilike, sql } from "drizzle-orm";

const router = express.Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { type, genre, search } = req.query as Record<string, string>;
    let rows = await db.select().from(works).orderBy(sql`${works.createdAt} desc`);
    if (type) rows = rows.filter((w) => w.type === type);
    if (genre) rows = rows.filter((w) => w.genre?.includes(genre));
    if (search) rows = rows.filter((w) => w.title.toLowerCase().includes(search.toLowerCase()));
    res.json(rows.map(serialize));
  } catch (e) { res.status(500).json({ error: "Failed to fetch works" }); }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const [work] = await db.select().from(works).where(eq(works.id, Number(req.params.id)));
    if (!work) return res.status(404).json({ error: "Work not found" });
    res.json(serialize(work));
  } catch (e) { res.status(500).json({ error: "Failed to fetch work" }); }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type, genre, year, director, cast, poster, thumbnail, videoUrl, duration, rating } = req.body;
    if (!title || !description || !type || !year || !director || !poster || !thumbnail || !videoUrl || !duration)
      return res.status(400).json({ error: "Missing required fields" });
    const [work] = await db.insert(works).values({
      title, description, type, genre: genre || [], year: Number(year),
      director, cast: cast || [], poster, thumbnail, videoUrl,
      duration: Number(duration), rating: rating || 0,
    }).returning();
    res.status(201).json(serialize(work));
  } catch (e) { res.status(500).json({ error: "Failed to create work" }); }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [work] = await db.update(works).set({ ...req.body, updatedAt: new Date() })
      .where(eq(works.id, Number(req.params.id))).returning();
    if (!work) return res.status(404).json({ error: "Work not found" });
    res.json(serialize(work));
  } catch (e) { res.status(500).json({ error: "Failed to update work" }); }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [work] = await db.delete(works).where(eq(works.id, Number(req.params.id))).returning();
    if (!work) return res.status(404).json({ error: "Work not found" });
    res.json({ message: "Work deleted successfully" });
  } catch (e) { res.status(500).json({ error: "Failed to delete work" }); }
});

function serialize(w: any) {
  return { ...w, _id: w.id, subtitles: JSON.parse(w.subtitles || "[]") };
}

export default router;
