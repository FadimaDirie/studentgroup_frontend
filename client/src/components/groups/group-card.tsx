import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { GroupWithStats } from "@shared/schema";

interface GroupCardProps {
  group: GroupWithStats;
  onClick: (groupId: number) => void;
  onEdit?: (group: GroupWithStats) => void;
  onDelete?: (group: GroupWithStats) => void;
}

export function GroupCard({ group, onClick, onEdit, onDelete }: GroupCardProps) {
  const statusVariant = group.taskCount > 0 ? "default" : "secondary";
  const statusLabel = group.taskCount > 0 ? "Active" : "Planning";

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const isAdmin = user?.role === "admin";

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={() => onClick(group.id)}
    >
      {/* Edit/Delete buttons (admin only) */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2 z-20" onClick={e => e.stopPropagation()}>
          {onEdit && (
            <button
              className="p-1 rounded hover:bg-muted transition"
              title="Edit"
              onClick={() => onEdit(group)}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16.862 4.487a2.1 2.1 0 113.02 2.92L7.5 19.793 3 21l1.207-4.5 12.655-12.013z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className="p-1 rounded hover:bg-destructive/10 transition"
              title="Delete"
              onClick={() => onDelete(group)}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
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
