
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from '@/contexts/TeamContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const { tasks, teams, users } = useTeam();
  const [selectedTeam, setSelectedTeam] = useState<string | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<string | 'all'>('all');

  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (selectedTeam !== 'all' && task.teamId !== selectedTeam) return false;
    if (selectedUser !== 'all' && task.assigneeId !== selectedUser) return false;
    return true;
  });

  // Calculate stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === 'done').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status distribution for pie chart
  const statusData = [
    { name: 'A Fazer', value: filteredTasks.filter(task => task.status === 'todo').length, color: '#818CF8' },
    { name: 'Em Progresso', value: filteredTasks.filter(task => task.status === 'in-progress').length, color: '#F59E0B' },
    { name: 'Revisão', value: filteredTasks.filter(task => task.status === 'review').length, color: '#4F46E5' },
    { name: 'Concluído', value: filteredTasks.filter(task => task.status === 'done').length, color: '#10B981' },
  ];

  // Priority distribution for bar chart
  const priorityData = [
    { name: 'Baixa', value: filteredTasks.filter(task => task.priority === 'low').length },
    { name: 'Média', value: filteredTasks.filter(task => task.priority === 'medium').length },
    { name: 'Alta', value: filteredTasks.filter(task => task.priority === 'high').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-heading">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho das equipes e tarefas
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-48">
          <label className="text-sm font-medium mb-1 block">Filtrar por Equipe</label>
          <Select
            value={selectedTeam}
            onValueChange={(value) => setSelectedTeam(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Equipes</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-48">
          <label className="text-sm font-medium mb-1 block">Filtrar por Usuário</label>
          <Select
            value={selectedUser}
            onValueChange={(value) => setSelectedUser(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Usuários</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-team-green">{completedTasks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-team-yellow">{pendingTasks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate}%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tarefas por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
