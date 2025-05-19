
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { Team, User } from '@/types/team';

interface TeamCardProps {
  team: Team;
  teamMembers: User[];
  teamCreator?: User;
  onAddMember: (teamId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  teamMembers, 
  teamCreator, 
  onAddMember 
}) => {
  const navigate = useNavigate();

  return (
    <Card key={team.id} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-team-blue/10 to-team-purple/10">
        <div className="flex justify-between items-start">
          <CardTitle>{team.name}</CardTitle>
          <Badge variant="secondary">
            {teamMembers.length} {teamMembers.length === 1 ? 'membro' : 'membros'}
          </Badge>
        </div>
        <CardDescription>
          {team.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Membros</h4>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => (
                <Avatar key={member.id} className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                </Avatar>
              ))}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => onAddMember(team.id)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <span>
              Criado por {teamCreator?.name || 'Desconhecido'} em {format(new Date(team.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate(`/teams/${team.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
