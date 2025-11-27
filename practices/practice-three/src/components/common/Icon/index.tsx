import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconProps {
  icon: IconDefinition;
  className?: string;
  onClick?: () => void;
}

export const Icon = memo(({ icon, className, onClick }: IconProps) => {
  return (
    <FontAwesomeIcon icon={icon} className={className} onClick={onClick} />
  );
});
