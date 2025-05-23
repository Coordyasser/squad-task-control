
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { useTeam } from '@/contexts/TeamContext';
import { useToast } from '@/hooks/use-toast';
import { TaskFormValues, taskSchema } from '@/schemas/taskSchema';
import { TaskTitleSection } from '@/components/task/TaskTitleSection';
import { TaskAssignmentSection } from '@/components/task/TaskAssignmentSection';
import { TaskDetailsSection } from '@/components/task/TaskDetailsSection';
import { TaskActionButtons } from '@/components/task/TaskActionButtons';

const TaskForm = () => {
  const { currentUser, users = [], teams = [], addTask } = useTeam();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Make sure currentUser exists before accessing it
  const userId = currentUser?.id || '';

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: userId,
      status: 'todo',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    // Make sure currentUser exists before accessing it
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar tarefas",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert date string to Date object if present
      const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
      
      // Ensure all required fields are included
      await addTask({
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        status: data.status,
        priority: data.priority,
        teamId: data.teamId,
        createdBy: currentUser.id,
        dueDate,
      });

      toast({
        title: "Tarefa criada com sucesso",
        description: "A tarefa foi adicionada ao quadro kanban",
      });
      
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro ao criar tarefa",
        description: "Ocorreu um erro ao criar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // If user is null, show loading state
  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6 gradient-heading">Nova Tarefa</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TaskTitleSection control={form.control} />
          <TaskAssignmentSection control={form.control} users={users} teams={teams} />
          <TaskDetailsSection control={form.control} />
          <TaskActionButtons isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
