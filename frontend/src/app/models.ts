export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export interface Session { token: string; role: Role; name: string; email: string; id: number; }
export interface Task { id: number; title: string; description: string; status: TaskStatus; priority: Priority; deadline: string; assignedToId: number; assigneeName: string; assignedById: number; assignerName: string; }
export interface User { id: number; fullName: string; email: string; role: Role; managerId?: number; managerName?: string; active: boolean; }
export interface Dashboard { totalUsers: number; totalTasks: number; completedTasks: number; teamSize: number; pending: number; inProgress: number; done: number; }
