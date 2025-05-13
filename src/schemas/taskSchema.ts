
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, {
    message: "Título deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "Descrição deve ter pelo menos 10 caracteres",
  }),
  assigneeId: z.string().min(1, {
    message: "Selecione um usuário",
  }),
  teamId: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
