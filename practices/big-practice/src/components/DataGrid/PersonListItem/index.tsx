import { ICellRendererParams } from "ag-grid-community";

// types
import { UserData } from "@/types";

// component
import { Avatar } from "@/components";

export const PersonListItem = (params: ICellRendererParams<UserData>) => {
  if (!params.data) {
    return null;
  }

  const { avatarUrl, fullName, earnings } = params.data;
  return (
    <div
      className="flex items-center py-2"
      data-testid="person-list-item"
      aria-label={fullName}
    >
      <Avatar
        src={avatarUrl}
        alt="User Avatar"
        size="medium"
      />
      <div className="flex flex-col ml-4">
        <div className="text-base font-medium text-[#313131]">{fullName}</div>
        <div className="text-base font-normal text-[#475466]">{earnings}</div>
      </div>
    </div>
  );
};
