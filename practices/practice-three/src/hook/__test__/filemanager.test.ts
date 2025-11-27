import {
  renderHook,
  waitFor,
  act,
  wrapper,
} from "@/components/Test/test-utils";
import {
  useFilemanagerQuery,
  useAddFileItem,
  useDebounce,
  useRenameFileItem,
  useDeleteFileItem,
} from "../filemanager";
import * as services from "@/services";
import type { FileItem } from "@/types";

jest.mock("@/services");

describe("useFilemanagerQuery", () => {
  const mockFiles: FileItem[] = [
    {
      id: "root",
      name: "My Files",
      type: "folder",
      size: null,
      parentId: null,
      imageUrl: "/images/folder-detail-placeholder.svg",
    },
    {
      id: "code",
      name: "Code",
      type: "folder",
      size: null,
      parentId: "root",
      imageUrl: "/images/folder-detail-placeholder.svg",
    },
    {
      id: "accordion_less",
      name: "accor11dion.less",
      type: "code",
      size: 2048,
      parentId: "code",
      imageUrl: "/images/code-placeholder-image.svg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches filemanager data and returns it", async () => {
    (services.getFilemanagerData as jest.Mock).mockResolvedValue(mockFiles);

    const { result } = renderHook(() => useFilemanagerQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockFiles);
    expect(services.getFilemanagerData).toHaveBeenCalledTimes(1);
  });
});

describe("useAddFileItem", () => {
  const newFile: FileItem = {
    id: "new-file",
    name: "new-file.txt",
    type: "text",
    size: 1024,
    parentId: "code",
    imageUrl: "/images/code-placeholder-image.svg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds file item successfully", async () => {
    (services.addFileItem as jest.Mock).mockResolvedValue(newFile);

    const { result } = renderHook(() => useAddFileItem(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync(newFile);
      expect(response).toEqual(newFile);
    });

    expect(services.addFileItem).toHaveBeenCalledWith(newFile);
    expect(services.addFileItem).toHaveBeenCalledTimes(1);
  });
});

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("debounces value with default delay", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 500),
      { initialProps: { value: "" }, wrapper }
    );

    expect(result.current).toBe("");

    rerender({ value: "search" });
    expect(result.current).toBe("");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("search");
  });

  it("updates debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "initial" }, wrapper }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("cancels previous timeout on value change", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 500),
      { initialProps: { value: "first" }, wrapper }
    );

    rerender({ value: "second" });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("first");

    rerender({ value: "third" });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("third");
  });
});

describe("useRenameFileItem", () => {
  const renamedFile: FileItem = {
    id: "accordion_less",
    name: "accordion-updated.less",
    type: "code",
    size: 2048,
    parentId: "code",
    imageUrl: "/images/code-placeholder-image.svg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renames file item successfully", async () => {
    (services.renameFileItem as jest.Mock).mockResolvedValue(renamedFile);

    const { result } = renderHook(() => useRenameFileItem(), { wrapper });

    const renamePayload = { id: "accordion_less", updatedItem: renamedFile };

    await act(async () => {
      const response = await result.current.mutateAsync(renamePayload);
      expect(response).toEqual(renamedFile);
    });

    expect(services.renameFileItem).toHaveBeenCalledWith(
      "accordion_less",
      renamedFile
    );
    expect(services.renameFileItem).toHaveBeenCalledTimes(1);
  });
});

describe("useDeleteFileItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes file item successfully", async () => {
    (services.deleteFileItem as jest.Mock).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useDeleteFileItem(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync("accordion_less");
      expect(response).toEqual({ success: true });
    });

    expect(services.deleteFileItem).toHaveBeenCalledWith("accordion_less");
    expect(services.deleteFileItem).toHaveBeenCalledTimes(1);
  });
});
