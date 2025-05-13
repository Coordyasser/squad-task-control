
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTeam, TaskStatus, Task } from '@/contexts/TeamContext';
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define priority colors
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const KanbanBoard = () => {
  const { tasks, users, teams, currentUser, updateTaskStatus } = useTeam();
  const [filter, setFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  // Filter tasks based on selections
  const filteredTasks = tasks.filter(task => {
    // If team filter is active and doesn't match
    if (teamFilter && task.teamId !== teamFilter) return false;
    // If user filter is active and doesn't match
    if (filter && task.assigneeId !== filter) return false;
    // Otherwise include the task
    return true;
  });

  // Group tasks by status
  const groupedTasks = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done'),
  };

  // Handle drag & drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskStatus(taskId, status);
  };

  const statusLabels = {
    todo: 'A Fazer',
    'in-progress': 'Em Progresso',
    review: 'Revisão',
    done: 'Concluído',
  };

  // Function to render a single task card
  const renderTaskCard = (task: Task) => {
    const assignee = users.find(u => u.id === task.assigneeId);
    
    return (
      <div 
        key={task.id} 
        className="task-card"
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
      >
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${priorityColors[task.priority]}`}>
            {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
          </Badge>
          {task.teamId && (
            <span className="text-xs text-muted-foreground">
              {teams.find(t => t.id === task.teamId)?.name}
            </span>
          )}
        </div>
        
        <h3 className="font-medium">{task.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        
        {task.dueDate && (
          <div className="text-xs text-muted-foreground mt-2">
            Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            {assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback>{assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-heading">Quadro Kanban</h1>
        <p className="text-muted-foreground">
          Gerencie suas tarefas usando o quadro kanban
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {currentUser.role === 'admin' && (
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Filtrar por Usuário</label>
            <Select
              value={filter || 'all-users'}
              onValueChange={(value) => setFilter(value === 'all-users' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">Todos os Usuários</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-48">
          <label className="text-sm font-medium mb-1 block">Filtrar por Equipe</label>
          <Select
            value={teamFilter || 'all-teams'}
            onValueChange={(value) => setTeamFilter(value === 'all-teams' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-teams">Todas as Equipes</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6 overflow-auto pb-8">
        {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map(status => (
          <div 
            key={status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status as TaskStatus)}
          >
            <h3 className="font-medium mb-2 flex items-center justify-between">
              <span>{statusLabels[status]}</span>
              <Badge variant="outline" className="ml-2">
                {groupedTasks[status].length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {groupedTasks[status].length > 0 ? (
                groupedTasks[status].map(renderTaskCard)
              ) : (
                <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-md">
                  Nenhuma tarefa aqui
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
