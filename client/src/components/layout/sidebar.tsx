import { Link, useLocation } from "wouter";
import { Users, Home, Calendar, BarChart3, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch as ThemeSwitch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  // Get user from localStorage
  let user: { full_name?: string; email?: string } | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const userName = user?.full_name || "John Doe";
  const userEmail = user?.email || "john@university.edu";

  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  }

  return (
    <aside className="w-64 bg-white dark:bg-gradient-to-br dark:from-[#211C3A] dark:via-[#23214A] dark:to-[#2B2250] border-r border-border fixed h-full z-30 transition-colors duration-500">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-colors duration-500">
            <Users className="text-white text-sm w-4 h-4" />
          </div>
          <h1 className="text-xl font-semibold text-foreground transition-colors duration-500">StudyGroups</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors duration-500",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground"
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

      <div className="absolute bottom-0 w-full p-6 border-t border-border bg-gradient-to-t from-background/80 to-transparent transition-colors duration-500">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center transition-colors duration-500">
            <Users className="text-white w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground transition-colors duration-500">{userName}</p>
            <p className="text-xs text-muted-foreground transition-colors duration-500">{userEmail}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground transition-colors duration-500">Dark Mode</span>
          <button
            className="flex items-center gap-1 focus:outline-none"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
          >
            <ThemeSwitch checked={dark} onCheckedChange={setDark} />
            {dark ? <Moon className="w-4 h-4 text-accent transition-colors duration-500 ml-2" /> : <Sun className="w-4 h-4 text-primary transition-colors duration-500 ml-2" />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-destructive to-accent text-white rounded-md py-2 font-semibold hover:opacity-90 transition duration-300 shadow-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
