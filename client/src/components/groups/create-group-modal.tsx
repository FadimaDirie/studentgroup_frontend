import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get logged-in user
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}
  const userId = user?._id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !description) {
      setError("Please fill all fields");
      return;
    }
    if (!userId) {
      setError("User not found. Please login again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://mernstack-backend-vtfj.onrender.com/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          createdBy: userId,
          members: [userId]
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create group");
      } else {
        toast({ title: "Success", description: "Group created successfully!" });
        setName("");
        setDescription("");
        onOpenChange(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-2xl border-0 transition-colors duration-500">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormLabel>Group Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter group name..." value={name} onChange={e => setName(e.target.value)} className="bg-input text-foreground border border-border" />
            </FormControl>
          </div>
          <div>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe your group's purpose..." rows={3} value={description} onChange={e => setDescription(e.target.value)} className="bg-input text-foreground border border-border" />
            </FormControl>
          </div>
          {error && <FormMessage className="text-destructive">{error}</FormMessage>}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
