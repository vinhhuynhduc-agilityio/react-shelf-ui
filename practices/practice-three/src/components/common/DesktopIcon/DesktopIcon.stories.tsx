import type { Meta, StoryObj } from "@storybook/react";
import { DesktopIcon } from "./index";
import { DESKTOP_ICONS } from "@/constant/window";

const meta: Meta<typeof DesktopIcon> = {
  title: "Components/DesktopIcon",
  component: DesktopIcon,
  parameters: {
    docs: {
      description: {
        component:
          "DesktopIcon renders a desktop shortcut with an image and label. Click (mouseDown) triggers onIconClick with the provided key.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "linear-gradient(180deg, #0b1220 0%, #071025 100%)",
          padding: 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    image: DESKTOP_ICONS[0].image,
    title: DESKTOP_ICONS[0].title,
    keyIcon: DESKTOP_ICONS[0].key,
    isSelected: false,
    onIconClick: () => {},
  },
  argTypes: {
    image: { control: false, description: "Icon image src" },
    title: { control: "text", description: "Icon title/label" },
    keyIcon: { control: false, description: "Unique key for the icon" },
    isSelected: { control: "boolean", description: "Selected state" },
    onIconClick: { action: "onIconClick", table: { disable: true } },
  },
};
export default meta;
type Story = StoryObj<typeof DesktopIcon>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: { story: "Default desktop icon state." },
    },
  },
};

export const Selected: Story = {
  args: { isSelected: true },
  parameters: {
    docs: {
      description: { story: "Selected state applies highlight styles." },
    },
  },
};

export const Custom: Story = {
  args: {
    image: "/images/kanban.png",
    title: "Kanban",
    keyIcon: DESKTOP_ICONS[3].key,
  },
  parameters: {
    docs: {
      description: { story: "Example using a different image/title/key." },
    },
  },
};
