
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface TaskActionButtonsProps {
  isSubmitting?: boolean;
}

export const TaskActionButtons = ({ isSubmitting }: TaskActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-4">
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        Criar Tarefa
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/tasks')}
      >
        Cancelar
      </Button>
    </div>
  );
};
