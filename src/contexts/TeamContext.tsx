
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { TeamContextType, User } from '../types/team';
import { useTeamActions } from '../hooks/useTeamActions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Provider component
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const teamActions = useTeamActions();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for authenticated user and load profile
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            throw error;
          }
          
          if (profile) {
            setCurrentUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
            });
          }
        } else {
          // For development purposes, use a default admin user if not authenticated
          // In production, you would redirect to login page instead
          const { data: adminUsers, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin')
            .limit(1);

          if (error) throw error;
          
          if (adminUsers && adminUsers.length > 0) {
            const admin = adminUsers[0];
            setCurrentUser({
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              avatar: admin.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name}`
            });
            toast({
              title: "Modo demonstração",
              description: "Você está usando o app como administrador para demonstração.",
            });
          } else {
            // If no admin users exist, show a warning
            toast({
              title: "Atenção",
              description: "Nenhum usuário administrador encontrado. Por favor, crie um usuário ou faça login.",
              variant: "destructive"
            });
          }
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [toast]);

  if (isLoading || teamActions.isLoading) {
    // You could return a loading component here
    return <div>Carregando...</div>;
  }

  // Guard against missing current user
  if (!currentUser) {
    return <div>Usuário não encontrado. Por favor, faça login.</div>;
  }

  return (
    <TeamContext.Provider
      value={{
        currentUser,
        users: teamActions.users,
        teams: teamActions.teams,
        tasks: teamActions.tasks,
        selectedTeam: teamActions.selectedTeam,
        setSelectedTeam: teamActions.setSelectedTeam,
        addTask: teamActions.addTask,
        updateTaskStatus: teamActions.updateTaskStatus,
        createTeam: teamActions.createTeam,
        addUserToTeam: teamActions.addUserToTeam,
        refreshData: teamActions.refreshData
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook for using the context
export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

// Re-export types
export type { TaskStatus, TaskPriority, Task, User, Team, TeamContextType } from '../types/team';
