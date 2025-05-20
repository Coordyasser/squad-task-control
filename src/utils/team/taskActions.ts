
import { Task, TaskStatus, TaskPriority } from '@/types/team';
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction } from '@/hooks/use-toast';

export async function addTask(
  task: Omit<Task, 'id' | 'createdAt'>,
  toast: ToastFunction
): Promise<Task | undefined> {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dueDate = task.dueDate ? task.dueDate.toISOString() : null;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        assignee_id: task.assigneeId,
        team_id: task.teamId,
        status: task.status,
        priority: task.priority,
        created_by: task.createdBy,
        due_date: dueDate
      })
      .select()
      .single();

    if (error) throw error;

    const newTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      assigneeId: data.assignee_id,
      teamId: data.team_id,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      dueDate: data.due_date ? new Date(data.due_date) : undefined
    };

    return newTask;
  } catch (error: any) {
    console.error('Error adding task:', error);
    toast({
      title: "Erro ao criar tarefa",
      description: error.message || "Ocorreu um erro ao criar a tarefa.",
      variant: "destructive"
    });
    return undefined;
  }
}

export async function updateTaskStatus(
  taskId: string, 
  status: TaskStatus,
  toast: ToastFunction
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating task status:', error);
    toast({
      title: "Erro ao atualizar tarefa",
      description: error.message || "Ocorreu um erro ao atualizar o status da tarefa.",
      variant: "destructive"
    });
    return false;
  }
}
