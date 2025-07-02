import { memo } from "react";
import clsx from "clsx";

type StatusBadgeProps = {
	status: "In-Shelf" | "None";
};

const StatusBadge: React.FC<StatusBadgeProps> = memo(({ status }) => {
	const statusStyles = {
		"In-Shelf": "bg-[#42BB4E] text-white",
		None: "bg-[#C7C7C7] text-white",
	};

	return (
		<span
			className={clsx(
				"inline-flex items-center justify-center rounded-[5px] text-sm font-normal lg:w-[85px] lg:h-[26px] lg:text-sm",
				"w-[70px] h-[22px] text-[12px]",
				statusStyles[status]
			)}
		>
			{status}
		</span>
	);
});

export default StatusBadge;
