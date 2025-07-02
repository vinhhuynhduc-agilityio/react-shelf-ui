const ActionIcon = ({
	icon,
	label,
}: {
	icon: React.ReactNode;
	label: string;
}) => (
	<div className="flex flex-col items-center justify-center cursor-pointer space-y-2 hover:bg-gray-100 p-2 rounded-lg transition-all">
		<div>{icon}</div>
		<div className="text-center md:text-[13px] font-bold text-[#333333] sm:text-[11px] text-[10px]">
			{label}
		</div>
	</div>
);

export default ActionIcon;
