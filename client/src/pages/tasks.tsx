import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { TaskTable } from "@/components/tasks/task-table";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";

export default function Tasks() {
  const [showCreateTask, setShowCreateTask] = useState(false);

  return (
    <AppLayout
      title="Tasks"
      description="Manage all your tasks"
      action={{
        label: "Create Task",
        onClick: () => setShowCreateTask(true),
      }}
    >
      <div className="space-y-6">
        <TaskTable />
      </div>

      <CreateTaskModal
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
      />
    </AppLayout>
  );
}
