
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Eye, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const TeamsPage = () => {
  const { teams, users, currentUser, createTeam, addUserToTeam } = useTeam();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Nome da equipe é obrigatório",
        description: "Por favor, informe um nome para a equipe",
        variant: "destructive"
      });
      return;
    }

    createTeam({
      name: newTeamName,
      description: newTeamDescription,
      members: [currentUser.id],
      createdBy: currentUser.id
    });

    toast({
      title: "Equipe criada com sucesso",
      description: `A equipe ${newTeamName} foi criada.`,
    });

    setNewTeamName('');
    setNewTeamDescription('');
    setIsNewTeamDialogOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedTeam || !selectedUserId) {
      toast({
        title: "Seleção inválida",
        description: "Selecione um membro para adicionar à equipe",
        variant: "destructive"
      });
      return;
    }

    addUserToTeam(selectedTeam, selectedUserId);
    
    const team = teams.find(t => t.id === selectedTeam);
    const user = users.find(u => u.id === selectedUserId);
    
    toast({
      title: "Membro adicionado",
      description: `${user?.name} foi adicionado à equipe ${team?.name}.`,
    });
    
    setSelectedUserId('');
    setIsAddMemberDialogOpen(false);
  };

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
          <Button onClick={() => setIsNewTeamDialogOpen(true)}>
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
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => {
                            setSelectedTeam(team.id);
                            setIsAddMemberDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
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
                  <Eye className="mr-2 h-4 w-4" />
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
                <Button className="w-full" onClick={() => setIsNewTeamDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Equipe
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>

      {/* New Team Dialog */}
      <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Equipe</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para criar uma nova equipe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe</Label>
              <Input 
                id="name" 
                placeholder="Digite o nome da equipe" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                placeholder="Digite uma descrição para a equipe" 
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTeamDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTeam}>Criar Equipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Selecione um usuário para adicionar à equipe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="member">Usuário</Label>
              <select 
                id="member"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecione um usuário</option>
                {users
                  .filter(user => {
                    // Don't show users already in the team
                    const team = teams.find(t => t.id === selectedTeam);
                    return team && !team.members.includes(user.id);
                  })
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddMember}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsPage;
