import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from ".";
import { useRef, useState } from "react";

const meta: Meta<typeof Dropdown> = {
	title: "Components/Dropdown",
	component: Dropdown,
	tags: ["autodocs"],
	argTypes: {
		options: { control: false },
		isOpen: { control: false },
		setIsOpen: { control: false },
		triggerRef: { control: false },
		align: {
			control: { type: "select" },
			options: ["left", "right"],
		},
		onSelect: { action: "selected" },
	},
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">{Story()}</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

const options = [
	{ key: "1", label: "Option 1" },
	{ key: "2", label: "Option 2" },
	{ key: "3", label: "Option 3" },
];

import type { DropdownOption } from "@/types";

interface DropdownDemoProps {
	align?: "left" | "right";
	onSelect?: (option: DropdownOption) => void;
}

const DropdownDemo = (props: DropdownDemoProps) => {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div style={{ position: "relative", height: 120 }}>
			<button
				ref={triggerRef}
				onClick={() => setIsOpen((v) => !v)}
				className="mb-2 px-5 py-2 border border-gray-300 rounded-md bg-blue-600 text-white font-medium shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2"
			>
				Toggle Dropdown
			</button>
			<Dropdown
				options={options}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				triggerRef={triggerRef}
				align={props.align}
				onSelect={props.onSelect || (() => {})}
			/>
		</div>
	);
};

export const Default: Story = {
	render: (args) => <DropdownDemo {...args} />,
};

export const AlignRight: Story = {
	render: (args) => <DropdownDemo {...args} align="right" />,
};
