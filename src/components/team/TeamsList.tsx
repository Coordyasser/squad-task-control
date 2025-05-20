
import React from 'react';
import { Team, User } from '@/types/team';
import TeamCard from './TeamCard';
import EmptyTeamState from './EmptyTeamState';
import { Skeleton } from "@/components/ui/skeleton";

interface TeamsListProps {
  teams: Team[];
  users: User[];
  isLoading?: boolean;
  onAddMember: (teamId: string) => void;
  onCreateTeam: () => void;
}

const TeamsList: React.FC<TeamsListProps> = ({ 
  teams, 
  users, 
  isLoading = false,
  onAddMember,
  onCreateTeam
}) => {
  // Mostrar loading skeletons quando estiver carregando
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl" />
        ))}
      </div>
    );
  }

  // Mostrar estado vazio quando não houver equipes
  if (!Array.isArray(teams) || teams.length === 0) {
    return <EmptyTeamState onCreateTeam={onCreateTeam} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map(team => {
        // Garantir que temos dados válidos antes de renderizar
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
            onAddMember={onAddMember}
          />
        );
      })}
    </div>
  );
};

export default TeamsList;
