// types
import { Book } from "@/types";

// components
import {
  Button,
  ParagraphMessage,
  RatingStars,
  StatusBadge,
} from "@/components";
import { CheckmarkIcon } from "@/components/icons";
import { parseAuthorAndYear } from "@/helpers";

export const BookDetailInfo = ({
  book,
  isInShelf,
  isPending,
  isFetching,
  availability,
  onBorrow,
}: {
  book: Book;
  isInShelf: boolean;
  isPending: boolean;
  isFetching: boolean;
  onBorrow: () => void;
  availability: string[];
}) => {
  const { authorName, publishedYear } = parseAuthorAndYear(book.authorAndYear);

  return (
    <div className="flex flex-col md:w-[433px] sm:w-[483px] w-[370px]">
      <h1 className="lg:text-[35px] md:text-[30px] sm:text-[25px] text-[20px] text-[#4D4D4D] overflow-hidden text-ellipsis line-clamp-2">
        {book.title}
      </h1>
      <h2 className="text-[15px] text-[#4D4D4D] mb-10">
        By <span className="underline">{authorName}</span>, {publishedYear}
      </h2>
      <div className="flex items-center mt-2 mb-4 space-x-6">
        <div className="flex items-center space-x-2">
          <RatingStars rating={book.rating} />
          <ParagraphMessage
            text={`${book.rating} Ratings`}
            className="text-[#4D4D4D] text-[14px] font-medium"
          />
        </div>
        <ParagraphMessage
          text="25 Current reading"
          className="text-[#4D4D4D] text-[14px] font-medium"
        />
        <ParagraphMessage
          text="119 Have read"
          className="text-[#4D4D4D] text-[14px] font-medium hidden lg:block"
        />
      </div>
      <div className="flex flex-row mt-4">
        <div className="mr-16">
          <h3 className="lg:text-[18px] md:text-[16px] font-medium mb-[4px] text-[#4D4D4D]">
            Availability:
          </h3>
          <ul className="space-y-2 lg:text-[14px] md:text-[13px]">
            {availability.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckmarkIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="lg:text-[18px] md:text-[16px] font-medium mb-[12px] text-[#4D4D4D]">
            Status
          </h3>
          <StatusBadge status={isInShelf ? "In-Shelf" : "None"} />
        </div>
      </div>
      <Button
        additionalClasses="mt-10 font-semibold"
        variant="primary"
        disabled={isInShelf || isPending || isFetching}
        onClick={onBorrow}
        label={isInShelf ? "Already in shelf" : "Borrow"}
      />
    </div>
  );
};
