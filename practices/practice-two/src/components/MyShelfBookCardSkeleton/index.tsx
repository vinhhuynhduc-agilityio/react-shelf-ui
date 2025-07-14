import { Skeleton } from "@/components";

export const MyShelfBookCardSkeleton: React.FC = () => {
	return (
		<div className="flex items-center bg-white rounded-lg shadow-md p-4 w-[308px] h-[260px]">
			{/* Book content side */}
			<div className="w-3/5">
				<div className="flex flex-col items-start space-y-2">
					<Skeleton width={100} height={140} borderRadius={6} />
					<Skeleton width={80} height={18} borderRadius={4} />
					<Skeleton width={80} height={18} borderRadius={4} />
					<Skeleton width={80} height={18} borderRadius={4} />
				</div>
			</div>

			{/* Right side */}
			<div className="w-2/5 flex flex-col justify-between items-center h-full ml-2">
				<div className="space-y-2">
					<Skeleton width={80} height={16} borderRadius={4} />
					<Skeleton width={60} height={12} borderRadius={4} />
				</div>
				<Skeleton width={80} height={25} borderRadius={6} />
			</div>
		</div>
	);
};
