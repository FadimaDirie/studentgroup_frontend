import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, groupApi, groupMemberApi } from "@/lib/api";
import type {
  Task,
  Group,
  GroupMember,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "@/lib/api";

// Task Hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      taskApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Group Hooks
export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: groupApi.getAll,
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => groupApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: groupApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupRequest }) =>
      groupApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", id] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: groupApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

// Group Member Hooks
export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => groupMemberApi.getByGroupId(groupId),
    enabled: !!groupId,
  });
};

export const useAllGroupMembers = () => {
  return useQuery({
    queryKey: ["groupMembers"],
    queryFn: groupMemberApi.getAll,
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: groupMemberApi.join,
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
  });
};

export const useAddGroupMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupMemberApi.add(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
  });
};

export const useUpdateGroupMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GroupMember> }) =>
      groupMemberApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
  });
};

export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: groupMemberApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
  });
}; 