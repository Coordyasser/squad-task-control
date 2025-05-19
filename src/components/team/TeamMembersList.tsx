
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { User, Team } from '@/types/team';

interface TeamMembersListProps {
  team: Team;
  teamMembers: User[];
  onAddMember: () => void;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  team, 
  teamMembers, 
  onAddMember 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros</CardTitle>
        <CardDescription>
          Esta equipe tem {teamMembers.length} {teamMembers.length === 1 ? 'membro' : 'membros'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map(member => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.id === team.createdBy ? "default" : "outline"}>
                    {member.id === team.createdBy ? 'Criador' : 'Membro'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-3">
        <Button variant="outline" onClick={onAddMember}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMembersList;
