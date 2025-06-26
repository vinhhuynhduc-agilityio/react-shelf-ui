import clsx from "clsx";
import { Link } from "react-router-dom";

// constants
import { menuItems, ROUTE } from "@/constants";

// stores
import { useProcessingStore, useSearchStore } from "@/stores";

const MenuSidebar = () => {
	// stores
	const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
	const setSearchFromSidebar = useSearchStore(
		(state) => state.setSearchFromSidebar
	);
	const setValueSearch = useSearchStore((state) => state.setValueSearch);
	const isProcessing = useProcessingStore((state) => state.isProcessing);

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
				<Link
					to={ROUTE.HOME}
					onClick={(e) => {
						if (isProcessing) {
							e.preventDefault();
							return;
						}
					}}
				>
					<img
						src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
						alt="Book Shelf Logo"
						className={clsx(
							"w-[80px] lg:w-[120px] h-auto",
							isProcessing && "opacity-50 cursor-not-allowed"
						)}
					/>
				</Link>
			</div>

			{/* Menu Items */}
			<nav className="flex flex-col gap-3 lg:gap-2">
				{menuItems.map((item) => (
					<Link
						key={item.key}
						to={item.path}
						className={clsx(
							"flex w-full items-center justify-center lg:justify-start text-gray-700 hover:text-black px-2 py-2 lg:py-3 rounded-lg hover:bg-gray-200 transition",
							isProcessing &&
								"cursor-not-allowed text-gray-400 hover:bg-transparent"
						)}
						onClick={(e) => {
							if (isProcessing) {
								e.preventDefault();
								return;
							}
							handleMenuItemClick(item.key);
						}}
					>
						{item.icon}
						<span className="text-base font-medium hidden lg:block ml-2">
							{item.label}
						</span>
					</Link>
				))}
			</nav>
		</aside>
	);
};

export default MenuSidebar;
