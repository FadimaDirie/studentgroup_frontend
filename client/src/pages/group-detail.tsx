import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

export default function GroupDetail() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [errorGroups, setErrorGroups] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const userId = user?._id;

  // Fetch all groups
  useEffect(() => {
    async function fetchGroups() {
      setLoadingGroups(true);
      setErrorGroups("");
      try {
        const res = await fetch("https://mernstack-backend-vtfj.onrender.com/api");
        const data = await res.json();
        if (!res.ok) {
          setErrorGroups(data.message || "Failed to fetch groups");
        } else {
          setGroups(data);
        }
      } catch (err) {
        setErrorGroups("Network error. Please try again.");
      } finally {
        setLoadingGroups(false);
      }
    }
    fetchGroups();
  }, []);

  // Create group handler
  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    if (!createName || !createDescription) {
      setCreateError("Please fill all fields");
      return;
    }
    if (!userId) {
      setCreateError("User not found. Please login again.");
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetch("https://mernstack-backend-vtfj.onrender.com/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          description: createDescription,
          createdBy: userId,
          members: [userId]
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.message || "Failed to create group");
      } else {
        setGroups((prev) => [...prev, data.group]);
        setShowCreateGroup(false);
        setCreateName("");
        setCreateDescription("");
      }
    } catch (err) {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  }

  // Handler: open group modal
  function handleOpenGroupModal(group: any) {
    setSelectedGroup(group);
    setShowGroupModal(true);
    setEditMode(false);
    setEditName(group.name);
    setEditDescription(group.description);
  }

  // Handler: update group info (owner only)
  async function handleUpdateGroup(e: React.FormEvent) {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`https://mernstack-backend-vtfj.onrender.com/api/groups/${selectedGroup._id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message || "Failed to update group");
      } else {
        setGroups((prev) => prev.map(g => g._id === selectedGroup._id ? { ...g, name: editName, description: editDescription } : g));
        setSelectedGroup((g: any) => ({ ...g, name: editName, description: editDescription }));
        setEditMode(false);
        toast.success("Group updated!");
      }
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setEditLoading(false);
    }
  }

  // Handler: add member (owner only)
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddMemberError("");
    setAddMemberLoading(true);
    try {
      const res = await fetch(`https://mernstack-backend-vtfj.onrender.com/api/groups/${selectedGroup._id}/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addMemberEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddMemberError(data.message || "Failed to add member");
      } else {
        setGroups((prev) => prev.map(g => g._id === selectedGroup._id ? { ...g, members: data.members } : g));
        setSelectedGroup((g: any) => ({ ...g, members: data.members }));
        setAddMemberEmail("");
        toast.success("Member added!");
      }
    } catch {
      setAddMemberError("Network error. Please try again.");
    } finally {
      setAddMemberLoading(false);
    }
  }

  // Handler: remove member (owner only)
  async function handleRemoveMember(memberId: string) {
    if (!window.confirm("Remove this member from the group?")) return;
    try {
      const res = await fetch(`https://mernstack-backend-vtfj.onrender.com/api/groups/${selectedGroup._id}/remove-member/${memberId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to remove member");
      } else {
        setGroups((prev) => prev.map(g => g._id === selectedGroup._id ? { ...g, members: data.members } : g));
        setSelectedGroup((g: any) => ({ ...g, members: data.members }));
        toast.success("Member removed!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  // Handler: update group admin (make member admin)
  async function handleMakeAdmin(newAdminId: string) {
    if (!window.confirm("Are you sure you want to make this member the new admin?")) return;
    try {
      const res = await fetch(`https://mernstack-backend-vtfj.onrender.com/api/${selectedGroup._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: newAdminId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update admin");
      } else {
        setGroups((prev) => prev.map(g => g._id === selectedGroup._id ? { ...g, createdBy: newAdminId } : g));
        setSelectedGroup((g: any) => ({ ...g, createdBy: newAdminId }));
        toast.success("Admin updated!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  // Handler: join group
  async function handleJoinGroup() {
    setJoinLoading(true);
    try {
      const res = await fetch(`https://mernstack-backend-vtfj.onrender.com/api/groups/${selectedGroup._id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to join group");
      } else {
        setGroups((prev) => prev.map(g => g._id === selectedGroup._id ? { ...g, members: data.members } : g));
        setSelectedGroup((g: any) => ({ ...g, members: data.members }));
        toast.success("Joined group!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  }

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
          <div className="text-destructive">{errorGroups}</div>
        ) : groups.length === 0 ? (
          <div>No groups found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((group, idx) => (
              <div
                key={group._id}
                className={`relative rounded-2xl shadow-xl overflow-hidden cursor-pointer group transition-transform hover:scale-105 bg-gradient-to-br ${gradients[idx % gradients.length]} p-0`}
                onClick={() => handleOpenGroupModal(group)}
                style={{ minHeight: 180 }}
              >
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
            ))}
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
                        {editError && <div className="text-destructive text-sm">{editError}</div>}
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
                          {selectedGroup.createdBy === userId && (
                            <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Join button */}
                  {selectedGroup.members && !selectedGroup.members.some((m: any) => m._id === userId) && (
                    <Button onClick={handleJoinGroup} disabled={joinLoading} variant="default" className="text-lg px-6 py-2 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      {joinLoading ? "Joining..." : "Join Group"}
                    </Button>
                  )}
                </div>
                {/* Members List */}
                <div>
                  <div className="font-semibold mb-2 text-lg text-primary">Members ({selectedGroup.members?.length || 0})</div>
                  <div className="flex flex-wrap gap-4">
                    {selectedGroup.members?.map((member: any) => (
                      <div key={member._id} className="flex flex-col items-center gap-2 bg-muted rounded-xl px-4 py-3 shadow-md min-w-[110px] transition-all hover:scale-105">
                        <Avatar className="w-12 h-12 text-lg font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {member.name?.[0] || member.email?.[0] || '?'}
                        </Avatar>
                        <span className="font-medium text-primary text-base">{member.name || member.email || 'Unknown'}</span>
                        {selectedGroup.createdBy === member._id ? (
                          <Badge variant="secondary" className="bg-yellow-400/80 text-black border-0">Admin</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-0">Member</Badge>
                        )}
                        {selectedGroup.createdBy === userId && member._id !== userId && (
                          <div className="flex flex-col gap-1 w-full">
                            <Button size="sm" variant="destructive" className="mt-1" onClick={() => handleRemoveMember(member._id)}>Remove</Button>
                            <Button size="sm" variant="secondary" className="mt-1" onClick={() => handleMakeAdmin(member._id)}>Make Admin</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Add member (owner only) */}
                  {selectedGroup.createdBy === userId && (
                    <form onSubmit={handleAddMember} className="flex gap-2 mt-6 items-center">
                      <Input placeholder="Add member by email..." value={addMemberEmail} onChange={e => setAddMemberEmail(e.target.value)} className="max-w-xs" />
                      <Button type="submit" size="sm" disabled={addMemberLoading} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">{addMemberLoading ? "Adding..." : "Add Member"}</Button>
                      {addMemberError && <span className="text-destructive text-sm ml-2">{addMemberError}</span>}
                    </form>
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
                <Input placeholder="Enter group name..." value={createName} onChange={e => setCreateName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea placeholder="Describe your group's purpose..." rows={3} value={createDescription} onChange={e => setCreateDescription(e.target.value)} />
              </div>
              {createError && <div className="text-destructive text-sm">{createError}</div>}
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
      </div>
    </AppLayout>
  );
}
