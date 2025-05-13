
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
  const { currentUser, users, teams, addTask } = useTeam();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: currentUser.id,
      status: 'todo',
      priority: 'medium',
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    // Convert date string to Date object if present
    const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    
    // Ensure all required fields are included
    addTask({
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
  };

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
