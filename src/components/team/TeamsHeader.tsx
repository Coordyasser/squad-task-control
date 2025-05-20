
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface TeamsHeaderProps {
  onCreateTeam: () => void;
  showCreateButton: boolean;
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({ onCreateTeam, showCreateButton }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 gradient-heading">Equipes</h1>
        <p className="text-muted-foreground">
          Gerenciamento de equipes e membros
        </p>
      </div>

      {showCreateButton && (
        <Button onClick={onCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Equipe
        </Button>
      )}
    </div>
  );
};

export default TeamsHeader;
