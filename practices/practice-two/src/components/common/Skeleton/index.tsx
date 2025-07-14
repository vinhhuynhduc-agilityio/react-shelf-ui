import clsx from "clsx";

type Variant = "block" | "inline-block";

interface SkeletonProps {
	variant?: Variant;
	width?: number | string;
	height?: number | string;
	borderRadius?: number | string;
	className?: string;
	dataTestId?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
	variant = "block",
	width,
	height,
	borderRadius,
	className = "",
	dataTestId,
}) => {
	const style: React.CSSProperties = {
		width,
		height,
		borderRadius,
	};

	return (
		<span
			className={clsx(
				"relative overflow-hidden bg-gray-200 animate-pulse",
				variant === "block" ? "block" : "inline-block",
				className
			)}
			style={style}
			data-testid={dataTestId}
		>
			<span
				className={clsx(
					"absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
				)}
			/>
		</span>
	);
};
export default Skeleton;
