import { memo, useCallback } from "react";

// Components
import { Icon, IconButton } from "@/components";

// Icons
import { fa } from "@/icons/fa";

interface KanbanCardProps {
  task: {
    id: string;
    title: string;
    tags: string[];
  };
  onEdit: (id: string) => void;
}

export const KanbanCard = memo(({ task, onEdit }: KanbanCardProps) => {
  const handleEdit = useCallback(() => {
    onEdit(task.id);
  }, [task.id, onEdit]);

  return (
    <>
      <div className="flex justify-between items-center min-h-[24px] overflow-hidden pt-[14px] pr-[8px] pb-[8px] pl-[12px] w-full">
        <p className="flex-1 min-w-0 text-[14px] font-medium leading-[20px] truncate pr-[48px]">
          {task.title}
        </p>
        <div className="flex justify-center items-center w-[32px] h-[32px] absolute right-[8px] hover:shadow-[0_0_2px_1px_#1CA1C1] bg-[rgba(228,230,240,0.8)] rounded-full">
          <Icon icon={fa.faUser} className="fa-lg text-[#94a1b3]" />
        </div>
      </div>
      <div className="flex justify-between pl-[8px] pr-[8px] mb-[6px] items-center truncate">
        <div className="flex items-center gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(228,230,240,0.8)] text-[#475466] text-sm font-normal h-[26px] leading-[24px] px-2 py-0 rounded-[12px] mt-0 mr-1 mb-0.5 ml-0"
            >
              {tag}
            </span>
          ))}
        </div>
        <IconButton
          icon={fa.faPencil}
          onMouseDown={handleEdit}
          iconStyles="fa-xs text-[#94a1b3] hover:text-[#1CA1C1]"
          aria-label="Edit task"
        />
      </div>
    </>
  );
});
