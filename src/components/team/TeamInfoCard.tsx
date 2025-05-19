
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { format } from 'date-fns';
import { Team, User } from '@/types/team';

interface TeamInfoCardProps {
  team: Team;
  teamCreator: User | undefined;
  teamMembers: User[];
  teamTasks: any[];
}

const TeamInfoCard: React.FC<TeamInfoCardProps> = ({ 
  team, 
  teamCreator, 
  teamMembers, 
  teamTasks 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Criado por:</span>
            <span className="font-medium">{teamCreator?.name || 'Desconhecido'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data de criação:</span>
            <span className="font-medium">{format(new Date(team.createdAt), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de membros:</span>
            <span className="font-medium">{teamMembers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de tarefas:</span>
            <span className="font-medium">{teamTasks.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamInfoCard;
