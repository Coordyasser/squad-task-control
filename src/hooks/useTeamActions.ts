
import { useState } from 'react';
import { Task, Team, TaskStatus } from '../types/team';
import { sampleTeams, sampleTasks } from '../data/sampleData';

export function useTeamActions() {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task${tasks.length + 1}`,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const createTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: `team${teams.length + 1}`,
      createdAt: new Date(),
    };
    setTeams([...teams, newTeam]);
  };

  const addUserToTeam = (teamId: string, userId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId && !team.members.includes(userId)
          ? { ...team, members: [...team.members, userId] }
          : team
      )
    );
  };

  return {
    teams,
    tasks,
    selectedTeam,
    setSelectedTeam,
    addTask,
    updateTaskStatus,
    createTeam,
    addUserToTeam,
  };
}
