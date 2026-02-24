import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Verificando acceso..." />;
  }

  if (!user) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
