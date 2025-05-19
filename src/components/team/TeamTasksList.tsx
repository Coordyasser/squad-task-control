
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/team';

interface TeamTasksListProps {
  teamTasks: Task[];
}

const TeamTasksList: React.FC<TeamTasksListProps> = ({ teamTasks }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas</CardTitle>
        <CardDescription>
          Esta equipe tem {teamTasks.length} {teamTasks.length === 1 ? 'tarefa' : 'tarefas'} atribuídas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teamTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.status === 'done' ? 'default' : 
                      task.status === 'in-progress' ? 'secondary' : 
                      'outline'
                    }>
                      {task.status === 'todo' ? 'A fazer' : 
                      task.status === 'in-progress' ? 'Em progresso' : 
                      task.status === 'review' ? 'Em revisão' : 'Concluída'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' : 
                      task.priority === 'medium' ? 'secondary' : 
                      'outline'
                    }>
                      {task.priority === 'high' ? 'Alta' : 
                      task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Nenhuma tarefa atribuída a esta equipe ainda</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-3">
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamTasksList;
