
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Type definitions
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

interface TeamContextType {
  currentUser: User;
  users: User[];
  teams: Team[];
  tasks: Task[];
  selectedTeam: string | null;
  setSelectedTeam: (teamId: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  addUserToTeam: (teamId: string, userId: string) => void;
}

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Sample data for demonstration
const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
  {
    id: 'user2',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
  },
  {
    id: 'user3',
    name: 'Maria Costa',
    email: 'maria@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  },
  {
    id: 'user4',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
  },
];

const sampleTeams: Team[] = [
  {
    id: 'team1',
    name: 'Desenvolvimento',
    description: 'Equipe de Desenvolvimento de Software',
    members: ['user1', 'user2', 'user3'],
    createdBy: 'user1',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'team2',
    name: 'Marketing',
    description: 'Equipe de Marketing Digital',
    members: ['user1', 'user4'],
    createdBy: 'user1',
    createdAt: new Date('2023-02-10'),
  },
];

const sampleTasks: Task[] = [
  {
    id: 'task1',
    title: 'Implementar autenticação',
    description: 'Adicionar sistema de login com JWT',
    assigneeId: 'user2',
    teamId: 'team1',
    status: 'todo',
    priority: 'high',
    createdBy: 'user1',
    createdAt: new Date('2023-05-01'),
    dueDate: new Date('2023-05-10'),
  },
  {
    id: 'task2',
    title: 'Design da página inicial',
    description: 'Criar wireframes para a homepage',
    assigneeId: 'user3',
    teamId: 'team1',
    status: 'in-progress',
    priority: 'medium',
    createdBy: 'user1',
    createdAt: new Date('2023-04-28'),
    dueDate: new Date('2023-05-08'),
  },
  {
    id: 'task3',
    title: 'Campanha nas redes sociais',
    description: 'Planejar postagens para Instagram e Facebook',
    assigneeId: 'user4',
    teamId: 'team2',
    status: 'review',
    priority: 'medium',
    createdBy: 'user1',
    createdAt: new Date('2023-05-02'),
    dueDate: new Date('2023-05-12'),
  },
  {
    id: 'task4',
    title: 'Otimização de SEO',
    description: 'Melhorar ranqueamento do site nos buscadores',
    assigneeId: 'user4',
    teamId: 'team2',
    status: 'todo',
    priority: 'high',
    createdBy: 'user4',
    createdAt: new Date('2023-05-03'),
    dueDate: new Date('2023-05-18'),
  },
  {
    id: 'task5',
    title: 'Corrigir bugs no painel',
    description: 'Resolver problemas reportados no dashboard',
    assigneeId: 'user2',
    teamId: 'team1',
    status: 'done',
    priority: 'high',
    createdBy: 'user2',
    createdAt: new Date('2023-04-25'),
    dueDate: new Date('2023-05-02'),
  },
];

// Provider component
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [users] = useState<User[]>(sampleUsers);
  const [currentUser] = useState<User>(sampleUsers[0]); // Default to admin user

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task${tasks.length + 1}`,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const createTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: `team${teams.length + 1}`,
      createdAt: new Date(),
    };
    setTeams([...teams, newTeam]);
  };

  const addUserToTeam = (teamId: string, userId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId && !team.members.includes(userId)
          ? { ...team, members: [...team.members, userId] }
          : team
      )
    );
  };

  return (
    <TeamContext.Provider
      value={{
        currentUser,
        users,
        teams,
        tasks,
        selectedTeam,
        setSelectedTeam,
        addTask,
        updateTaskStatus,
        createTeam,
        addUserToTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook for using the context
export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
