import React, { memo } from "react";
import clsx from "clsx";
import { BreadcrumbItem } from "@/types";

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (folderId: string) => void;
  currentFolderId: string;
  breadcrumbStyles?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = memo(
  ({ path, onNavigate, currentFolderId, breadcrumbStyles = "" }) => {
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
                    "text-[#475466] hover:text-primary transition-colors cursor-pointer text-base font-normal",
                    "focus:outline-none focus:underline"
                  )}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </button>
              ) : (
                <span
                  className="text-[#475466] text-base font-normal"
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
  }
);

export default Breadcrumb;
