
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';
import { useToast } from '@/components/ui/use-toast';

export function useTeamsPage() {
  const { teams = [], users = [], currentUser, createTeam, addUserToTeam, refreshData, isLoading: contextLoading } = useTeam();
  const { teamId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [pageLoading, setPageLoading] = useState(false);

  // If we have a teamId from URL params, set it as selected
  useEffect(() => {
    if (teamId) {
      setSelectedTeam(teamId);
    }
  }, [teamId]);

  // Force refresh data when page loads
  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        if (refreshData) {
          await refreshData();
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setPageLoading(false);
      }
    };
    
    loadData();
  }, []);

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
      setPageLoading(true);
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
        await refreshData();
      }
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      toast({
        title: "Erro ao criar equipe"
      });
    } finally {
      setPageLoading(false);
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
      setPageLoading(true);
      await addUserToTeam(selectedTeam, selectedUserId);
      
      toast({
        title: "Membro adicionado"
      });
      
      setSelectedUserId('');
      setIsAddMemberDialogOpen(false);
      
      // Refresh data after adding a member
      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      toast({
        title: "Erro ao adicionar membro"
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handleOpenAddMemberDialog = (teamId: string) => {
    setSelectedTeam(teamId);
    setIsAddMemberDialogOpen(true);
  };

  return {
    teams,
    users,
    currentUser,
    isLoading: contextLoading || pageLoading,
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
  };
}
