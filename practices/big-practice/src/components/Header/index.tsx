import React, { memo } from 'react';

// component
import { Button } from '@/components/common';

interface HeaderProps {
  onAddUser: () => void;
  onAddProject: () => void;
  onAddTask: () => void;
  isLoading: boolean;
  isSavingUser: boolean;
  isSavingTask: boolean;
  isSavingProject: boolean;
};

export const Header: React.FC<HeaderProps> = memo(
  ({
    onAddUser,
    onAddProject,
    onAddTask,
    isLoading,
    isSavingUser,
    isSavingTask,
    isSavingProject
  }) => {
    const isDisable = isLoading ||
      isSavingUser ||
      isSavingTask ||
      isSavingProject;

    return (
      <header className=" bg-white flex flex-row py-2 px-3 items-center border border-customBorder">
        <div className="flex flex-row items-center w-[16.5rem]">
          <img
            src="/assets/logo.webp"
            alt="Logo"
            className="h-12 w-12 mr-2"
          />
          <h1 className="text-xl font-medium text-[#475466]">
            Team Progress
          </h1>
        </div>
        <Button
          label="Add a user"
          onClick={onAddUser}
          disabled={isDisable}
        />
        <Button
          label="Add a task"
          onClick={onAddTask}
          disabled={isDisable}
        />
        <Button
          label="Add a project"
          onClick={onAddProject}
          disabled={isDisable}
        />
      </header>
    );
  }
);
