const DEFAULT_AVATAR = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' fill='%23C4C4C4'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='white'>No Avatar</text></svg>";

const searchOptions = [
  { label: "Title", key: "title" },
  { label: "Author", key: "author" },
  { label: "Subjects", key: "subjects" },
];
const profileOptions = [
  { label: "Profile", key: "profile" },
  { label: "Favourite", key: "favourite" },
  { label: "Logout", key: "logout" }
];

export {
  searchOptions,
  profileOptions,
  DEFAULT_AVATAR
};
