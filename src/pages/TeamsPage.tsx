
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTeamsPage } from '@/hooks/useTeamsPage';
import TeamsList from '@/components/team/TeamsList';
import TeamsHeader from '@/components/team/TeamsHeader';
import NewTeamDialog from '@/components/team/NewTeamDialog';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import { Progress } from "@/components/ui/progress";

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

  // Se o usuário for nulo, exibir estado de erro/login necessário
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

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center h-8">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <p className="text-muted-foreground">Carregando equipes...</p>
          </div>
          <Progress value={30} className="h-2 w-full animate-pulse" />
        </div>
      ) : (
        <TeamsList 
          teams={teams} 
          users={users} 
          isLoading={isLoading}
          onAddMember={handleOpenAddMemberDialog}
          onCreateTeam={() => setIsNewTeamDialogOpen(true)}
        />
      )}

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
