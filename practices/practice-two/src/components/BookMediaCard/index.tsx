//components
import { ActionIcon } from "@/components";
import { NotesIcon, ReviewIcon, ShareIcon } from "@/components/icons";

export const BookMediaCard = ({
	imageUrl,
	title,
}: {
	imageUrl: string;
	title: string;
}) => (
	<div className="flex flex-col items-center bg-white rounded-lg md:w-[273px] md:h-[405px] mr-14 sm:w-[243px] sm:h-[385px] w-[233px] h-[365px] mb-8">
		<img
			src={imageUrl}
			alt={title}
			className="sm:w-[190px] sm:h-[280px] md:w-[209px] md:h-[277px] w-[170px] h-[260px] object-cover rounded-md shadow-lg mt-6"
		/>
		<div className="flex items-center space-x-6 mt-4">
			<ActionIcon icon={<ReviewIcon />} label="Review" />
			<ActionIcon icon={<NotesIcon />} label="Notes" />
			<ActionIcon icon={<ShareIcon />} label="Share" />
		</div>
	</div>
);
