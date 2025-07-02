import { Link, useLocation } from "react-router-dom";

// constants
import { menuItems, ROUTE } from "@/constants";

// stores
import { useSearchStore } from "@/stores";

const MenuSidebar = () => {
	const { pathname } = useLocation();

	// stores
	const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
	const setSearchFromSidebar = useSearchStore(
		(state) => state.setSearchFromSidebar
	);
	const setValueSearch = useSearchStore((state) => state.setValueSearch);

	// Menu item click handler
	const handleMenuItemClick = (key: string) => {
		if (key === "search") {
			setSearchFromSidebar(true);
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
						src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
						alt="Book Shelf Logo"
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
							className={`flex w-full items-center justify-center lg:justify-start px-2 py-2 lg:py-3 rounded-lg transition
                    ${isActive ? "text-[#4D4D4D]" : "text-[#8A8A8A]"}
                    hover:text-black hover:bg-gray-200
                `}
							onClick={() => handleMenuItemClick(item.key)}
						>
							<span className="flex-shrink-0">
								{typeof item.icon === "function"
									? item.icon({ fill: iconColor })
									: null}
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
