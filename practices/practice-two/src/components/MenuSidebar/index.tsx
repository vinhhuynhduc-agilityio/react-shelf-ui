import { Link } from "react-router-dom";

// constants
import { menuItems } from "@/constants";

const MenuSidebar = () => {
  return (
    <aside className="bg-[#F5F5F5] w-16 lg:min-w-[12rem] d:max-w-[12rem] px-2 lg:px-6 pt-12 lg:pt-24 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img
          src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
          alt="Book Shelf Logo"
          className="w-[80px] lg:w-[120px] h-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-3 lg:gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className="flex w-full items-center justify-center lg:justify-start text-gray-700 hover:text-black px-2 py-2 lg:py-3 rounded-lg hover:bg-gray-200 transition"
          >
            {item.icon}
            <span className="text-base font-medium hidden lg:block ml-2">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default MenuSidebar;
