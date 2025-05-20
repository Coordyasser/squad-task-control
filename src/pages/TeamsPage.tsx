
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTeamsPage } from '@/hooks/useTeamsPage';
import TeamsList from '@/components/team/TeamsList';
import TeamsHeader from '@/components/team/TeamsHeader';
import NewTeamDialog from '@/components/team/NewTeamDialog';
import AddMemberDialog from '@/components/team/AddMemberDialog';

const TeamsPage = () => {
  const {
    teams,
    users,
    currentUser,
    isLoading,
    isNewTeamDialogOpen,
    setIsNewTeamDialogOpen,
    isAddMemberDialogOpen,
    setIsAddMemberDialogOpen,
    selectedTeam,
    newTeamName,
    setNewTeamName,
    newTeamDescription,
    setNewTeamDescription,
    selectedUserId,
    setSelectedUserId,
    handleCreateTeam,
    handleAddMember,
    handleOpenAddMemberDialog,
    navigate
  } = useTeamsPage();

  // If data is loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Carregando equipes...</p>
        </div>
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
      <TeamsHeader 
        onCreateTeam={() => setIsNewTeamDialogOpen(true)}
        showCreateButton={currentUser?.role === 'admin'}
      />

      <TeamsList 
        teams={teams} 
        users={users} 
        onAddMember={handleOpenAddMemberDialog}
        onCreateTeam={() => setIsNewTeamDialogOpen(true)}
      />

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
