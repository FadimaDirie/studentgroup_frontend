import { groups, members, tasks, type Group, type InsertGroup, type Member, type InsertMember, type Task, type InsertTask, type GroupWithStats, type TaskWithDetails } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private groups: Map<number, Group>;
  private members: Map<number, Member>;
  private tasks: Map<number, Task>;
  private currentGroupId: number;
  private currentMemberId: number;
  private currentTaskId: number;

  constructor() {
    this.groups = new Map();
    this.members = new Map();
    this.tasks = new Map();
    this.currentGroupId = 1;
    this.currentMemberId = 1;
    this.currentTaskId = 1;
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async getGroupsWithStats(): Promise<GroupWithStats[]> {
    const groups = await this.getGroups();
    const allMembers = Array.from(this.members.values());
    const allTasks = Array.from(this.tasks.values());

    return groups.map(group => {
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
    return this.groups.get(id);
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = this.currentGroupId++;
    const group: Group = { 
      ...insertGroup, 
      id, 
      createdAt: new Date() 
    };
    this.groups.set(id, group);
    return group;
  }

  async updateGroup(id: number, updates: Partial<InsertGroup>): Promise<Group | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;
    
    const updatedGroup = { ...group, ...updates };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    // Also delete associated members and tasks
    Array.from(this.members.entries())
      .filter(([_, member]) => member.groupId === id)
      .forEach(([memberId]) => this.members.delete(memberId));
      
    Array.from(this.tasks.entries())
      .filter(([_, task]) => task.groupId === id)
      .forEach(([taskId]) => this.tasks.delete(taskId));
      
    return this.groups.delete(id);
  }

  // Members
  async getMembers(groupId: number): Promise<Member[]> {
    return Array.from(this.members.values()).filter(m => m.groupId === groupId);
  }

  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = this.currentMemberId++;
    const member: Member = { 
      ...insertMember, 
      id, 
      joinedAt: new Date() 
    };
    this.members.set(id, member);
    return member;
  }

  async deleteMember(id: number): Promise<boolean> {
    return this.members.delete(id);
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksWithDetails(): Promise<TaskWithDetails[]> {
    const tasks = await this.getTasks();
    const allGroups = Array.from(this.groups.values());
    const allMembers = Array.from(this.members.values());

    return tasks.map(task => {
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
    return this.tasks.get(id);
  }

  async getTasksByGroup(groupId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(t => t.groupId === groupId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date() 
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Stats
  async getStats() {
    const allTasks = Array.from(this.tasks.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return {
      totalGroups: this.groups.size,
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

export const storage = new MemStorage();
