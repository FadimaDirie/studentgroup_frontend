import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGroupSchema, insertMemberSchema, insertTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Groups routes
  app.get("/api/groups", async (_req, res) => {
    try {
      const groups = await storage.getGroupsWithStats();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getGroup(id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const result = insertGroupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid group data", errors: result.error.errors });
      }
      
      const group = await storage.createGroup(result.data);
      res.status(201).json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.put("/api/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertGroupSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid group data", errors: result.error.errors });
      }
      
      const group = await storage.updateGroup(id, result.data);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to update group" });
    }
  });

  app.delete("/api/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGroup(id);
      if (!success) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete group" });
    }
  });

  // Members routes
  app.get("/api/groups/:groupId/members", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const members = await storage.getMembers(groupId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const result = insertMemberSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid member data", errors: result.error.errors });
      }
      
      const member = await storage.createMember(result.data);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to add member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMember(id);
      if (!success) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove member" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasksWithDetails();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/groups/:groupId/tasks", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const tasks = await storage.getTasksByGroup(groupId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid task data", errors: result.error.errors });
      }
      
      const task = await storage.createTask(result.data);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertTaskSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid task data", errors: result.error.errors });
      }
      
      const task = await storage.updateTask(id, result.data);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Stats route
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
