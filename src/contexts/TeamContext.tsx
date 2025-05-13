
import React, { createContext, useContext, ReactNode } from 'react';
import { TeamContextType, User } from '../types/team';
import { useTeamActions } from '../hooks/useTeamActions';
import { sampleUsers } from '../data/sampleData';

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Provider component
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const teamActions = useTeamActions();
  const [users] = React.useState<User[]>(sampleUsers);
  const [currentUser] = React.useState<User>(sampleUsers[0]); // Default to admin user

  return (
    <TeamContext.Provider
      value={{
        currentUser,
        users,
        ...teamActions
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
