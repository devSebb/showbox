import { Router } from "express";
import passport from "passport";
import type { Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response, next) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User | false, info: { message: string }) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Credenciales incorrectas" });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
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
    return res.status(401).json({ message: "No autenticado" });
  }
  res.json({
    id: req.user!.id,
    username: req.user!.username,
    role: req.user!.role,
  });
});

export default router;
