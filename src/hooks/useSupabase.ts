
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Team, Task, TaskStatus } from '@/types/team';

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      return data.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
      }));
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTeams = async (): Promise<Team[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
        
      if (teamsError) throw teamsError;
      
      // Fetch team members
      const { data: teamMembersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');
        
      if (membersError) throw membersError;
      
      // Group members by team
      const membersByTeam: Record<string, string[]> = {};
      teamMembersData.forEach((member: any) => {
        if (!membersByTeam[member.team_id]) {
          membersByTeam[member.team_id] = [];
        }
        membersByTeam[member.team_id].push(member.user_id);
      });
      
      return teamsData.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        createdBy: team.created_by,
        createdAt: new Date(team.created_at),
        members: membersByTeam[team.id] || []
      }));
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTasks = async (): Promise<Task[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
        
      if (error) throw error;
      
      return data.map((task: any) => ({
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
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);
        
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getUsers,
    getTeams,
    getTasks,
    updateTaskStatus
  };
}
