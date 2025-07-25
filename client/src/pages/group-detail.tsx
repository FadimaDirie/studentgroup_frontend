import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Edit, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  useGetGroupsQuery,
  useGetGroupMembersQuery,
  useJoinGroupMutation,
  useAddGroupMemberMutation,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetAllUsersQuery
} from "@/lib/apiSlice";

export default function GroupDetail() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any | null>(null);
  const { data: allUsers = [] } = useGetAllUsersQuery();
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const userId = user?._id;
  const isAdmin = user?.role === "admin";

  // RTK Query hooks
  const { data: groups = [], isLoading: loadingGroups, error: errorGroups } = useGetGroupsQuery();
  const groupId = selectedGroup?._id;
  const { data: members = [], isLoading: loadingMembers } = useGetGroupMembersQuery(groupId, { skip: !groupId });
  const [joinGroup, { isLoading: joinLoading }] = useJoinGroupMutation();
  const [addGroupMember, { isLoading: addMemberLoading }] = useAddGroupMemberMutation();
  const [createGroup, { isLoading: createLoading }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: editLoading }] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  // Ensure members is always an array
  const memberList = Array.isArray(members) ? members : members?.members || [];

  // Filter users to only those not already in the group
  const groupMemberIds = memberList.map((m: any) => m.userId?._id || m.userId);
  const availableUsers = allUsers.filter((u: any) => !groupMemberIds.includes(u._id));

  // Handler: open group modal
  function handleOpenGroupModal(group: any) {
    setSelectedGroup(group);
    setShowGroupModal(true);
    setEditMode(false);
    setEditName(group.name);
    setEditDescription(group.description);
  }

  // Handler: join group
  async function handleJoinGroup() {
    if (!groupId || !userId) return;
    try {
      await joinGroup({ groupId, userId }).unwrap();
      toast.success("Joined group!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to join group");
    }
  }

  // Handler: add member (admin only)
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!groupId || !addMemberEmail) return;
    try {
      await addGroupMember({ groupId, userId: addMemberEmail, createdBy: userId });
        setAddMemberEmail("");
        toast.success("Member added!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add member");
    }
  }

  // Handler: create group
  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!createName || !createDescription) {
      toast.error("Please fill all fields");
      return;
    }
    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }
    try {
      await createGroup({
        name: createName,
        description: createDescription,
        createdBy: userId,
        members: [userId],
      }).unwrap();
      setShowCreateGroup(false);
      setCreateName("");
      setCreateDescription("");
      toast.success("Group created!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create group");
    }
  }

  // Handler: update group info (owner only)
  async function handleUpdateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!editName || !editDescription || !groupId) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await updateGroup({ id: groupId, data: { name: editName, description: editDescription } }).unwrap();
      setEditMode(false);
      toast.success("Group updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update group");
    }
  }

  const handleEditClick = (group: any) => {
    setEditGroup(group);
    setEditName(group.name);
    setEditDescription(group.description);
    setEditModalOpen(true);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGroup) return;
    await updateGroup({ id: editGroup._id, data: { name: editName, description: editDescription } });
    setEditModalOpen(false);
  };

  // Gradients for cards
  const gradients = [
    "from-blue-500 via-purple-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-500",
    "from-yellow-400 via-red-400 to-pink-500",
    "from-indigo-500 via-sky-400 to-emerald-400",
    "from-pink-500 via-red-400 to-yellow-400",
    "from-purple-500 via-fuchsia-500 to-pink-400",
  ];

  return (
    <AppLayout
      title="Groups"
      description="All groups and details"
      action={{
        label: "Create Group",
        onClick: () => setShowCreateGroup(true),
      }}
    >
      <div className="max-w-5xl mx-auto space-y-8 bg-background text-foreground transition-colors duration-500">
        {/* Group List */}
        {loadingGroups ? (
          <div>Loading groups...</div>
        ) : errorGroups ? (
          <div className="text-destructive">{String(errorGroups)}</div>
        ) : groups.length === 0 ? (
          <div>No groups found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((group: any, idx: number) => {
              const handleDelete = async () => {
                if (window.confirm("Are you sure you want to delete this group?")) {
                  await deleteGroup(group._id);
                }
              };
              return (
              <div
                key={group._id}
                className={`relative rounded-2xl shadow-xl overflow-hidden cursor-pointer group transition-transform hover:scale-105 bg-gradient-to-br ${gradients[idx % gradients.length]} p-0`}
                onClick={() => handleOpenGroupModal(group)}
                style={{ minHeight: 180 }}
              >
                  {/* Edit/Delete buttons */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 z-20">
                      <button onClick={e => { e.stopPropagation(); handleEditClick(group); }} title="Edit" className="p-1 rounded hover:bg-muted transition">
                        <Edit className="w-5 h-5 text-primary" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(); }} title="Delete" className="p-1 rounded hover:bg-destructive/10 transition">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  )}
                <div className="absolute inset-0 bg-card/90 rounded-2xl z-10" />
                <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 p-4 shadow-lg">
                      <Users className="w-8 h-8 text-primary drop-shadow" />
                    </span>
                    <div>
                      <h4 className="text-xl font-bold text-white drop-shadow-lg">{group.name}</h4>
                      <p className="text-white/80 text-sm drop-shadow">{group.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">{group.members?.length || 0} members</span>
                    <span className="text-xs text-white/80 font-medium bg-black/20 rounded-full px-3 py-1">Created: {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Users className="w-16 h-16 text-white" />
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Group Detail Modal */}
        <Dialog open={showGroupModal} onOpenChange={setShowGroupModal}>
          <DialogContent className="max-w-2xl bg-card text-card-foreground shadow-2xl rounded-2xl border-0 transition-colors duration-500">
            {selectedGroup && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary drop-shadow">Group Details</DialogTitle>
                </DialogHeader>
                {/* Group Info */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {editMode ? (
                      <form onSubmit={handleUpdateGroup} className="space-y-2">
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="font-bold text-lg" />
                        <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} />
                        <div className="flex gap-2 mt-2">
                          <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={editLoading}>Cancel</Button>
                          <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-3 shadow-lg">
                            <Users className="w-7 h-7 text-white" />
                          </span>
                          <h2 className="font-bold text-2xl flex items-center gap-2 text-primary drop-shadow">{selectedGroup.name} {selectedGroup.createdBy === userId && <Badge variant="outline" className="bg-yellow-400/80 text-black border-0 ml-2">Admin</Badge>}</h2>
                        </div>
                        <div className="text-muted-foreground mb-2 text-lg">{selectedGroup.description}</div>
                        <div className="flex gap-2 mt-2">
                          {isAdmin && selectedGroup.createdBy === userId && (
                            <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Show Add Member for owner only (robust check) */}
                  {selectedGroup && userId && (
                    (selectedGroup.createdBy?._id?.toString() === userId?.toString() ||
                     selectedGroup.createdBy?.toString() === userId?.toString()) && (
                      <Button
                        onClick={() => setAddMemberModalOpen(true)}
                        variant="default"
                        className="text-lg px-6 py-2 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                      >
                        Add Member
                      </Button>
                    )
                  )}
                  {/* Show Join Group for non-owners who are not members */}
                  {selectedGroup && userId && (
                    (selectedGroup.createdBy?._id?.toString() !== userId?.toString() &&
                     selectedGroup.createdBy?.toString() !== userId?.toString() &&
                     !memberList.some((m: any) => {
                       const memberId = m.userId?._id || m.userId || m._id || m.id;
                       console.log('join check memberId:', memberId, 'userId:', userId);
                       return memberId?.toString() === userId?.toString();
                     })) && (
                      <Button
                        onClick={handleJoinGroup}
                        disabled={joinLoading}
                        variant="default"
                        className="text-lg px-6 py-2 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                      >
                        {joinLoading ? "Joining..." : "Join Group"}
                      </Button>
                    )
                  )}
                </div>
                {/* Members List always visible */}
                <div>
                  <div className="font-semibold mb-2 text-lg text-primary">Members ({memberList?.length || 0})</div>
                  <div className="flex flex-wrap gap-4">
                    {memberList?.map((member: any) => {
                      const memberId = member._id;
                      const createdById = selectedGroup.createdBy?._id || selectedGroup.createdBy;
                      const isOwner = createdById?.toString() === memberId?.toString();
                      return (
                        <div key={memberId} className="flex flex-col items-center gap-2 bg-muted rounded-xl px-4 py-3 shadow-md min-w-[110px] transition-all hover:scale-105">
                          <Avatar className="w-12 h-12 text-lg font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {member.full_name?.[0] || member.email?.[0] || '?'}
                          </Avatar>
                          <span className="font-medium text-primary text-base">{member.full_name || member.email || 'Unknown'}</span>
                          {isOwner ? (
                            <Badge variant="secondary" className="bg-yellow-400/80 text-black border-0">admin</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-0">Member</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Add member (owner only) */}
                  {selectedGroup.createdBy === userId && (
                    <form onSubmit={handleAddMember} className="flex gap-2 mt-6 items-center">
                      <Input placeholder="Add member by userId..." value={addMemberEmail} onChange={e => setAddMemberEmail(e.target.value)} className="max-w-xs" />
                      <Button type="submit" size="sm" disabled={addMemberLoading} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">{addMemberLoading ? "Adding..." : "Add Member"}</Button>
                    </form>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {isAdmin && selectedGroup.createdBy === userId && (
                    <Button size="sm" variant="destructive" onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this group?")) {
                        await deleteGroup(selectedGroup._id);
                        setShowGroupModal(false);
                      }
                    }}>Delete</Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Group Modal */}
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                <label className="block mb-1 font-medium">Group Name</label>
                <Input value={createName} onChange={e => setCreateName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea value={createDescription} onChange={e => setCreateDescription(e.target.value)} rows={3} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateGroup(false)} disabled={createLoading}>
                          Cancel
                        </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create Group"}
                        </Button>
                      </div>
                    </form>
                </DialogContent>
              </Dialog>

        {/* Shared Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
              <DialogDescription>
                Update the name and description of your group.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} disabled={editLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Member Modal for owner only (robust check) */}
        {selectedGroup && userId && (
          (selectedGroup.createdBy?._id?.toString() === userId?.toString() ||
           selectedGroup.createdBy?.toString() === userId?.toString()) && (
            <Dialog open={addMemberModalOpen} onOpenChange={setAddMemberModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                  <DialogDescription>Select a user to add to this group.</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedUserId) return;
                    console.log({ groupId: selectedGroup._id, userId: selectedUserId, createdBy: userId });
                    await addGroupMember({ groupId: selectedGroup._id, userId: selectedUserId, createdBy: userId });
                    setSelectedUserId("");
                    setAddMemberModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block mb-1 font-medium">Select User</label>
                    <select
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full border rounded px-2 py-2"
                      required
                    >
                      <option value="">-- Select User --</option>
                      {availableUsers.map((u: any) => (
                        <option key={u._id} value={u._id}>
                          {u.full_name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddMemberModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!selectedUserId}>
                      Add
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </AppLayout>
  );
}
