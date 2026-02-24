import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@assets/showbox_logo.png";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ username, password });
      setLocation("/admin");
    } catch {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Showbox Promotions EC" className="h-12 mb-6 opacity-80" />
          <h1 className="font-display text-3xl text-white uppercase tracking-wider">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="bg-background border-white/10 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background border-white/10 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-white font-display text-lg uppercase tracking-widest py-5"
          >
            {isLoggingIn ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
