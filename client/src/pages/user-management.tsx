import { AppLayout } from "@/components/layout/app-layout";
import { useState } from "react";
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useCreateUserMutation, useGetSuspendedUsersCountQuery, useGetUnsuspendedUsersCountQuery, useSuspendUserMutation, useUnsuspendUserMutation } from "@/lib/apiSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading, error, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const { data: suspendedCount = 0 } = useGetSuspendedUsersCountQuery();
  const { data: unsuspendedCount = 0 } = useGetUnsuspendedUsersCountQuery();
  const [suspendUser, { isLoading: suspending }] = useSuspendUserMutation();
  const [unsuspendUser, { isLoading: unsuspending }] = useUnsuspendUserMutation();

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // Add User modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("student");

  // View User modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<any | null>(null);

  const filteredUsers = users.filter(
    (u: any) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Stat cards
  const statCards = [
    { label: "Total Users", value: users.length, color: "from-blue-500 to-blue-400" },
    { label: "Active Users", value: unsuspendedCount, color: "from-green-500 to-green-400" },
    { label: "Suspended Users", value: suspendedCount, color: "from-red-500 to-pink-400" },
  ];

  function handleEditUser(user: any) {
    setEditUser(user);
    setEditName(user.full_name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditModalOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    await updateUser({ id: editUser._id, data: { full_name: editName, email: editEmail, role: editRole } });
    setEditModalOpen(false);
  }

  async function handleDeleteUser(id: string) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      refetch(); // Refresh users list after delete
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;
    await createUser({ full_name: newName, email: newEmail, password: newPassword, role: newRole });
    setAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("student");
    refetch(); // Force refresh users list
  }

  function handleViewUser(user: any) {
    setViewUser(user);
    setViewModalOpen(true);
  }

  return (
    <AppLayout title="User Management" description="Manage all users in the system">
      <div className="mb-4 flex flex-col gap-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {statCards.map((stat) => (
            <div key={stat.label} className={`rounded-xl p-6 shadow-md text-white bg-gradient-to-br ${stat.color}`}>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition" onClick={() => setAddModalOpen(true)}>Add User</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-blue-600">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">Failed to load users</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4 font-medium">{user.full_name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className={`bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200 mx-1`}
                      title={user.suspended ? "Unsuspend" : "Suspend"}
                      onClick={async () => {
                        if (user.suspended) {
                          await unsuspendUser(user._id);
                        } else {
                          await suspendUser(user._id);
                        }
                        refetch();
                      }}
                    >
                      {user.suspended ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button className="bg-green-100 p-2 rounded-full text-green-600 hover:bg-green-200 mx-1" title="Edit" onClick={() => handleEditUser(user)}>
                      <FaEdit />
                    </button>
                    <button className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 mx-1" title="Delete" onClick={() => handleDeleteUser(user._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full border rounded px-2 py-2">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
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
      {/* Add User Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full border rounded px-2 py-2">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* View User Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2">
              <div><span className="font-medium">Full Name:</span> {viewUser.full_name}</div>
              <div><span className="font-medium">Email:</span> {viewUser.email}</div>
              <div><span className="font-medium">Role:</span> {viewUser.role}</div>
              <div><span className="font-medium">Created At:</span> {new Date(viewUser.created_at).toLocaleDateString()}</div>
              <div className="flex gap-2 mt-4">
                {viewUser.suspended ? (
                  <Button
                    variant="secondary"
                    disabled={unsuspending}
                    onClick={async () => {
                      await unsuspendUser(viewUser._id);
                      refetch();
                      setViewUser({ ...viewUser, suspended: false });
                    }}
                  >
                    {unsuspending ? "Unsuspending..." : "Unsuspend"}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    disabled={suspending}
                    onClick={async () => {
                      await suspendUser(viewUser._id);
                      refetch();
                      setViewUser({ ...viewUser, suspended: true });
                    }}
                  >
                    {suspending ? "Suspending..." : "Suspend"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
} 