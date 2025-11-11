import React from "react";
import clsx from "clsx";
import { BreadcrumbItem } from "@/types";

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (folderId: string) => void;
  currentFolderId: string;
  breadcrumbStyles?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
  currentFolderId,
  breadcrumbStyles = "",
}) => {
  return (
    <nav
      className={`flex items-center space-x-1 whitespace-nowrap ${breadcrumbStyles}`}
      aria-label="Breadcrumb"
    >
      {path.map((item, index) => {
        const isLast = item.id === currentFolderId;
        const isClickable = !isLast;

        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <span className="text-[#94A1B3] mx-1" aria-hidden="true">
                {">"}
              </span>
            )}
            {isClickable ? (
              <button
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  "text-[#475466] hover:text-[#1CA1C1] transition-colors cursor-pointer text-[16px] font-normal",
                  "focus:outline-none focus:underline"
                )}
              >
                {item.name}
              </button>
            ) : (
              <span
                className="text-[#475466] text-[16px] font-normal"
                aria-current="page"
              >
                {item.name}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
