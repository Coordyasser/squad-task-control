
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { TeamContextType, User, UserRole } from '../types/team';
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
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }
          
          if (profile) {
            setCurrentUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
            });
          } else {
            console.log('No profile found for this user, they might need to complete registration');
            toast({
              title: "Perfil incompleto",
              description: "Por favor, complete seu perfil para continuar.",
              variant: "destructive"
            });
          }
        } else {
          // For non-authenticated routes, don't set a default admin user
          setCurrentUser(null);
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive"
        });
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [toast]);

  if (isLoading || teamActions.isLoading) {
    // Return a loading component
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Allow rendering even without a user for public routes like login, register, landing page
  return (
    <TeamContext.Provider
      value={{
        currentUser,
        users: teamActions.users || [],
        teams: teamActions.teams || [],
        tasks: teamActions.tasks || [],
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
export type { TaskStatus, TaskPriority, Task, User, Team, TeamContextType, UserRole } from '../types/team';
