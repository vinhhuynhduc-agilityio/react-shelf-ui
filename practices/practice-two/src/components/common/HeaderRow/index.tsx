import { memo } from "react";

const HeaderRow: React.FC = memo(() => {
	return (
		<div className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] lg:grid-cols-[280px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_88px_28px_auto] grid-cols-[95px_80px_30px_auto] gap-4 p-4 sm:grid-cols-[95px_80px_90px_30px_auto]">
			<div className="font-medium text-left">Title</div>
			<div className="font-medium text-left hidden md:block">Ratings</div>
			<div className="font-medium text-left hidden sm:block">Category</div>
			<div className="font-medium text-left">Status</div>
			<div className="font-medium text-center"></div>
			<div className="font-medium text-center"></div>
		</div>
	);
});

export default HeaderRow;
