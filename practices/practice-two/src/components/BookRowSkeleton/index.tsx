import { HeaderRow, Skeleton } from "@/components";

export const BookRowSkeleton: React.FC = () => {
	return (
		<div
			className="overflow-x-auto text-[#4D4D4D]"
			data-testid="book-row-skeleton"
		>
			{/* Header */}
			<HeaderRow />

			{/* Skeleton Rows */}
			<div className="space-y-4 mt-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] lg:grid-cols-[280px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_88px_28px_auto] grid-cols-[95px_80px_30px_auto] gap-4 p-4 border border-gray-200 rounded-[10px] shadow-sm bg-white items-center sm:grid-cols-[95px_80px_90px_30px_auto]"
					>
						<div className="flex items-center space-x-3">
							<Skeleton width={75} height={99} borderRadius={6} />
							<div className="hidden lg:flex flex-col space-y-2">
								<Skeleton width={160} height={20} borderRadius={4} />
								<Skeleton width={120} height={16} borderRadius={4} />
							</div>
						</div>

						{/* Rating */}
						<div className="hidden md:block">
							<Skeleton width={40} height={16} borderRadius={4} />
						</div>

						{/* Category */}
						<div className="hidden sm:block">
							<Skeleton width={60} height={16} borderRadius={4} />
						</div>

						{/* Status badge */}
						<div>
							<Skeleton width={60} height={28} borderRadius={6} />
						</div>

						{/* Heart icon */}
						<div>
							<Skeleton width={20} height={18} borderRadius={4} />
						</div>

						{/* Preview button */}
						<div>
							<Skeleton width={80} height={34} borderRadius={6} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
