
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Team } from '@/types/team';

interface TeamHeaderProps {
  team: Team;
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team, onAddMember }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/teams')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">{team.name}</h1>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
      </div>
      
      <Button onClick={onAddMember}>
        <UserPlus className="mr-2 h-4 w-4" />
        Adicionar Membro
      </Button>
    </div>
  );
};

export default TeamHeader;
