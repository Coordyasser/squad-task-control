
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTeam } from '@/contexts/TeamContext';
import { Plus, Users } from 'lucide-react';
import { format } from 'date-fns';

const TeamsPage = () => {
  const { teams, users, currentUser } = useTeam();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-heading">Equipes</h1>
          <p className="text-muted-foreground">
            Gerenciamento de equipes e membros
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <Button onClick={() => navigate('/teams/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map(team => {
          const teamMembers = users.filter(user => team.members.includes(user.id));
          const teamCreator = users.find(user => user.id === team.createdBy);
          
          return (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-team-blue/10 to-team-purple/10">
                <div className="flex justify-between items-start">
                  <CardTitle>{team.name}</CardTitle>
                  <Badge variant="secondary">
                    {teamMembers.length} {teamMembers.length === 1 ? 'membro' : 'membros'}
                  </Badge>
                </div>
                <CardDescription>
                  {team.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Membros</h4>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers.map(member => (
                        <Avatar key={member.id} className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                      {currentUser.role === 'admin' && (
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      Criado por {teamCreator?.name || 'Desconhecido'} em {format(new Date(team.createdAt), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate(`/teams/${team.id}`)}>
                  <Users className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {teams.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Nenhuma equipe encontrada</CardTitle>
              <CardDescription>
                Não existem equipes criadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Clique no botão "Nova Equipe" para começar a criar equipes
              </p>
            </CardContent>
            {currentUser.role === 'admin' && (
              <CardFooter>
                <Button className="w-full" onClick={() => navigate('/teams/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Equipe
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
