
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface EmptyTeamStateProps {
  onCreateTeam: () => void;
}

const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ onCreateTeam }) => {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Nenhuma equipe encontrada</CardTitle>
        <CardDescription>
          Não existem equipes criadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Clique no botão "Nova Equipe" para começar a criar equipes
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Primeira Equipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyTeamState;
