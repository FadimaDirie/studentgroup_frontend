import { groups, members, tasks, type Group, type InsertGroup, type Member, type InsertMember, type Task, type InsertTask, type GroupWithStats, type TaskWithDetails } from "./shared/schema.js";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Groups
  getGroups(): Promise<Group[]>;
  getGroupsWithStats(): Promise<GroupWithStats[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, group: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: number): Promise<boolean>;

  // Members
  getMembers(groupId: number): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  deleteMember(id: number): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTasksWithDetails(): Promise<TaskWithDetails[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByGroup(groupId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Stats
  getStats(): Promise<{
    totalGroups: number;
    activeTasks: number;
    completedToday: number;
    dueThisWeek: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Groups
  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async getGroupsWithStats(): Promise<GroupWithStats[]> {
    const allGroups = await db.select().from(groups);
    const allMembers = await db.select().from(members);
    const allTasks = await db.select().from(tasks);

    return allGroups.map(group => {
      const groupMembers = allMembers.filter(m => m.groupId === group.id);
      const groupTasks = allTasks.filter(t => t.groupId === group.id);
      
      return {
        ...group,
        memberCount: groupMembers.length,
        taskCount: groupTasks.length,
        recentMembers: groupMembers.slice(0, 3),
      };
    });
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group || undefined;
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const [group] = await db
      .insert(groups)
      .values(insertGroup)
      .returning();
    return group;
  }

  async updateGroup(id: number, updates: Partial<InsertGroup>): Promise<Group | undefined> {
    const [group] = await db
      .update(groups)
      .set(updates)
      .where(eq(groups.id, id))
      .returning();
    return group || undefined;
  }

  async deleteGroup(id: number): Promise<boolean> {
    // Delete associated members and tasks first
    await db.delete(members).where(eq(members.groupId, id));
    await db.delete(tasks).where(eq(tasks.groupId, id));
    
    const result = await db.delete(groups).where(eq(groups.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Members
  async getMembers(groupId: number): Promise<Member[]> {
    return await db.select().from(members).where(eq(members.groupId, groupId));
  }

  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db
      .insert(members)
      .values(insertMember)
      .returning();
    return member;
  }

  async deleteMember(id: number): Promise<boolean> {
    const result = await db.delete(members).where(eq(members.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTasksWithDetails(): Promise<TaskWithDetails[]> {
    const allTasks = await db.select().from(tasks);
    const allGroups = await db.select().from(groups);
    const allMembers = await db.select().from(members);

    return allTasks.map(task => {
      const group = allGroups.find(g => g.id === task.groupId)!;
      const assignee = task.assigneeId ? allMembers.find(m => m.id === task.assigneeId) : undefined;
      
      return {
        ...task,
        group,
        assignee,
      };
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksByGroup(groupId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.groupId, groupId));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Stats
  async getStats() {
    const allTasks = await db.select().from(tasks);
    const totalGroups = await db.select({ count: sql<number>`count(*)` }).from(groups);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return {
      totalGroups: totalGroups[0].count,
      activeTasks: allTasks.filter(t => t.status !== 'completed').length,
      completedToday: allTasks.filter(t => {
        if (t.status !== 'completed') return false;
        const taskDate = new Date(t.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }).length,
      dueThisWeek: allTasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      }).length,
    };
  }
}

export const storage = new DatabaseStorage();
