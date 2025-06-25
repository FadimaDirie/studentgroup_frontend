import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { GroupWithStats } from "@shared/schema";

interface GroupCardProps {
  group: GroupWithStats;
  onClick: (groupId: number) => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const statusVariant = group.taskCount > 0 ? "default" : "secondary";
  const statusLabel = group.taskCount > 0 ? "Active" : "Planning";

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(group.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-card-foreground mb-1">{group.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
          </div>
          <div className="ml-2">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium">{group.memberCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasks</span>
            <span className="font-medium">{group.taskCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{formatRelativeTime(group.createdAt)}</span>
          </div>
        </div>

        {group.recentMembers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              {group.recentMembers.map((member) => (
                <div 
                  key={member.id}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium"
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
              ))}
              {group.memberCount > 3 && (
                <span className="text-xs text-muted-foreground ml-2">
                  +{group.memberCount - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
