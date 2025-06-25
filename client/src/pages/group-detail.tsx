import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { Plus, UserPlus, Users, CheckSquare } from "lucide-react";
import { formatRelativeTime, formatDate, getInitials, getStatusColor, getPriorityColor } from "@/lib/utils";
import { Group, Member, Task, insertMemberSchema, type InsertMember } from "@shared/schema";

export default function GroupDetail() {
  const [, params] = useRoute("/groups/:id");
  const groupId = params?.id ? parseInt(params.id) : 0;
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: group, isLoading: groupLoading } = useQuery<Group>({
    queryKey: ["/api/groups", groupId],
    enabled: !!groupId,
  });

  const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/groups", groupId, "members"],
    enabled: !!groupId,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/groups", groupId, "tasks"],
    enabled: !!groupId,
  });

  const form = useForm<InsertMember>({
    resolver: zodResolver(insertMemberSchema),
    defaultValues: {
      groupId,
      name: "",
      email: "",
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (data: InsertMember) => {
      const response = await apiRequest("POST", "/api/members", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups", groupId, "members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      toast({
        title: "Success",
        description: "Member added successfully!",
      });
      form.reset({ groupId, name: "", email: "" });
      setShowAddMember(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMember) => {
    addMemberMutation.mutate(data);
  };

  if (groupLoading) {
    return (
      <AppLayout title="Loading..." description="Loading group details">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return (
      <AppLayout title="Not Found" description="Group not found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Group not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={group.name}
      description={group.description}
      action={{
        label: "Create Task",
        onClick: () => setShowCreateTask(true),
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-xl font-semibold">{members?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="text-xl font-semibold">{tasks?.length || 0}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-xl font-semibold">{formatRelativeTime(group.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">Members</CardTitle>
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter member name..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email address..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addMemberMutation.isPending}>
                          {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : members && members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No members yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
              <Button size="sm" onClick={() => setShowCreateTask(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </Button>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border-b border-border pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-card-foreground">{task.title}</h4>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTaskModal
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        initialGroupId={groupId}
      />
    </AppLayout>
  );
}
