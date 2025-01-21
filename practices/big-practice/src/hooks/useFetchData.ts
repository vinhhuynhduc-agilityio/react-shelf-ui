import { useState, useEffect } from 'react';
import { fetchUsers } from '@/services/user';
import { fetchTasks } from '@/services/task';
import { fetchProjects } from '@/services/project';
import { UserData, TaskData, ProjectsData } from '@/types';

export const useFetchData = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [isLoading, setLoading] = useState(false);

  const processResult = <T>(
    result: { data: T[] | null; error: Error | null },
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    entityName: string
  ) => {
    if (result?.data) {
      setState(result.data);
    } else {
      console.error(`Failed to load ${entityName}:`, result.error);
      setState([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [userResult, taskResult, projectResult] = await Promise.all([
        fetchUsers(),
        fetchTasks(),
        fetchProjects(),
      ]);

      // Process each API response
      processResult(userResult, setUsers, "users");
      processResult(taskResult, setTasks, "tasks");
      processResult(projectResult, setProjects, "projects");

      setLoading(false);
    };

    fetchData();
  }, []);

  return { users, tasks, projects, isLoading, setUsers, setTasks, setProjects };
};
