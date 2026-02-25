import { Router } from "express";
import passport from "passport";
import type { Request, Response } from "express";
import { log } from "../index";

const router = Router();

router.post("/login", (req: Request, res: Response, next) => {
  const username = req.body?.username ?? "(missing)";
  passport.authenticate(
    "local",
    (err: any, user: Express.User | false, info: { message: string }) => {
      if (err) {
        log(`Login error for ${username}: ${err.message}`, "auth");
        return next(err);
      }
      if (!user) {
        log(`Login failed for ${username}: ${info?.message ?? "invalid credentials"}`, "auth");
        return res.status(401).json({ message: info?.message || "Credenciales incorrectas" });
      }
      req.logIn(user, (err) => {
        if (err) {
          log(`Session save failed for ${username}: ${err.message}`, "auth");
          return next(err);
        }
        log(`Login success: ${username}`, "auth");
        return res.json({
          id: user.id,
          username: user.username,
          role: user.role,
        });
      });
    },
  )(req, res, next);
});

router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.json({ message: "Sesión cerrada" });
  });
});

router.get("/me", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    log("GET /me: not authenticated (no session cookie or session expired)", "auth");
    return res.status(401).json({ message: "No autenticado" });
  }
  res.json({
    id: req.user!.id,
    username: req.user!.username,
    role: req.user!.role,
  });
});

export default router;
