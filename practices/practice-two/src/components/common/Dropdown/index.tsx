import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// types
import { DropdownOption } from "@/types";

interface DropdownProps {
	options: DropdownOption[];
	onSelect: (option: DropdownOption) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLElement>;
	align?: "left" | "right";
}

type DropdownPosition = { top: number; left?: number; right?: number };

const Dropdown: React.FC<DropdownProps> = ({
	options,
	isOpen,
	triggerRef,
	align = "left",
	onSelect,
	setIsOpen,
}) => {
	const dropdownRef = useRef<HTMLUListElement>(null);
	const [position, setPosition] = useState<DropdownPosition | null>(null);

	useEffect(() => {
		// Handle click outside to close dropdown
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		// Update position based on trigger button (fixed to viewport, not affected by scroll)
		const updatePosition = () => {
			if (triggerRef.current) {
				const rect = triggerRef.current.getBoundingClientRect();
				const viewportWidth = document.documentElement.clientWidth;
				const scrollX = window.scrollX || window.pageXOffset;
				const scrollY = window.scrollY || window.pageYOffset;
				const dropdownPosition =
					align === "right"
						? { right: viewportWidth - rect.right + scrollX }
						: { left: rect.left + scrollX };

				setPosition({
					top: rect.bottom + scrollY,
					...dropdownPosition,
				});
			}
		};

		if (isOpen) {
			updatePosition();
		}

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, true);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
		};
	}, [isOpen, setIsOpen, triggerRef, align]);

	if (!isOpen || !position) return null;

	return createPortal(
		<ul
			ref={dropdownRef}
			className="absolute bg-white shadow-md border border-gray-300 rounded-md z-50"
			style={{
				position: "absolute",
				top: `${position.top}px`,
				...(align === "right"
					? { right: `${position.right}px` }
					: { left: `${position.left}px` }),
			}}
			role="listbox"
			data-testid="dropdown-listbox"
		>
			{options.map((option) => (
				<li
					key={option.key}
					className="px-3 py-2 text-black hover:bg-gray-100 cursor-pointer"
					onClick={() => {
						onSelect(option);
						setIsOpen(false);
					}}
				>
					{option.label}
				</li>
			))}
		</ul>,
		document.body
	);
};

export default Dropdown;
