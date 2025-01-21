import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Modal } from '.';

// Wrapper component for Modal
const ModalWrapper: React.FC<{
  title: string;
  content: React.ReactNode;
}> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-full">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      {/* Render Modal if open */}
      {isOpen && (
        <Modal
          title={title}
          content={content}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Metadata for Storybook
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Modal component provides a customizable and accessible overlay modal. It displays a title, content, and a callback function to close the modal.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '710px',
          height: '220px',
          border: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      description: 'The title displayed in the modal header.',
      control: 'text',
    },
    content: {
      description: 'The content to be displayed inside the modal body.',
      control: 'object',
    },
    onClose: {
      description: 'Callback function triggered when the modal is closed.',
      action: 'closed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Default Modal Title',
    content: <p style={{ color: 'black' }}>This is the modal body content.</p>,
  },
};

export const CustomContent: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Custom Content Modal',
    content: (
      <div style={{ color: 'black' }}>
        <h3>Custom Header</h3>
        <p>Custom modal content goes here.</p>
      </div>
    ),
  },
};
