
import { Team } from '@/types/team';
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction } from '@/hooks/use-toast';

export async function createTeam(
  team: Omit<Team, 'id' | 'createdAt'>,
  toast: ToastFunction
): Promise<Team | undefined> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        description: team.description,
        created_by: team.createdBy
      })
      .select()
      .single();

    if (error) throw error;

    // The team creator is automatically added as a team member via the trigger we created
    const newTeam: Team = {
      id: data.id,
      name: data.name,
      description: data.description,
      members: [team.createdBy], // Initial members includes the creator
      createdBy: data.created_by,
      createdAt: new Date(data.created_at)
    };

    return newTeam;
  } catch (error: any) {
    console.error('Error creating team:', error);
    toast({
      title: "Erro ao criar equipe",
      description: error.message || "Ocorreu um erro ao criar a equipe.",
      variant: "destructive"
    });
    return undefined;
  }
}

export async function addUserToTeam(
  teamId: string, 
  userId: string,
  toast: ToastFunction
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId
      });

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error adding user to team:', error);
    toast({
      title: "Erro ao adicionar membro",
      description: error.message || "Ocorreu um erro ao adicionar o membro à equipe.",
      variant: "destructive"
    });
    return false;
  }
}
