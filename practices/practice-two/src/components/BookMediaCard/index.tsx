//components
import { IconButton } from "@/components";
import { NotesIcon, ReviewIcon, ShareIcon } from "@/components/icons";
import { ICON_BUTTON_COLUMN_CLASS } from "@/constants";

// helpers
import { renderIconButtonLabel } from "@/helpers";
import { memo } from "react";

export const BookMediaCard = memo(
	({ imageUrl, title }: { imageUrl: string; title: string }) => (
		<div className="flex flex-col items-center bg-white rounded-lg md:w-[273px] md:h-[405px] mr-14 sm:w-[243px] sm:h-[385px] w-[233px] h-[365px] mb-8">
			<img
				src={imageUrl}
				alt={title}
				className="sm:w-[190px] sm:h-[280px] md:w-[209px] md:h-[277px] w-[170px] h-[260px] object-cover rounded-md shadow-lg mt-6"
			/>
			<div className="flex items-center space-x-6 mt-4">
				<IconButton
					icon={ReviewIcon}
					label={renderIconButtonLabel("Review")}
					direction="column"
					className={ICON_BUTTON_COLUMN_CLASS}
				/>
				<IconButton
					icon={NotesIcon}
					label={renderIconButtonLabel("Notes")}
					direction="column"
					className={ICON_BUTTON_COLUMN_CLASS}
				/>
				<IconButton
					icon={ShareIcon}
					label={renderIconButtonLabel("Share")}
					direction="column"
					className={ICON_BUTTON_COLUMN_CLASS}
				/>
			</div>
		</div>
	)
);
