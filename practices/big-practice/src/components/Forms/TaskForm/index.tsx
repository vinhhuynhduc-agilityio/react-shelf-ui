import { useForm, Controller } from 'react-hook-form';

// helpers
import { formatDropdownOptions, isTaskDuplicate } from './helpers';

// types
import { ProjectsData, TaskData, TaskFormValues, UserData } from '@/types';

// components
import { Button, Dropdown } from '@/components/common';
import { TextField } from '@/components';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
  users: UserData[];
  projects: ProjectsData[];
  tasks: TaskData[];
};

const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  onSubmit,
  users,
  projects,
  tasks
}) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TaskFormValues>();

  const onSubmitForm = (data: TaskFormValues) => {
    onSubmit(data);
  };

  const projectOptions = formatDropdownOptions(projects, 'projectName');
  const userOptions = formatDropdownOptions(users, 'fullName');

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-4"
      data-testid="task-form"
    >
      {/* Task Name */}
      <TextField
        name='taskName'
        label='Task Name'
        placeholder='Enter task name'
        register={register}
        vertical
        validation={{
          required: 'Task name is required',
          validate: {
            duplicate: (value) =>
              typeof value === 'string' && !isTaskDuplicate(tasks, value)
                ? true
                : 'Task name already exists',
          },
        }}
        error={errors.taskName?.message}
      />

      {/* Currency */}
      <TextField
        name='currency'
        label='Currency'
        type='text'
        placeholder='Enter currency'
        vertical
        register={register}
        validation={{
          required: 'Currency is required',
          pattern: {
            value: /^[1-9][0-9]*$/,
            message: 'Currency must be a number not starting with 0',
          },
        }}
        error={errors.currency?.message}
      />

      <div className="flex space-x-4">
        {/* Project Dropdown */}
        <div className="flex-1">
          <label className="text-gray-700 font-semibold mb-1">Project</label>
          <Controller
            name="project"
            control={control}
            rules={{
              required: 'Project is required',
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={projectOptions}
                placeholder="Select a project"
                onSelect={(selected) => field.onChange(selected)}
              />
            )}
          />
          {errors.project && (
            <p className="text-red-500 text-sm mt-1">
              {errors.project.message}
            </p>
          )}
        </div>

        {/* Assignee Dropdown */}
        <div className="flex-1">
          <label className="text-gray-700 font-semibold mb-1">Assignee</label>
          <Controller
            name="user"
            control={control}
            rules={{
              required: 'Assignee is required',
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={userOptions}
                placeholder="Select an assignee"
                onSelect={(selected) => field.onChange(selected)}
              />
            )}
          />
          {errors.user && (
            <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t pt-3">
        <Button
          type="button"
          onClick={onClose}
          label="Cancel"
          variant="secondary"
        />
        <Button type="submit" label="Save" variant="primary" />
      </div>
    </form>
  );
};

export default TaskForm;
