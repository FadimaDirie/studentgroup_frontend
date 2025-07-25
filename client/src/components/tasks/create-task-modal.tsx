import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useCreateTaskMutation, useGetGroupsQuery } from "@/lib/apiSlice";
import { useState } from "react";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  groupId: z.string().min(1, "Group is required"),
});

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGroupId?: string;
}

export function CreateTaskModal({ open, onOpenChange, initialGroupId }: CreateTaskModalProps) {
  const { toast } = useToast();
  const { data: groups } = useGetGroupsQuery();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [dueDate, setDueDate] = useState("");

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      groupId: initialGroupId || "",
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    // Map groupId to group_id for backend
    const payload = {
      ...data,
      group_id: data.groupId,
      due_date: dueDate ? new Date(dueDate) : undefined,
    };
    delete payload.groupId;
    try {
      await createTask(payload).unwrap();
      toast({ title: "Success", description: "Task created successfully!" });
      form.reset();
      setDueDate("");
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground shadow-2xl border-0 transition-colors duration-500">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input text-foreground border border-border">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups?.map((group: any) => (
                        <SelectItem key={group._id || group.id} value={group._id || group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title..." {...field} className="bg-input text-foreground border border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the task..." 
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                      className="bg-input text-foreground border border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Due date input */}
            <div>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="bg-input text-foreground border border-border"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
