
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  teamDescription: string;
  setTeamDescription: (description: string) => void;
  onCreateTeam: () => void;
}

const NewTeamDialog: React.FC<NewTeamDialogProps> = ({
  isOpen,
  onOpenChange,
  teamName,
  setTeamName,
  teamDescription,
  setTeamDescription,
  onCreateTeam
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Equipe</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar uma nova equipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Equipe</Label>
            <Input 
              id="name" 
              placeholder="Digite o nome da equipe" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              placeholder="Digite uma descrição para a equipe" 
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onCreateTeam}>Criar Equipe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamDialog;
