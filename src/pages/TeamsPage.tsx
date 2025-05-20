
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTeam } from '@/contexts/TeamContext';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TeamCard from '@/components/team/TeamCard';
import EmptyTeamState from '@/components/team/EmptyTeamState';
import NewTeamDialog from '@/components/team/NewTeamDialog';
import AddMemberDialog from '@/components/team/AddMemberDialog';

const TeamsPage = () => {
  const { teams = [], users = [], currentUser, createTeam, addUserToTeam, refreshData, isLoading } = useTeam();
  const { teamId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  // Force refresh data when page loads, but only once
  useEffect(() => {
    if (refreshData) {
      refreshData();
    }
  }, [refreshData]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Nome da equipe é obrigatório"
      });
      return;
    }

    // Safety check for currentUser
    if (!currentUser || !currentUser.id) {
      toast({
        title: "Erro de autenticação"
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
        title: "Equipe criada com sucesso"
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
        title: "Erro ao criar equipe"
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedUserId) {
      toast({
        title: "Seleção inválida"
      });
      return;
    }

    try {
      await addUserToTeam(selectedTeam, selectedUserId);
      
      const team = teams.find(t => t.id === selectedTeam);
      const user = users.find(u => u.id === selectedUserId);
      
      toast({
        title: "Membro adicionado"
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
        title: "Erro ao adicionar membro"
      });
    }
  };

  const handleOpenAddMemberDialog = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsAddMemberDialogOpen(true);
  };

  // If data is loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando equipes...</p>
      </div>
    );
  }

  // If user is null, show error state
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Você precisa estar logado para acessar esta página</p>
          <Button onClick={() => navigate('/login')}>Ir para Login</Button>
        </div>
      </div>
    );
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

        {/* Show "Nova Equipe" button for admin users */}
        {currentUser?.role === 'admin' && (
          <Button onClick={() => setIsNewTeamDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(teams) && teams.length > 0 ? teams.map(team => {
          // Ensure we have valid data before rendering
          if (!team || !team.id) return null;
          
          const teamMembers = Array.isArray(users) 
            ? users.filter(user => team.members && Array.isArray(team.members) && team.members.includes(user.id))
            : [];
            
          const teamCreator = Array.isArray(users)
            ? users.find(user => user.id === team.createdBy)
            : undefined;
          
          return (
            <TeamCard
              key={team.id}
              team={team}
              teamMembers={teamMembers}
              teamCreator={teamCreator}
              onAddMember={handleOpenAddMemberDialog}
            />
          );
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
