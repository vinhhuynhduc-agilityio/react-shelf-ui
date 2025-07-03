import { Book } from "@/types";

export const MOCK_BOOKS: Book[] = [
	{
		id: "11",
		title: "Don't Make Me Think",
		author: {
			name: "Steve Krug",
			bio: "Steve Krug is a usability consultant who has more than 30 years of experience as a user advocate for companies like Apple, Netscape, AOL, Lexus, and others. Based in part on the success of his first book, Don't Make Me Think, he has become a highly sought-after speaker on usability design.",
		},
		category: "Computer Science",
		publishedYear: 2000,
		rating: 4.5,
		imageUrl:
			"https://i.postimg.cc/qvgQxTNW/4aa430788b3938ca7d778a99fe0ff1587c81c67e.jpg",
	},
	{
		id: "21",
		title: "The Design of Everyday Things",
		author: {
			name: "Don Norman",
			bio: "Don Norman is a usability consultant who has more than 30 years of experience as a user advocate for companies like Apple, Netscape, AOL, Lexus, and others. Based in part on the success of his first book, The Design of Everyday Things, he has become a highly sought-after speaker on usability design.",
		},
		category: "Computer Science",
		publishedYear: 1988,
		rating: 4.5,
		imageUrl:
			"https://i.postimg.cc/Mp16pvwY/cc2b60105e5d1b5aeba05608803badb375872868.jpg",
	},
];
