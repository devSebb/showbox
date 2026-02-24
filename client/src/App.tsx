import { Component, type ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EventsIndex from "@/pages/events/EventsIndex";
import EventDetail from "@/pages/events/EventDetail";
import FightersDirectory from "@/pages/fighters/FightersDirectory";
import FighterProfile from "@/pages/fighters/FighterProfile";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import FightersList from "@/pages/admin/FightersList";
import FighterForm from "@/pages/admin/FighterForm";
import EventsList from "@/pages/admin/EventsList";
import EventForm from "@/pages/admin/EventForm";
import CardBuilder from "@/pages/admin/CardBuilder";
import SponsorsList from "@/pages/admin/SponsorsList";
import SponsorForm from "@/pages/admin/SponsorForm";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Settings from "@/pages/admin/Settings";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Algo salió mal</h1>
            <p className="text-muted-foreground">Por favor recarga la página.</p>
            <button
              className="underline"
              onClick={() => this.setState({ hasError: false })}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Component />
      </AdminLayout>
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/eventos" component={EventsIndex} />
      <Route path="/eventos/:slug" component={EventDetail} />
      <Route path="/peleadores" component={FightersDirectory} />
      <Route path="/peleadores/:id" component={FighterProfile} />

      {/* Admin Login */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin Pages */}
      <Route path="/admin">{() => <AdminPage component={Dashboard} />}</Route>
      <Route path="/admin/peleadores">{() => <AdminPage component={FightersList} />}</Route>
      <Route path="/admin/peleadores/nuevo">{() => <AdminPage component={FighterForm} />}</Route>
      <Route path="/admin/peleadores/:id">{() => <AdminPage component={FighterForm} />}</Route>
      <Route path="/admin/eventos">{() => <AdminPage component={EventsList} />}</Route>
      <Route path="/admin/eventos/nuevo">{() => <AdminPage component={EventForm} />}</Route>
      <Route path="/admin/eventos/:id">{() => <AdminPage component={EventForm} />}</Route>
      <Route path="/admin/eventos/:id/cartelera">{() => <AdminPage component={CardBuilder} />}</Route>
      <Route path="/admin/auspiciantes">{() => <AdminPage component={SponsorsList} />}</Route>
      <Route path="/admin/auspiciantes/nuevo">{() => <AdminPage component={SponsorForm} />}</Route>
      <Route path="/admin/auspiciantes/:id">{() => <AdminPage component={SponsorForm} />}</Route>
      <Route path="/admin/media">{() => <AdminPage component={MediaLibrary} />}</Route>
      <Route path="/admin/configuracion">{() => <AdminPage component={Settings} />}</Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
