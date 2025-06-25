import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckSquare, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      label: "Total Groups",
      value: stats?.totalGroups || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Tasks",
      value: stats?.activeTasks || 0,
      icon: CheckSquare,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Completed Today",
      value: stats?.completedToday || 0,
      icon: Clock,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Due This Week",
      value: stats?.dueThisWeek || 0,
      icon: Calendar,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
