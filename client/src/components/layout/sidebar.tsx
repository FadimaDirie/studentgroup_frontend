import { Link, useLocation } from "wouter";
import { Users, Home, Calendar, BarChart3, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-border fixed h-full z-30">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Users className="text-white text-sm w-4 h-4" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">StudyGroups</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Users className="text-muted-foreground w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">john@university.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
