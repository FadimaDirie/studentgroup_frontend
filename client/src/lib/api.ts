// import { apiRequest } from "./queryClient";

// const BASE_URL = "https://mernstack-backend-vtfj.onrender.com";

// // Types
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "pending" | "in-progress" | "completed";
//   assignedTo?: string;
//   groupId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Group {
//   id: string;
//   name: string;
//   description: string;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface GroupMember {
//   id: string;
//   groupId: string;
//   userId: string;
//   role: "admin" | "member";
//   joinedAt: string;
// }

// export interface CreateTaskRequest {
//   title: string;
//   description: string;
//   groupId: string;
//   assignedTo?: string;
// }

// export interface UpdateTaskRequest {
//   title?: string;
//   description?: string;
//   status?: "pending" | "in-progress" | "completed";
//   assignedTo?: string;
// }

// export interface CreateGroupRequest {
//   name: string;
//   description: string;
// }

// export interface UpdateGroupRequest {
//   name?: string;
//   description?: string;
// }

// // Task API
// export const taskApi = {
//   // Create task
//   create: async (data: CreateTaskRequest): Promise<Task> => {
//     const response = await apiRequest("POST", `${BASE_URL}/api/tasks/`, data);
//     return response.json();
//   },

//   // Get all tasks
//   getAll: async (): Promise<Task[]> => {
//     const response = await apiRequest("GET", `${BASE_URL}/api/tasks/`);
//     return response.json();
//   },

//   // Get task by ID
//   getById: async (id: string): Promise<Task> => {
//     const response = await apiRequest("GET", `${BASE_URL}/api/tasks/${id}`);
//     return response.json();
//   },

//   // Update task
//   update: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
//     const response = await apiRequest("PUT", `${BASE_URL}/api/tasks/${id}`, data);
//     return response.json();
//   },

//   // Delete task
//   delete: async (id: string): Promise<void> => {
//     await apiRequest("DELETE", `${BASE_URL}/api/tasks/${id}`);
//   },
// };

// // Group API
// export const groupApi = {
//   // Create group
//   create: async (data: CreateGroupRequest): Promise<Group> => {
//     const response = await apiRequest("POST", `${BASE_URL}/api/create`, data);
//     return response.json();
//   },

//   // Get all groups
//   getAll: async (): Promise<Group[]> => {
//     const response = await apiRequest("GET", `${BASE_URL}/api/`);
//     return response.json();
//   },

//   // Get group by ID
//   getById: async (id: string): Promise<Group> => {
//     const response = await apiRequest("GET", `${BASE_URL}/api/${id}`);
//     return response.json();
//   },

//   // Update group
//   update: async (id: string, data: UpdateGroupRequest): Promise<Group> => {
//     const response = await apiRequest("PUT", `${BASE_URL}/api/${id}`, data);
//     return response.json();
//   },

//   // Delete group
//   delete: async (id: string): Promise<void> => {
//     await apiRequest("DELETE", `${BASE_URL}/api/${id}`);
//   },
// };

// // Group Member API
// export const groupMemberApi = {
//   // Get group members by group ID
//   getByGroupId: async (groupId: string): Promise<GroupMember[]> => {
//     const response = await apiRequest("GET", `${BASE_URL}/groups/${groupId}`);
//     return response.json();
//   },

//   // Get all group members
//   getAll: async (): Promise<GroupMember[]> => {
//     const response = await apiRequest("GET", `${BASE_URL}/groups/`);
//     return response.json();
//   },

//   // Join group
//   join: async (groupId: string): Promise<GroupMember> => {
//     const response = await apiRequest("POST", `${BASE_URL}/groups/${groupId}/join`);
//     return response.json();
//   },

//   // Add group member
//   add: async (groupId: string, userId: string): Promise<GroupMember> => {
//     const response = await apiRequest("POST", `${BASE_URL}/groups/`, {
//       groupId,
//       userId,
//     });
//     return response.json();
//   },

//   // Update group member
//   update: async (id: string, data: Partial<GroupMember>): Promise<GroupMember> => {
//     const response = await apiRequest("PUT", `${BASE_URL}/groups/${id}`, data);
//     return response.json();
//   },

//   // Remove group member
//   remove: async (id: string): Promise<void> => {
//     await apiRequest("DELETE", `${BASE_URL}/groups/${id}`);
//   },
// }; 