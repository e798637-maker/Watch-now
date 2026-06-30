import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, profiles } from "../db/schema";
import { eq, or } from "drizzle-orm";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ error: "Please provide email, password, and username" });

    const existing = await db.select().from(users).where(
      or(eq(users.email, email), eq(users.username, username))
    ).limit(1);
    if (existing.length)
      return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email, password: hash, username }).returning();

    for (let i = 1; i <= 4; i++) {
      await db.insert(profiles).values({ userId: user.id, name: `Profile ${i}` });
    }

    res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email, username: user.username } });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Please provide email and password" });

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const userProfiles = await db.select().from(profiles).where(eq(profiles.userId, user.id));

    const token = jwt.sign(
      { userId: user.id, profileId: userProfiles[0]?.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username },
      profiles: userProfiles.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })),
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
