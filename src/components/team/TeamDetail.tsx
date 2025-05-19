
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

// Import the extracted components
import TeamHeader from './TeamHeader';
import TeamMembersList from './TeamMembersList';
import TeamTasksList from './TeamTasksList';
import TeamInfoCard from './TeamInfoCard';

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

  // Get team members, tasks and creator
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
      <TeamHeader 
        team={team} 
        onAddMember={() => setIsAddMemberDialogOpen(true)} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TeamMembersList 
          team={team} 
          teamMembers={teamMembers} 
          onAddMember={() => setIsAddMemberDialogOpen(true)} 
        />
        
        <TeamTasksList teamTasks={teamTasks} />
      </div>

      <TeamInfoCard 
        team={team} 
        teamCreator={teamCreator} 
        teamMembers={teamMembers} 
        teamTasks={teamTasks} 
      />

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
