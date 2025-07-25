import { useGetTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation, useGetGroupsQuery } from "@/lib/apiSlice";
import { formatDate, formatDueDateRelative } from "@/lib/utils";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getStatusColor(status: string) {
  if (status === "completed") return "bg-green-500 text-white";
  if (status === "in_progress") return "bg-yellow-400 text-gray-800";
  return "bg-gray-300 text-gray-800";
}

function getGradient(idx: number) {
  const gradients = [
    "from-green-300 via-blue-300 to-purple-300",
    "from-pink-300 via-yellow-200 to-yellow-400",
    "from-purple-300 via-indigo-200 to-blue-300",
  ];
  return gradients[idx % gradients.length];
}

function TaskCard({ task, idx, groupName }: { task: any; idx: number; groupName: string }) {
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [status, setStatus] = useState(task.status);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const isAdmin = user?.role === "admin";

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateTask({ id: task._id || task.id, data: { status: newStatus } });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask({ id: task._id || task.id, data: { title: editTitle, description: editDescription, status } });
    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id || task.id);
    }
  };

  return (
    <div className={`relative rounded-2xl shadow-xl p-6 bg-gradient-to-br ${getGradient(idx)} min-w-[300px] max-w-xs w-full mx-auto mb-4`}>
      {/* Edit/Delete buttons */}
      <div className="absolute top-3 right-3 flex gap-2 z-20">
        {isAdmin && (
          <>
            <button onClick={() => setEditModalOpen(true)} title="Edit" className="p-1 rounded hover:bg-muted transition">
              <Edit className="w-5 h-5 text-primary" />
            </button>
            <button onClick={handleDelete} title="Delete" className="p-1 rounded hover:bg-destructive/10 transition">
              <Trash2 className="w-5 h-5 text-destructive" />
            </button>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-full bg-white/60 p-3">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-violet-500">
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg text-white drop-shadow">{task.title}</div>
          <div className="text-white/80 text-sm drop-shadow">Group: {groupName}</div>
        </div>
      </div>
      <div className="text-white/90 mb-3">{task.description}</div>
      <div className="flex flex-wrap gap-2 mt-2 items-center">
        {/* Status dropdown */}
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`rounded px-2 py-1 text-xs font-semibold shadow ${getStatusColor(status)}`}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {/* Due date (relative) */}
        {task.due_date && (
          <span className="bg-white/40 text-gray-800 rounded px-2 py-1 text-xs font-semibold">
            Due: {formatDueDateRelative(task.due_date)}
          </span>
        )}
        {/* Created at (standard) */}
        <span className="bg-white/20 text-white rounded px-2 py-1 text-xs font-semibold">
          Created: {formatDate(task.created_at)}
        </span>
      </div>
      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the title and description of your task. You can also change the status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
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
    </div>
  );
}

export function TaskTable() {
  const { data: tasks, isLoading } = useGetTasksQuery();
  const { data: groups } = useGetGroupsQuery();

  // Map group_id to group name
  const groupMap = (groups || []).reduce((acc: Record<string, string>, g: any) => {
    acc[g._id || g.id] = g.name;
    return acc;
  }, {});

  if (isLoading) {
    return <div className="flex gap-6">Loading tasks...</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No tasks found</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {tasks.map((task: any, idx: number) => (
        <TaskCard
          key={task._id || task.id}
          task={task}
          idx={idx}
          groupName={groupMap[task.group_id] || "Unknown"}
        />
      ))}
    </div>
  );
}
 