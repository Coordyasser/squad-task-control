
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTeam } from '@/contexts/TeamContext';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TeamCard from '@/components/team/TeamCard';
import EmptyTeamState from '@/components/team/EmptyTeamState';
import NewTeamDialog from '@/components/team/NewTeamDialog';
import AddMemberDialog from '@/components/team/AddMemberDialog';

const TeamsPage = () => {
  const { teams, users, currentUser, createTeam, addUserToTeam, refreshData } = useTeam();
  const { teamId } = useParams();
  const { toast } = useToast();
  
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // If we have a teamId from URL params, set it as selected
  useEffect(() => {
    if (teamId) {
      setSelectedTeam(teamId);
    }
  }, [teamId]);

  // Force refresh data when page loads or teamId changes
  useEffect(() => {
    if (refreshData) {
      refreshData();
    }
  }, [refreshData, teamId]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Nome da equipe é obrigatório",
        description: "Por favor, informe um nome para a equipe",
        variant: "destructive"
      });
      return;
    }

    // Safety check for currentUser
    if (!currentUser || !currentUser.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma equipe",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTeam({
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
      
      // Refresh data after creating a team
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      toast({
        title: "Erro ao criar equipe",
        description: "Ocorreu um erro ao criar a equipe. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedUserId) {
      toast({
        title: "Seleção inválida",
        description: "Selecione um membro para adicionar à equipe",
        variant: "destructive"
      });
      return;
    }

    try {
      await addUserToTeam(selectedTeam, selectedUserId);
      
      const team = teams.find(t => t.id === selectedTeam);
      const user = users.find(u => u.id === selectedUserId);
      
      toast({
        title: "Membro adicionado",
        description: `${user?.name || 'Usuário'} foi adicionado à equipe ${team?.name || 'selecionada'}.`,
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

  const handleOpenAddMemberDialog = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsAddMemberDialogOpen(true);
  };

  // If user is null, show loading state
  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-heading">Equipes</h1>
          <p className="text-muted-foreground">
            Gerenciamento de equipes e membros
          </p>
        </div>

        {/* Show "Nova Equipe" button for all users */}
        <Button onClick={() => setIsNewTeamDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Equipe
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.length > 0 ? teams.map(team => {
          const teamMembers = users.filter(user => team.members.includes(user.id));
          const teamCreator = users.find(user => user.id === team.createdBy);
          
          return (
            <TeamCard
              key={team.id}
              team={team}
              teamMembers={teamMembers}
              teamCreator={teamCreator}
              onAddMember={handleOpenAddMemberDialog}
            />
          )
        }) : (
          <EmptyTeamState onCreateTeam={() => setIsNewTeamDialogOpen(true)} />
        )}
      </div>

      {/* New Team Dialog */}
      <NewTeamDialog
        isOpen={isNewTeamDialogOpen}
        onOpenChange={setIsNewTeamDialogOpen}
        teamName={newTeamName}
        setTeamName={setNewTeamName}
        teamDescription={newTeamDescription}
        setTeamDescription={setNewTeamDescription}
        onCreateTeam={handleCreateTeam}
      />

      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        onAddMember={handleAddMember}
        users={users}
        teams={teams}
        selectedTeam={selectedTeam}
      />
    </div>
  );
};

export default TeamsPage;
