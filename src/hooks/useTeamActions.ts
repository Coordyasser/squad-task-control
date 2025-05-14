import { useState, useEffect } from 'react';
import { Task, Team, TaskStatus, TaskPriority, User } from '../types/team';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTeamActions() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
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

      setTeams(formattedTeams);
      setUsers(formattedUsers);
      setTasks(formattedTasks);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao buscar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
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

      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Erro ao criar tarefa",
        description: error.message || "Ocorreu um erro ao criar a tarefa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message || "Ocorreu um erro ao atualizar o status da tarefa.",
        variant: "destructive"
      });
    }
  };

  const createTeam = async (team: Omit<Team, 'id' | 'createdAt'>) => {
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

      setTeams([...teams, newTeam]);
      return newTeam;
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Erro ao criar equipe",
        description: error.message || "Ocorreu um erro ao criar a equipe.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addUserToTeam = async (teamId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId
        });

      if (error) throw error;

      setTeams(
        teams.map((team) =>
          team.id === teamId && !team.members.includes(userId)
            ? { ...team, members: [...team.members, userId] }
            : team
        )
      );
    } catch (error: any) {
      console.error('Error adding user to team:', error);
      toast({
        title: "Erro ao adicionar membro",
        description: error.message || "Ocorreu um erro ao adicionar o membro à equipe.",
        variant: "destructive"
      });
    }
  };

  return {
    teams,
    tasks,
    users,
    selectedTeam,
    isLoading,
    setSelectedTeam,
    addTask,
    updateTaskStatus,
    createTeam,
    addUserToTeam,
    refreshData: fetchData
  };
}
