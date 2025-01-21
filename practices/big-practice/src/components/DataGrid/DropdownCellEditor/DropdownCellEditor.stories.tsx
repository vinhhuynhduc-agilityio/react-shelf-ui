import type { Meta, StoryObj } from '@storybook/react';
import { CustomCellEditorParams, DropdownCellEditor } from '@/components/DataGrid/DropdownCellEditor';
import { Column } from 'ag-grid-community';

const mockOptions = [
  {
    "id": "list-01",
    "fullName": "Joe Bloggs",
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
  },
  {
    "id": "list-02",
    "fullName": "Jane Smith",
    "avatarUrl": "https://i.pravatar.cc/150?img=2",
  },
  {
    "id": "list-03",
    "fullName": "Alice Brown",
    "avatarUrl": "https://i.pravatar.cc/150?img=3",
  }
];

const mockData = {
  "id": "task-01",
  "userId": "list-01",
  "fullName": "Joe Bloggs",
};

type Data = {
  id: number;
  name: string;
  currency: string;
  fullName: string;
};

type UserData = {
  id: string;
  fullName: string;
  avatarUrl: string;
};

const meta: Meta<typeof DropdownCellEditor> = {
  title: 'components/DropdownCellEditor',
  component: DropdownCellEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The DropdownCellEditor component provides a dropdown menu for editing cells within the ag-Grid. It allows users to select an option from a predefined list of values, making it easy to update cell content with consistent and standardized options. This is particularly useful for fields such as user assignments, project selection.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '290px',
        }}
      >
        <Story />
      </div>
    )
  ],
  argTypes: {
    options: {
      description: 'An array of options to display in the dropdown.',
      control: 'object',
    },
    displayKey: {
      description: 'The key used to display the option values in the dropdown.',
      control: 'text',
    },
    onSelectOption: {
      description: 'Callback function that gets triggered when an option is selected.',
      action: 'selected',
    },
    data: {
      description: 'The current row data for the cell being edited.',
      control: 'object',
    },
    column: {
      description: 'The column details for the cell being edited.',
      control: 'object',
    },
    eGridCell: {
      description: 'The DOM element for the cell being edited.',
      control: 'object',
    },
    stopEditing: {
      description: 'Function to stop editing the current cell.',
      action: 'editing stopped',
    },
    showAvatar: {
      description: 'Determines whether avatars are displayed alongside options.',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<CustomCellEditorParams<UserData, Data>>;

export const List: Story = {
  args: {
    options: mockOptions,
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
  },
};

export const ListWithAvatars: Story = {
  args: {
    options: mockOptions,
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
    showAvatar: true,
  },
};

export const WithoutAvatars: Story = {
  args: {
    options: mockOptions,
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
    showAvatar: false,
  },
};
