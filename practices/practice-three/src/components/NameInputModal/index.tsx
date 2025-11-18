import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

// components
import { Button, Modal } from "@/components";

// types
import type { FormData } from "@/types";

interface NameInputModalProps {
  isOpen: boolean;
  mode: "add" | "rename";
  addType?: "addFolder" | "addFile" | null;
  isDisabled?: boolean;

  // react-hook-form
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

export const NameInputModal = ({
  isOpen,
  mode,
  addType,
  isDisabled = false,
  control,
  errors,
  handleSubmit,
  onSubmit,
  onClose,
}: NameInputModalProps) => {
  const isAdd = mode === "add";
  const placeholder = isAdd
    ? addType === "addFolder"
      ? "Enter folder name"
      : "Enter file name"
    : "Enter new name";

  return (
    <Modal isOpen={isOpen} title="Enter a new name" onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-[6px]"
      >
        <div className="flex items-center">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="flex-1 border-b border-[#1CA1C1] px-4 py-1 text-[14px] text-[#475466] focus:outline-none mr-4"
                placeholder={placeholder}
                autoFocus
                disabled={isDisabled}
              />
            )}
          />
          <Button
            variant="primary"
            type="submit"
            className="w-[96px] h-[32px]"
            disabled={!!errors.name || isDisabled}
          >
            {isAdd ? "Add" : "Rename"}
          </Button>
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
        )}
      </form>
    </Modal>
  );
};
