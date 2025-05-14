
// Type definitions for teams, users, and tasks
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  teamId?: string; // Optional as personal tasks don't need team
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  createdBy: string;
  createdAt: Date;
}

export interface TeamContextType {
  currentUser: User;
  users: User[];
  teams: Team[];
  tasks: Task[];
  selectedTeam: string | null;
  setSelectedTeam: (teamId: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task | undefined>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<Team | undefined>;
  addUserToTeam: (teamId: string, userId: string) => void;
  refreshData?: () => Promise<void>;
}
