
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Team, User } from '@/types/team';

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
  onAddMember: () => void;
  users: User[];
  teams: Team[];
  selectedTeam: string | null;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUserId,
  setSelectedUserId,
  onAddMember,
  users,
  teams,
  selectedTeam
}) => {
  const team = teams.find(t => t.id === selectedTeam);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Membro</DialogTitle>
          <DialogDescription>
            Selecione um usuário para adicionar à equipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="member">Usuário</Label>
            <select 
              id="member"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Selecione um usuário</option>
              {users
                .filter(user => {
                  // Don't show users already in the team
                  return team && !team.members.includes(user.id);
                })
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))
              }
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onAddMember}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
