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

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { data: groups, isLoading: groupsLoading } = useQuery<GroupWithStats[]>({
    queryKey: ["/api/groups"],
  });

  const handleGroupClick = (groupId: number) => {
    setLocation(`/groups/${groupId}`);
  };

  const recentGroups = groups?.slice(0, 6) || [];

  return (
    <AppLayout
      title="Dashboard"
      description="Manage your study groups and tasks"
      action={{
        label: "Create Group",
        onClick: () => setShowCreateGroup(true),
      }}
    >
      <div className="space-y-6">
        <StatsCards />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Groups</h3>
            <Button variant="link" onClick={() => setLocation("/groups")}>
              View All
            </Button>
          </div>

          {groupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={handleGroupClick}
                />
              ))}
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

          <TaskTable />
        </div>
      </div>

      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />
    </AppLayout>
  );
}
