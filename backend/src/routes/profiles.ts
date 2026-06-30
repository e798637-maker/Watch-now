import express, { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(profiles).where(eq(profiles.userId, req.userId!));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Failed to fetch profiles" }); }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [p] = await db.select().from(profiles).where(eq(profiles.id, Number(req.params.id)));
    if (!p) return res.status(404).json({ error: "Profile not found" });
    res.json(p);
  } catch (e) { res.status(500).json({ error: "Failed to fetch profile" }); }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;
    const [p] = await db.update(profiles).set({ name, avatar }).where(eq(profiles.id, Number(req.params.id))).returning();
    if (!p) return res.status(404).json({ error: "Profile not found" });
    res.json(p);
  } catch (e) { res.status(500).json({ error: "Failed to update profile" }); }
});

router.post("/switch/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;
    const [p] = await db.select().from(profiles).where(eq(profiles.id, Number(req.params.id)));
    if (!p) return res.status(404).json({ error: "Profile not found" });
    if (p.userId !== Number(userId)) return res.status(403).json({ error: "Unauthorized" });
    const token = jwt.sign({ userId: p.userId, profileId: p.id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token });
  } catch (e) { res.status(500).json({ error: "Failed to switch profile" }); }
});

export default router;
