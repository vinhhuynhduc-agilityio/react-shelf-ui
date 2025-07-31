import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// stores
import { useSearchFilterStore, useSearchStore, useUserStore } from "@/stores";

// constants
import { profileOptions, ROUTE, searchOptions } from "@/constants";

// components
import { Avatar, Dropdown, IconButton } from "@/components";
import { FilterDropdownIcon, SearchIconFilled } from "@/components/icons";

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
  const selectedFilter = useSearchFilterStore((state) => state.selectedFilter);
  const setSelectedFilter = useSearchFilterStore(
    (state) => state.setSelectedFilter
  );
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
    setFilterMenuOpen(false);
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
    setFilterMenuOpen(false);
    setValueSearch(e.target.value);
  };

  const handleProfileMenuSelection = (option: DropdownOption) => {
    if (option.key === "logout") {
      logout();
      navigate(ROUTE.LOGIN);
    } else {
      // Check if current path matches the option key
      if (location.pathname === `/${option.key}`) {
        setProfileMenuOpen(false);
        return;
      }
      navigate(`/${option.key}`);
    }

    setProfileMenuOpen(false);
  };

  const profileLabel = (
    <span className="hidden sm:inline-block truncate">
      {currentUser?.fullName || "Guest"}
    </span>
  );

  const handleShowFilterMenu = () => {
    setFilterMenuOpen((prev) => !prev);
  };

  const handleShowProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  return (
    <header className="flex justify-between items-center p-6 relative">
      {/* Search Bar */}
      <div
        className="relative flex items-center bg-white border border-gray-300 rounded-full h-[40px] w-full max-w-[280px] sm:max-w-[300px] md:max-w-[450px] overflow-hidden"
        ref={filterButtonRef}
      >
        <IconButton
          icon={FilterDropdownIcon}
          iconPosition="right"
          label={selectedFilter}
          dataTestId="filter-btn"
          onClick={handleShowFilterMenu}
          additionalClasses="px-2 py-2 bg-[#F5F5F5] text-black border-r flex items-center gap-2 flex-shrink-0"
          ariaLabel="Filter dropdown"
        />
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
          id="search-input"
          placeholder="Search"
          className="px-2 py-2 flex-grow focus:outline-none focus:ring-0 w-0 min-w-[60px]"
          value={valueSearch}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          icon={SearchIconFilled}
          onClick={handleSearch}
          additionalClasses="px-2 py-2 flex-shrink-0 min-w-[40px]"
          ariaLabel="Search"
        />
      </div>
      {/* User Profile */}
      <div
        className="relative flex items-center justify-between bg-white border border-gray-300 rounded-full overflow-hidden h-[40px] px-2 w-auto sm:max-w-[150px] md:min-w-[150px]"
        ref={profileButtonRef}
      >
        <Avatar
          src={currentUser?.avatarUrl}
          size="small"
          additionalClasses="ml-[-5px]"
        />
        <IconButton
          icon={FilterDropdownIcon}
          label={profileLabel}
          iconPosition="right"
          onClick={handleShowProfileMenu}
          additionalClasses="flex items-center gap-1 px-2 max-w-[90px] sm:max-w-[120px] md:max-w-[120px] truncate overflow-hidden"
          classNameIcon="ml-1 flex-shrink-0"
          dataTestId="profile-btn"
        />
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
