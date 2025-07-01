import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// stores
import { useFilterStore, useSearchStore, useUserStore } from "@/stores";

// constants
import { profileOptions, ROUTE, searchOptions } from "@/constants";

// components
import { Avatar, Dropdown } from "@/components";

// hooks
import { useCurrentUser } from "@/hooks";

// types
import { DropdownOption } from "@/types";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// stores
	const currentUser = useCurrentUser();
	const logout = useUserStore((state) => state.logout);
	const selectedFilter = useFilterStore((state) => state.selectedFilter);
	const setSelectedFilter = useFilterStore((state) => state.setSelectedFilter);
	const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
	const searchTerm = useSearchStore((state) => state.searchTerm);
	const setSearchFromSidebar = useSearchStore(
		(state) => state.setSearchFromSidebar
	);
	const valueSearch = useSearchStore((state) => state.valueSearch);
	const setValueSearch = useSearchStore((state) => state.setValueSearch);

	// states
	const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
	const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

	// Create triggerRef for filter and profile buttons
	const filterButtonRef = useRef(null);
	const profileButtonRef = useRef(null);

	// Reset searchTerm and valueSearch when changing pages
	useEffect(() => {
		if (
			location.pathname !== ROUTE.SEARCH &&
			!location.pathname.includes(ROUTE.BOOK_PREVIEW)
		) {
			setSearchTerm("");
			setValueSearch("");
		}
	}, [location.pathname, setSearchTerm, setValueSearch]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") return;

		handleSearch();
	};

	const handleSearch = () => {
		const trimmedValue = valueSearch.trim();

		if (!trimmedValue || trimmedValue === searchTerm) return;

		// Navigate to SearchPage if not already there
		if (location.pathname !== ROUTE.SEARCH) {
			navigate(ROUTE.SEARCH);
		}

		setSearchFromSidebar(false);
		setSearchTerm(trimmedValue);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValueSearch(e.target.value);
	};

	const handleProfileMenuSelection = (option: DropdownOption) => {
		if (option.key === "logout") {
			logout();
			navigate(ROUTE.LOGIN);
		} else {
			navigate(`/${option.key}`);
		}

		setProfileMenuOpen(false);
	};

	return (
		<header className="flex justify-between items-center p-6 relative">
			{/* Search Bar */}
			<div
				className="relative flex items-center bg-white border border-gray-300 rounded-full h-[40px] w-full max-w-[280px] sm:max-w-[300px] md:max-w-[450px] overflow-hidden"
				ref={filterButtonRef}
			>
				<button
					onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
					className="px-2 py-2 bg-[#F5F5F5] text-black border-r flex items-center gap-2 flex-shrink-0"
				>
					{selectedFilter}
					<svg
						width="13"
						height="7"
						viewBox="0 0 13 7"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7.17585 6.38027C6.79349 6.73088 6.20651 6.73088 5.82415 6.38027L1.03312 1.98704C0.360988 1.37072 0.797034 0.25 1.70896 0.25L11.291 0.25C12.203 0.25 12.639 1.37072 11.9669 1.98704L7.17585 6.38027Z"
							fill="#4D4D4D"
						/>
					</svg>
				</button>

				{/* Dropdown for search filter */}
				<Dropdown
					options={searchOptions}
					onSelect={(option) => {
						setSelectedFilter(option.label);
						setFilterMenuOpen(false);
					}}
					isOpen={isFilterMenuOpen}
					setIsOpen={setFilterMenuOpen}
					triggerRef={filterButtonRef}
				/>

				<input
					type="text"
					placeholder="Search"
					className="px-2 py-2 flex-grow focus:outline-none focus:ring-0 w-0 min-w-[60px]"
					value={valueSearch}
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="px-2 py-2 flex-shrink-0 min-w-[40px]"
					onClick={handleSearch}
				>
					<svg
						width="17"
						height="17"
						viewBox="0 0 17 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.02 11.5C3.17395 12.6556 4.71064 13.3493 6.34058 13.4505C7.97053 13.5516 9.5812 13.0532 10.8692 12.0492L15.3008 16.4809C15.458 16.6327 15.6685 16.7167 15.887 16.7148C16.1055 16.7129 16.3145 16.6252 16.469 16.4707C16.6235 16.3162 16.7112 16.1072 16.7131 15.8887C16.715 15.6702 16.631 15.4597 16.4792 15.3025L12.0475 10.8709C13.0961 9.52516 13.5918 7.83015 13.4337 6.1315C13.2755 4.43285 12.4753 2.85852 11.1962 1.72958C9.91721 0.600637 8.2557 0.0021199 6.55055 0.0560913C4.84541 0.110063 3.22507 0.812457 2.02 2.02003C1.39733 2.64238 0.903385 3.38132 0.566381 4.19462C0.229377 5.00793 0.0559206 5.87966 0.0559206 6.76003C0.0559206 7.64039 0.229377 8.51213 0.566381 9.32543C0.903385 10.1387 1.39733 10.8777 2.02 11.5ZM3.19833 3.20003C4.02214 2.37623 5.1061 1.86356 6.26552 1.74936C7.42494 1.63515 8.5881 1.92648 9.5568 2.57371C10.5255 3.22094 11.2398 4.18402 11.5781 5.29887C11.9163 6.41372 11.8576 7.61136 11.4118 8.68774C10.966 9.76412 10.1609 10.6526 9.13344 11.2019C8.10602 11.7512 6.91994 11.9273 5.77727 11.7001C4.6346 11.473 3.60604 10.8566 2.86683 9.95614C2.12762 9.05566 1.72351 7.92672 1.72333 6.76169C1.72105 6.09967 1.85025 5.44379 2.10346 4.83209C2.35666 4.2204 2.72882 3.66508 3.19833 3.19836V3.20003Z"
							fill="#F76B56"
						/>
					</svg>
				</button>
			</div>

			{/* User Profile */}
			<div
				className="relative flex items-center justify-between bg-white border border-gray-300 rounded-full overflow-hidden h-[40px] px-2 w-auto sm:max-w-[150px] md:min-w-[150px]"
				ref={profileButtonRef}
			>
				<Avatar
					src={currentUser?.avatarUrl}
					size="small"
					className="ml-[-5px]"
				/>
				<button
					onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
					className="flex items-center gap-1 px-2 max-w-[90px] sm:max-w-[120px] md:max-w-[120px] truncate overflow-hidden"
				>
					<span className="hidden sm:block truncate">
						{currentUser?.fullName || "Guest"}
					</span>
					<svg
						className="ml-1 flex-shrink-0"
						width="13"
						height="7"
						viewBox="0 0 13 7"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7.17585 6.38027C6.79349 6.73088 6.20651 6.73088 5.82415 6.38027L1.03312 1.98704C0.360988 1.37072 0.797034 0.25 1.70896 0.25L11.291 0.25C12.203 0.25 12.639 1.37072 11.9669 1.98704L7.17585 6.38027Z"
							fill="#4D4D4D"
						/>
					</svg>
				</button>

				{/* Dropdown for Profile Menu */}
				<Dropdown
					options={profileOptions}
					onSelect={handleProfileMenuSelection}
					isOpen={isProfileMenuOpen}
					setIsOpen={setProfileMenuOpen}
					triggerRef={profileButtonRef}
					align="right"
				/>
			</div>
		</header>
	);
};

export default Header;
