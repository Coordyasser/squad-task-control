
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTeam } from '@/contexts/TeamContext';
import { format } from 'date-fns';

// Define priority colors
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

// Define status colors
const statusColors = {
  todo: 'bg-slate-100 text-slate-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
};

const statusLabels = {
  todo: 'A Fazer',
  'in-progress': 'Em Progresso',
  review: 'Revisão',
  done: 'Concluído',
};

const ProfilePage = () => {
  const { currentUser, tasks, teams } = useTeam();
  
  // Get user's tasks
  const userTasks = tasks.filter(task => task.assigneeId === currentUser.id);
  const createdTasks = tasks.filter(task => task.createdBy === currentUser.id);
  
  // Get user's teams
  const userTeams = teams.filter(team => team.members.includes(currentUser.id));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {currentUser.name}
          </h1>
          <p className="text-muted-foreground mb-2">
            {currentUser.email}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {currentUser.role}
            </Badge>
            <Badge variant="outline">
              {userTeams.length} Equipes
            </Badge>
            <Badge variant="outline">
              {userTasks.length} Tarefas Atribuídas
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assigned">Tarefas Atribuídas</TabsTrigger>
          <TabsTrigger value="created">Tarefas Criadas</TabsTrigger>
          <TabsTrigger value="teams">Minhas Equipes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned">
          <div className="grid gap-4">
            {userTasks.length > 0 ? (
              userTasks.map(task => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      <Badge className={statusColors[task.status]}>
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                    {task.teamId && (
                      <CardDescription>
                        Equipe: {teams.find(t => t.id === task.teamId)?.name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge className={priorityColors[task.priority]}>
                        Prioridade: {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
                      </Badge>
                      
                      {task.dueDate && (
                        <span className="text-sm text-muted-foreground">
                          Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sem tarefas atribuídas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Você não tem nenhuma tarefa atribuída no momento.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="created">
          <div className="grid gap-4">
            {createdTasks.length > 0 ? (
              createdTasks.map(task => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      <Badge className={statusColors[task.status]}>
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                    {task.teamId && (
                      <CardDescription>
                        Equipe: {teams.find(t => t.id === task.teamId)?.name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
                        </Badge>
                      </div>
                      
                      {task.dueDate && (
                        <span className="text-sm text-muted-foreground">
                          Prazo: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sem tarefas criadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Você não criou nenhuma tarefa ainda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="grid gap-4 md:grid-cols-2">
            {userTeams.length > 0 ? (
              userTeams.map(team => (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>
                      {team.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 flex-wrap">
                      {team.members.map(memberId => {
                        const member = teams.find(t => t.id === memberId);
                        return (
                          <Avatar key={memberId} className="h-8 w-8">
                            <AvatarFallback>
                              {member?.name.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Sem equipes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Você não participa de nenhuma equipe no momento.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
