import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profiles";
import workRoutes from "./routes/works";
import favoriteRoutes from "./routes/favorites";
import watchlistRoutes from "./routes/watchlist";
import progressRoutes from "./routes/progress";
import ratingRoutes from "./routes/ratings";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (/\.vercel\.app$/.test(new URL(origin).hostname)) return cb(null, true);
    const allowed = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);
    if (allowed.includes(origin)) return cb(null, true);
    cb(null, true); // allow all for now
  },
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/works", workRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));
app.get("/api/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

app.use((_req: Request, res: Response) => res.status(404).json({ error: "Route not found" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

export default app;
