import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetGroupsQuery, useDeleteGroupMutation, useUpdateGroupMutation, useGetTasksQuery, useGetAllUsersQuery } from "@/lib/apiSlice";
import { GroupCard } from "@/components/groups/group-card";
import { TaskTable } from "@/components/tasks/task-table";
import { CreateGroupModal } from "@/components/groups/create-group-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupWithStats } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, CheckSquare, Calendar, User, Group, CheckCircle, Settings, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updateGroup, { isLoading: updating }] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const isAdmin = user?.role === "admin";

  const { data: groups = [], isLoading: groupsLoading } = useGetGroupsQuery();
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery();
  const { data: users = [], isLoading: usersLoading } = useGetAllUsersQuery();

  // Stat cards dynamic
  const totalStudents = users.length;
  const activeGroups = groups.length;
  const tasksCompleted = tasks.filter((t: any) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t: any) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t: any) => t.status === "in_progress").length;
  const statCards = [
    { label: "Total Students", value: totalStudents, icon: Users, color: "from-blue-500 to-blue-400" },
    { label: "Active Groups", value: activeGroups, icon: BarChart3, color: "from-green-500 to-green-400" },
    { label: "Tasks Completed", value: tasksCompleted, icon: CheckSquare, color: "from-purple-500 to-purple-400" },
    { label: "Pending Tasks", value: pendingTasks, icon: Calendar, color: "from-yellow-400 to-yellow-200" },
    { label: "In Progress Tasks", value: inProgressTasks, icon: Calendar, color: "from-pink-500 to-pink-400" },
  ];

  // Recent Groups
  const recentGroups = groups.slice().sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  // Recent Tasks
  const recentTasks = tasks.slice().sort((a: any, b: any) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)).slice(0, 6);

  // Recent Activity (tasks created, groups created)
  const recentActivity = [
    ...tasks.map((t: any) => ({
      type: "task",
      text: `Task '${t.title}' created`,
      time: t.created_at || t.createdAt,
      icon: CheckSquare,
      badge: "Task"
    })),
    ...groups.map((g: any) => ({
      type: "group",
      text: `Group '${g.name}' created`,
      time: g.createdAt,
      icon: Group,
      badge: "Group"
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

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
  const statGradients = [
    "from-blue-500 to-blue-400",
    "from-green-500 to-green-400",
    "from-purple-500 to-purple-400",
    "from-pink-500 to-pink-400",
  ];

  const handleGroupClick = (groupId: string) => {
    setLocation(`/groups/${groupId}`);
  };

  const handleEditGroup = (group: any) => {
    setEditGroup(group);
    setEditName(group.name);
    setEditDescription(group.description);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGroup) return;
    await updateGroup({ id: editGroup.id, data: { name: editName, description: editDescription } });
    setEditModalOpen(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      await deleteGroup(groupId);
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, idx) => (
            <Card
              key={stat.label}
              className={`relative overflow-hidden shadow-xl group transition-transform hover:scale-[1.03] border-0 bg-gradient-to-br ${statGradients[idx % statGradients.length]} text-white dark:text-white p-4`}
            >
              <div className="absolute right-0 top-0 opacity-20 text-[5rem] pointer-events-none">
                <stat.icon className="w-16 h-16" />
              </div>
              <CardHeader className="relative z-10 flex flex-col items-start justify-center min-h-[80px] p-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2">
                    <stat.icon className="w-6 h-6" />
                  </span>
                  <CardTitle className="text-2xl font-bold drop-shadow-lg">{stat.value}</CardTitle>
                </div>
                <CardDescription className="text-base font-medium text-white/80 drop-shadow-sm">{stat.label}</CardDescription>
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(item.time).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Groups</h3>
            <Button variant="link" onClick={() => setLocation("/groups")}>View All</Button>
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
              {recentGroups.map((group: any, idx: number) => {
                const name = group.name || "Unnamed Group";
                const description = group.description || "No description";
                let members = 0;
                if ((group as any).members !== undefined) {
                  members = typeof group.members === 'number' ? group.members : (Array.isArray(group.members) ? group.members.length : 0);
                } else if ((group as any).memberCount !== undefined) {
                  members = (group as any).memberCount;
                }
                const createdAt = (typeof group.createdAt === "string" ? group.createdAt : (group.createdAt ? group.createdAt.toLocaleDateString() : ""));
                return (
                  <div
                    key={group._id || group.id || idx}
                    className={`relative rounded-2xl shadow-xl overflow-hidden cursor-pointer group transition-transform hover:scale-105 bg-gradient-to-br ${groupColors[idx % groupColors.length]} p-0`}
                    onClick={() => handleGroupClick(group._id || group.id || idx)}
                    style={{ minHeight: 180 }}
                  >
                    {/* Edit/Delete buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 z-20" onClick={e => e.stopPropagation()}>
                      {isAdmin && (
                        <>
                          <span className="p-1 rounded hover:bg-muted transition cursor-pointer" title="Edit" onClick={() => handleEditGroup(group)}>
                            <Edit className="w-5 h-5 text-primary" />
                          </span>
                          <span className="p-1 rounded hover:bg-destructive/10 transition cursor-pointer" title="Delete" onClick={() => handleDeleteGroup(group._id || group.id || idx)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </span>
                        </>
                      )}
                    </div>
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
            <Button variant="link" onClick={() => setLocation("/tasks")}>View All</Button>
          </div>

          {tasksLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentTasks.map((task: any, idx: number) => (
                <div
                  key={task._id || task.id || idx}
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
                        <p className="text-white/80 text-xs drop-shadow">Group: {task.group_id || task.group || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Badge className={`shadow-md ${task.priority === "High" ? "bg-red-500/80" : task.priority === "Medium" ? "bg-yellow-400/80" : "bg-white/30 text-white"}`}>{task.priority || "-"}</Badge>
                      <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">{task.status}</span>
                      <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}</span>
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

      {/* Edit Group Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Group Name</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} disabled={updating}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
