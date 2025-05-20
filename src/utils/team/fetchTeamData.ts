
import { Team, Task, User } from '@/types/team';
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction } from '@/hooks/use-toast';

// Types for the response data
interface FetchTeamDataResponse {
  teams: Team[];
  users: User[];
  tasks: Task[];
}

export async function fetchTeamData(toast: ToastFunction): Promise<FetchTeamDataResponse> {
  try {
    // Fetch teams
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*');
    
    if (teamsError) throw teamsError;
    
    // Fetch profiles (users)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;
    
    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*');
      
    if (tasksError) throw tasksError;
    
    // Fetch team members
    const { data: teamMembersData, error: teamMembersError } = await supabase
      .from('team_members')
      .select('*');
      
    if (teamMembersError) throw teamMembersError;

    // Transform data to match our app's types
    const formattedTeams = teamsData.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      members: teamMembersData
        .filter((member: any) => member.team_id === team.id)
        .map((member: any) => member.user_id),
      createdBy: team.created_by,
      createdAt: new Date(team.created_at)
    }));

    const formattedUsers = profilesData.map((profile: any) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
    }));

    const formattedTasks = tasksData.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assigneeId: task.assignee_id,
      teamId: task.team_id,
      status: task.status,
      priority: task.priority,
      createdBy: task.created_by,
      createdAt: new Date(task.created_at),
      dueDate: task.due_date ? new Date(task.due_date) : undefined
    }));

    return {
      teams: formattedTeams,
      users: formattedUsers,
      tasks: formattedTasks
    };
  } catch (error: any) {
    console.error('Error fetching data:', error);
    toast({
      title: "Erro ao carregar dados",
      description: error.message || "Ocorreu um erro ao buscar os dados.",
      variant: "destructive"
    });
    return {
      teams: [],
      users: [],
      tasks: []
    };
  }
}
