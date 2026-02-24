import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Image,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import logo from "@assets/showbox_logo.png";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Peleadores", href: "/admin/peleadores", icon: Users },
  { name: "Eventos", href: "/admin/eventos", icon: Calendar },
  { name: "Auspiciantes", href: "/admin/auspiciantes", icon: Award },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  return (
    <Sidebar className="border-r border-white/5">
      <SidebarHeader className="p-4 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3">
          <img src={logo} alt="Showbox" className="h-8 w-auto" />
          <span className="font-display text-lg text-white uppercase tracking-wider">
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/60 px-4 py-2">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-muted-foreground text-xs">{user?.role}</p>
          </div>
          <button
            onClick={() => logout()}
            className="text-muted-foreground hover:text-white transition-colors p-2"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
