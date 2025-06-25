import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getInitials, getStatusColor, getPriorityColor } from "@/lib/utils";
import { TaskWithDetails } from "@shared/schema";

export function TaskTable() {
  const { data: tasks, isLoading } = useQuery<TaskWithDetails[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Task</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-card-foreground">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-card-foreground">{task.group.name}</span>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {getInitials(task.assignee.name)}
                        </div>
                        <span className="text-sm text-card-foreground">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <span className="text-sm text-card-foreground">
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No due date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
