import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://mernstack-backend-vtfj.onrender.com';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task', 'Group', 'GroupMember', 'User'],
  endpoints: (builder) => ({
    // Tasks
    getTasks: builder.query<any[], void>({
      query: () => '/api/tasks/api/tasks',
      providesTags: ['Task'],
    }),
    getTask: builder.query<any, string>({
      query: (id) => `/api/tasks/api/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<any, any>({
      query: (body) => ({
        url: '/api/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    // Groups
    getGroups: builder.query<any, void>({
      query: () => '/api/',
      providesTags: ['Group'],
    }),
    getGroup: builder.query<any, string>({
      query: (id) => `/api/${id}`,
      providesTags: (result, error, id) => [{ type: 'Group', id }],
    }),
    createGroup: builder.mutation<any, { name: string; description: string; createdBy: string; members: string[] }>({
      query: (body) => ({
        url: '/api/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Group'],
    }),
    updateGroup: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
    deleteGroup: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Group'],
    }),
    // Group Members
    getGroupMembers: builder.query<any, string>({
      query: (groupId) => `/api/${groupId}`,
      providesTags: ['GroupMember'],
    }),
    getAllGroupMembers: builder.query<any, void>({
      query: () => '/groups/',
      providesTags: ['GroupMember'],
    }),
    joinGroup: builder.mutation<any, { groupId: string, userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `/api/${groupId}/join`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['GroupMember'],
    }),
    addGroupMember: builder.mutation<any, { groupId: string; userId: string; createdBy: string }>({
      query: ({ groupId, userId, createdBy }) => ({
        url: '/api/groups/add-member',
        method: 'POST',
        body: { groupId, userId, createdBy },
      }),
      invalidatesTags: ['GroupMember'],
    }),
    updateGroupMember: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GroupMember'],
    }),
    removeGroupMember: builder.mutation<any, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GroupMember'],
    }),
    // Users
    getAllUsers: builder.query<any[], void>({
      query: () => '/api/users/',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: '/api/users/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/api/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getSuspendedUsersCount: builder.query<number, void>({
      query: () => '/api/users/count/suspended',
    }),
    getUnsuspendedUsersCount: builder.query<number, void>({
      query: () => '/api/users/count/unsuspended',
    }),
    suspendUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/users/${id}/suspend`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    unsuspendUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/users/${id}/unsuspend`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupMembersQuery,
  useGetAllGroupMembersQuery,
  useJoinGroupMutation,
  useAddGroupMemberMutation,
  useUpdateGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetSuspendedUsersCountQuery,
  useGetUnsuspendedUsersCountQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} = apiSlice; 