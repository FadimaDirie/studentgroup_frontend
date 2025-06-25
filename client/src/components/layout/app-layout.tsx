import { Sidebar } from "./sidebar";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AppLayout({ children, title, description, action }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search groups or tasks..."
                  className="pl-10 w-80"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {action && (
                <Button onClick={action.onClick} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{action.label}</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
