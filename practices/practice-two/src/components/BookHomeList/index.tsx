// components
import { ApiErrorNotice, BookItem, Skeleton } from "@/components";
import { ERROR_MESSAGE } from "@/constants";

// types
import { Book } from "@/types";

interface BookListProps {
	books: Book[];
	title: string;
	isLoading?: boolean;
	isError?: boolean;
	errorMessage?: string;
	skeletonCount?: number;
}

const BookHomeList: React.FC<BookListProps> = ({
	books,
	title,
	isLoading = false,
	isError = false,
	errorMessage = ERROR_MESSAGE.DEFAULT,
	skeletonCount = 4,
}) => {
	return (
		<div className="mb-6 w-full">
			<h2 className="text-[22px] sm:text-[24px] md:text-[25px] text-gray-500 mb-4 font-normal">
				{title}
			</h2>
			<div className="w-full md:overflow-x-auto sm:overflow-x-auto md:whitespace-nowrap">
				<div className="grid grid-cols-2 gap-y-4 md:flex md:space-x-4 sm:flex sm:space-x-4">
					{isError ? (
						<ApiErrorNotice
							title="Failed to load books data"
							errors={[errorMessage]}
						/>
					) : isLoading ? (
						Array.from({ length: skeletonCount }).map((_, idx) => (
							<div key={idx} className="flex-shrink-0">
								<Skeleton
									width={160}
									height={260}
									borderRadius={16}
									className="p-4"
								/>
							</div>
						))
					) : books.length > 0 ? (
						books.map((book) => (
							<div key={book.id} className="flex-shrink-0">
								<BookItem {...book} />
							</div>
						))
					) : (
						<p className="mt-4 text-gray-600 col-span-full">
							No books available.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookHomeList;
