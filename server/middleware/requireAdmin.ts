import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  if (req.user!.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}
