
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { teams, users, tasks, currentUser, addUserToTeam, refreshData } = useTeam();
  const { toast } = useToast();

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Force refresh data when page loads
  useEffect(() => {
    if (refreshData) {
      refreshData();
    }
  }, [refreshData, teamId]);

  // Find the current team
  const team = teams.find(t => t.id === teamId);
  
  // If team not found, show error
  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipe não encontrada</CardTitle>
          <CardDescription>A equipe solicitada não existe ou foi removida</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/teams')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Equipes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Get team members and team tasks
  const teamMembers = users.filter(user => team.members.includes(user.id));
  const teamTasks = tasks.filter(task => task.teamId === teamId);
  const teamCreator = users.find(user => user.id === team.createdBy);

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast({
        title: "Seleção inválida",
        description: "Selecione um membro para adicionar à equipe",
        variant: "destructive"
      });
      return;
    }

    try {
      await addUserToTeam(teamId!, selectedUserId);
      
      const user = users.find(u => u.id === selectedUserId);
      
      toast({
        title: "Membro adicionado",
        description: `${user?.name || 'Usuário'} foi adicionado à equipe ${team.name}.`,
      });
      
      setSelectedUserId('');
      setIsAddMemberDialogOpen(false);
      
      // Refresh data after adding a member
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      toast({
        title: "Erro ao adicionar membro",
        description: "Ocorreu um erro ao adicionar o membro à equipe. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // If user is null, show loading state
  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/teams')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-heading">{team.name}</h1>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
        </div>
        
        <Button onClick={() => setIsAddMemberDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Members Card */}
        <Card>
          <CardHeader>
            <CardTitle>Membros</CardTitle>
            <CardDescription>
              Esta equipe tem {teamMembers.length} {teamMembers.length === 1 ? 'membro' : 'membros'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.id === team.createdBy ? "default" : "outline"}>
                        {member.id === team.createdBy ? 'Criador' : 'Membro'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-3">
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Membro
            </Button>
          </CardFooter>
        </Card>

        {/* Team Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas</CardTitle>
            <CardDescription>
              Esta equipe tem {teamTasks.length} {teamTasks.length === 1 ? 'tarefa' : 'tarefas'} atribuídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={
                          task.status === 'done' ? 'default' : 
                          task.status === 'in-progress' ? 'secondary' : 
                          'outline'
                        }>
                          {task.status === 'todo' ? 'A fazer' : 
                          task.status === 'in-progress' ? 'Em progresso' : 
                          task.status === 'review' ? 'Em revisão' : 'Concluída'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' : 
                          task.priority === 'medium' ? 'secondary' : 
                          'outline'
                        }>
                          {task.priority === 'high' ? 'Alta' : 
                          task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Nenhuma tarefa atribuída a esta equipe ainda</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-3">
            <Button onClick={() => navigate('/tasks/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Criado por:</span>
              <span className="font-medium">{teamCreator?.name || 'Desconhecido'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data de criação:</span>
              <span className="font-medium">{format(new Date(team.createdAt), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de membros:</span>
              <span className="font-medium">{teamMembers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de tarefas:</span>
              <span className="font-medium">{teamTasks.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Selecione um usuário para adicionar à equipe {team.name}.
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
                  .filter(user => !team.members.includes(user.id))
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

export default TeamDetail;
