import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./index";

// Simple UI stories
const meta: Meta<typeof Skeleton> = {
	title: "Components/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
	argTypes: {
		width: { control: "number" },
		height: { control: "number" },
		borderRadius: { control: "number" },
		variant: { control: "radio", options: ["block", "inline-block"] },
		className: { control: "text" },
	},
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
	args: {
		width: 100,
		height: 20,
		borderRadius: 4,
		variant: "block",
		dataTestId: "skeleton",
	},
};

export const Inline: Story = {
	args: {
		width: 80,
		height: 18,
		borderRadius: 4,
		variant: "inline-block",
		dataTestId: "skeleton-inline",
	},
};

export const CustomClass: Story = {
	args: {
		width: 120,
		height: 40,
		borderRadius: 8,
		className: "bg-blue-200",
		dataTestId: "skeleton-custom",
	},
};

// MyShelfBookCardSkeleton style
export const MyShelfBookCardSkeletonDemo: Story = {
	render: () => (
		<div className="flex items-center bg-white rounded-lg shadow-md p-4 w-[308px] h-[260px]">
			<div className="w-3/5">
				<div className="flex flex-col items-start space-y-2">
					<Skeleton width={100} height={140} borderRadius={6} />
					<Skeleton width={80} height={18} borderRadius={4} />
					<Skeleton width={80} height={18} borderRadius={4} />
					<Skeleton width={80} height={18} borderRadius={4} />
				</div>
			</div>
			<div className="w-2/5 flex flex-col justify-between items-center h-full ml-2">
				<div className="space-y-2">
					<Skeleton width={80} height={16} borderRadius={4} />
					<Skeleton width={60} height={12} borderRadius={4} />
				</div>
				<Skeleton width={80} height={25} borderRadius={6} />
			</div>
		</div>
	),
	name: "MyShelfBookCardSkeleton",
};

// BookRowSkeleton style
export const BookRowSkeletonDemo: Story = {
	render: () => (
		<div className="overflow-x-auto text-[#4D4D4D]">
			<div className="space-y-4 mt-4">
				{Array.from({ length: 2 }).map((_, index) => (
					<div
						key={index}
						className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] gap-4 p-4 border border-gray-200 rounded-[10px] shadow-sm bg-white items-center"
					>
						<div className="flex items-center space-x-3">
							<Skeleton width={75} height={99} borderRadius={6} />
							<div className="flex flex-col space-y-2">
								<Skeleton width={160} height={20} borderRadius={4} />
								<Skeleton width={120} height={16} borderRadius={4} />
							</div>
						</div>
						<Skeleton width={40} height={16} borderRadius={4} />
						<Skeleton width={60} height={16} borderRadius={4} />
						<Skeleton width={60} height={28} borderRadius={6} />
						<Skeleton width={20} height={18} borderRadius={4} />
						<Skeleton width={80} height={34} borderRadius={6} />
					</div>
				))}
			</div>
		</div>
	),
	name: "BookRowSkeleton",
};
