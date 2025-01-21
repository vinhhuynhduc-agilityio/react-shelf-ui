import { TextField } from '@/components/TextField';
import { Meta, StoryObj } from '@storybook/react';
import { useForm, FieldValues, RegisterOptions } from 'react-hook-form';

// Metadata for the TextField component
const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: 'A reusable TextField component with support for form validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'The unique name identifier for the field, used for form handling.',
      control: false,
    },
    label: {
      description: 'The label text displayed next to or above the input field.',
      control: 'text',
    },
    type: {
      description: 'The type of input field (e.g., `text`, `password`, `email`).',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text displayed inside the input field when empty.',
      control: 'text',
    },
    register: {
      description: 'The `register` function from `react-hook-form`, used to register the field.',
      control: false,
    },
    validation: {
      description: 'Validation rules for the field, defined using `react-hook-form` options.',
      control: false,
    },
    vertical: {
      description: 'Determines if the layout should be vertical or horizontal.',
      control: 'boolean',
    },
    error: {
      description: 'Error message for the field, displayed when validation fails.',
      control: false,
    },
    labelWidth: {
      description: 'CSS class controlling the width of the label.',
      control: 'text',
    },
    withErrorMargin: {
      description: 'CSS class for the margin around the error message.',
      control: 'text',
    },
  },
};

export default meta;

// Define Story type
type Story = StoryObj<typeof TextField>;

// Helper component to mock the integration with react-hook-form
const FormWrapper = (props: {
  args: {
    name: string;
    label: string;
    placeholder?: string;
    labelWidth?: string;
    withErrorMargin?: string;
    validation?: RegisterOptions<FieldValues, string>;
    error?: string;
    vertical?: boolean;
  };
}) => {
  const { register, formState } = useForm<FieldValues>();

  return (
    <form className={`space-y-4 ${props.args.vertical ? 'flex flex-col' : ''}`}>
      <TextField
        {...props.args}
        register={register}
        error={formState.errors[props.args.name]?.message as string | undefined}
      />
    </form>
  );
};

// Default Story
export const Default: Story = {
  render: (args) => <FormWrapper args={args} />,
  args: {
    name: 'projectName',
    label: 'Project Name',
    placeholder: 'Enter project name',
    labelWidth: 'w-32',
    withErrorMargin: 'ml-32',
    validation: {
      required: 'Project name is required',
    },
    vertical: false,
  },
};

// Vertical Story
export const LabelAboveInput: Story = {
  render: (args) => <FormWrapper args={args} />,
  args: {
    name: 'projectName',
    label: 'Project Name',
    placeholder: 'Enter project name',
    labelWidth: 'w-32',
    withErrorMargin: '',
    validation: {
      required: 'Project name is required',
    },
    vertical: true,
  },
};
