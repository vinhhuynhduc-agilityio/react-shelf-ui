import React from 'react';
import { Modal } from '@/components/Modal';
import { TaskForm } from '@/components/Forms';
import { UserData, ProjectsData, TaskData, TaskFormValues } from '@/types';

interface TaskFormModalProps {
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
  users: UserData[];
  projects: ProjectsData[];
  tasks: TaskData[];
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  onClose,
  onSubmit,
  users,
  projects,
  tasks,
}) => {
  return (
    <Modal
      title="Add Task"
      onClose={onClose}
      content={
        <TaskForm
          onClose={onClose}
          onSubmit={onSubmit}
          users={users}
          projects={projects}
          tasks={tasks}
        />
      }
    />
  );
};

export default TaskFormModal;
