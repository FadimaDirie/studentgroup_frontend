import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { StatsCards } from "@/components/stats/stats-cards";
import { GroupCard } from "@/components/groups/group-card";
import { TaskTable } from "@/components/tasks/task-table";
import { CreateGroupModal } from "@/components/groups/create-group-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupWithStats } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, CheckSquare, Calendar, User, Group, CheckCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Students", value: 120, icon: Users, color: "from-blue-500 to-blue-400" },
  { label: "Active Groups", value: 8, icon: BarChart3, color: "from-green-500 to-green-400" },
  { label: "Tasks Completed", value: 234, icon: CheckSquare, color: "from-purple-500 to-purple-400" },
  { label: "Upcoming Events", value: 3, icon: Calendar, color: "from-pink-500 to-pink-400" },
];

const recentActivity = [
  { type: "group", text: "New group 'Math Wizards' created", time: "2 hours ago", icon: Group, badge: "New" },
  { type: "task", text: "Task 'Read Chapter 5' marked as complete", time: "4 hours ago", icon: CheckCircle, badge: "Task" },
  { type: "user", text: "Student 'Amina Ali' joined 'Science Club'", time: "Yesterday", icon: User, badge: "Join" },
  { type: "group", text: "Group 'History Buffs' updated settings", time: "2 days ago", icon: Settings, badge: "Update" },
];

const mockGroups = [
  { id: 1, name: "Math Wizards", description: "Advanced math study group", members: 12, createdAt: "2 days ago" },
  { id: 2, name: "Science Club", description: "Explore science topics", members: 8, createdAt: "5 days ago" },
  { id: 3, name: "History Buffs", description: "History discussions", members: 10, createdAt: "1 week ago" },
];
const mockTasks = [
  { id: 1, title: "Read Chapter 5", group: "Math Wizards", priority: "High", status: "Completed", due: "Yesterday" },
  { id: 2, title: "Lab Report", group: "Science Club", priority: "Medium", status: "In Progress", due: "Tomorrow" },
  { id: 3, title: "Essay Draft", group: "History Buffs", priority: "Low", status: "Pending", due: "Next Week" },
];

const groupColors = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-blue-500 via-cyan-500 to-green-400",
  "from-yellow-400 via-orange-500 to-red-500",
];
const taskColors = [
  "from-green-400 to-blue-500",
  "from-pink-500 to-yellow-500",
  "from-purple-500 to-indigo-500",
];

// Stat card gradients
const statGradients = [
  "from-blue-500 to-blue-400",
  "from-green-500 to-green-400",
  "from-purple-500 to-purple-400",
  "from-pink-500 to-pink-400",
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { data: groups, isLoading: groupsLoading } = useQuery<GroupWithStats[]>({
    queryKey: ["/api/groups"],
  });

  const handleGroupClick = (groupId: number) => {
    setLocation(`/groups/${groupId}`);
  };

  const recentGroups = (groups && groups.length > 0 ? groups.slice(0, 6) : mockGroups);

  return (
    <AppLayout
      title="Dashboard"
      description="Manage your study groups and tasks"
      action={{
        label: "Create Group",
        onClick: () => setShowCreateGroup(true),
      }}
    >
      <div className="space-y-6 bg-background text-foreground transition-colors duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className={`relative overflow-hidden shadow-xl group transition-transform hover:scale-[1.03] border-0 bg-gradient-to-br ${statGradients[idx % statGradients.length]} text-white dark:text-white`}
            >
              <div className="absolute right-0 top-0 opacity-20 text-[7rem] pointer-events-none">
                <stat.icon className="w-24 h-24" />
              </div>
              <CardHeader className="relative z-10 flex flex-col items-start justify-center min-h-[120px]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-3">
                    <stat.icon className="w-8 h-8" />
                  </span>
                  <CardTitle className="text-3xl font-bold drop-shadow-lg">{stat.value}</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium text-white/80 drop-shadow-sm">{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg border-0 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-500">
              <ul className="divide-y divide-border">
                {recentActivity.map((item, i) => (
                  <li key={i} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-muted p-2">
                        <item.icon className="w-6 h-6 text-primary" />
                      </span>
                      <span className="text-base font-medium">{item.text}</span>
                      <Badge className="bg-accent text-accent-foreground border-0 shadow-md">{item.badge}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Groups</h3>
            <Button variant="link" onClick={() => setLocation("/groups")}>
              View All
            </Button>
          </div>

          {groupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentGroups.map((group, idx) => {
                const name = group.name || "Unnamed Group";
                const description = group.description || "No description";
                let members = 0;
                if ((group as any).members !== undefined) {
                  members = (group as any).members;
                } else if ((group as any).memberCount !== undefined) {
                  members = (group as any).memberCount;
                }
                const createdAt = (typeof group.createdAt === "string" ? group.createdAt : (group.createdAt ? group.createdAt.toLocaleDateString() : ""));
                return (
                  <div
                  key={group.id}
                    className={`relative rounded-2xl shadow-xl overflow-hidden cursor-pointer group transition-transform hover:scale-105 bg-gradient-to-br ${groupColors[idx % groupColors.length]} p-0`}
                    onClick={() => handleGroupClick(group.id)}
                    style={{ minHeight: 180 }}
                  >
                    <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-md z-0" />
                    <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 p-4 shadow-lg">
                          <Group className="w-8 h-8 text-primary drop-shadow" />
                        </span>
                        <div>
                          <h4 className="text-xl font-bold text-white drop-shadow-lg">{name}</h4>
                          <p className="text-white/80 text-sm drop-shadow">{description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">{members} members</span>
                        <Badge className="bg-accent text-accent-foreground border-0 shadow-md">{createdAt}</Badge>
                      </div>
                    </div>
                    <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <Group className="w-16 h-16 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No groups yet</p>
              <Button onClick={() => setShowCreateGroup(true)}>
                Create Your First Group
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Tasks</h3>
            <Button variant="link" onClick={() => setLocation("/tasks")}>
              View All
            </Button>
          </div>

          {(mockTasks.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockTasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={`relative rounded-2xl shadow-xl overflow-hidden group transition-transform hover:scale-105 bg-gradient-to-br ${taskColors[idx % taskColors.length]} p-0`}
                  style={{ minHeight: 160 }}
                >
                  <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-md z-0" />
                  <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 p-4 shadow-lg">
                        <CheckSquare className="w-8 h-8 text-primary drop-shadow" />
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white drop-shadow-lg">{task.title}</h4>
                        <p className="text-white/80 text-xs drop-shadow">Group: {task.group}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Badge className={`shadow-md ${task.priority === "High" ? "bg-red-500/80" : task.priority === "Medium" ? "bg-yellow-400/80" : "bg-white/30 text-white"}`}>{task.priority}</Badge>
                      <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">{task.status}</span>
                      <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">Due: {task.due}</span>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <CheckSquare className="w-14 h-14 text-white" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks found</p>
            </div>
          )}
        </div>
      </div>

      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />
    </AppLayout>
  );
}
