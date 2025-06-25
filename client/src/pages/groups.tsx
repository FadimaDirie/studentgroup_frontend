import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { GroupCard } from "@/components/groups/group-card";
import { CreateGroupModal } from "@/components/groups/create-group-modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { GroupWithStats } from "@shared/schema";

export default function Groups() {
  const [, setLocation] = useLocation();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: groups, isLoading } = useQuery<GroupWithStats[]>({
    queryKey: ["/api/groups"],
  });

  const handleGroupClick = (groupId: number) => {
    setLocation(`/groups/${groupId}`);
  };

  const filteredGroups = groups?.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AppLayout
      title="Groups"
      description="Manage your study groups"
      action={{
        label: "Create Group",
        onClick: () => setShowCreateGroup(true),
      }}
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search groups..."
            className="pl-10 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={handleGroupClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No groups match your search" : "No groups found"}
            </p>
          </div>
        )}
      </div>

      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />
    </AppLayout>
  );
}
