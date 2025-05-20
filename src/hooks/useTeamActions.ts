
import { useState, useEffect } from 'react';
import { Task, Team, TaskStatus, User } from '../types/team';
import { useToast, ToastFunction } from '@/hooks/use-toast';
import { fetchTeamData } from '@/utils/team/fetchTeamData';
import { addTask, updateTaskStatus } from '@/utils/team/taskActions';
import { createTeam, addUserToTeam } from '@/utils/team/teamActions';

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
      const data = await fetchTeamData(toast);
      setTeams(data.teams);
      setUsers(data.users);
      setTasks(data.tasks);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await addTask(task, toast);
    if (newTask) {
      setTasks([...tasks, newTask]);
    }
    return newTask;
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const success = await updateTaskStatus(taskId, status, toast);
    if (success) {
      setTasks(tasks.map((task) => task.id === taskId ? { ...task, status } : task));
    }
  };

  const handleCreateTeam = async (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam = await createTeam(team, toast);
    if (newTeam) {
      setTeams([...teams, newTeam]);
    }
    return newTeam;
  };

  const handleAddUserToTeam = async (teamId: string, userId: string) => {
    const success = await addUserToTeam(teamId, userId, toast);
    if (success) {
      setTeams(
        teams.map((team) =>
          team.id === teamId && !team.members.includes(userId)
            ? { ...team, members: [...team.members, userId] }
            : team
        )
      );
    }
  };

  return {
    teams,
    tasks,
    users,
    selectedTeam,
    isLoading,
    setSelectedTeam,
    addTask: handleAddTask,
    updateTaskStatus: handleUpdateTaskStatus,
    createTeam: handleCreateTeam,
    addUserToTeam: handleAddUserToTeam,
    refreshData: fetchData
  };
}
