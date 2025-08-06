import { Link, useLocation } from "react-router-dom";

// assets
import logo from "@/assets/images/logo.webp";

// constants
import { ROUTE } from "@/constants";

// stores
import { useSearchStore } from "@/stores";

// components
import { HomeIcon, SearchIcon, ShelfIcon } from "@/components/icons";

export interface MenuItem {
  key: string;
  label: string;
  icon: (props: { fill: string }) => JSX.Element;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: "home",
    label: "Home",
    icon: (props) => <HomeIcon {...props} />,
    path: ROUTE.HOME,
  },
  {
    key: "search",
    label: "Search",
    icon: (props) => <SearchIcon {...props} />,
    path: ROUTE.SEARCH,
  },
  {
    key: "shelf",
    label: "My Shelf",
    icon: (props) => <ShelfIcon {...props} />,
    path: ROUTE.MY_SHELF,
  },
];

const MenuSidebar = () => {
  const { pathname } = useLocation();

  // stores
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const setValueSearch = useSearchStore((state) => state.setValueSearch);

  // Menu item click handler
  const handleMenuItemClick = (key: string) => {
    if (key === "search") {
      setSearchTerm("");
    }

    setValueSearch("");
  };

  return (
    <aside className="bg-[#F5F5F5] w-16 lg:min-w-[12rem] d:max-w-[12rem] px-2 lg:px-6 pt-12 lg:pt-24 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <Link to={ROUTE.HOME}>
          <img
            src={logo}
            alt="Book Shelf Logo"
            width={120}
            height={74}
            className="w-[80px] lg:w-[120px] h-auto"
          />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-3 lg:gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const iconColor = isActive ? "#4D4D4D" : "#8A8A8A";

          return (
            <Link
              key={item.key}
              to={item.path}
              aria-label={item.label}
              className={`flex w-full items-center justify-center lg:justify-start px-2 py-2 lg:py-3 rounded-lg transition hover:text-black hover:bg-gray-200 ${
                isActive ? "text-[#4D4D4D]" : "text-[#8A8A8A]"
              }`}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  return;
                }
                handleMenuItemClick(item.key);
              }}
            >
              <span className="flex-shrink-0">
                {item.icon({ fill: iconColor })}
              </span>
              <span className="text-base font-medium hidden lg:block ml-2">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default MenuSidebar;
