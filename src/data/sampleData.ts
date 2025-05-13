
import { User, Team, Task } from '../types/team';

// Sample data for demonstration
export const sampleUsers: User[] = [
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

export const sampleTeams: Team[] = [
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

export const sampleTasks: Task[] = [
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
