import { Layout } from "react-grid-layout";

// Constant
import { STATUS_TO_COLUMN } from "@/constant";

// Types
import { KanbanColumn, KanbanItem } from "@/types";

export const generateLayout = (kanbans: KanbanItem[]): Layout[] => {
  return kanbans.map((item) => ({
    i: item.id,
    x: STATUS_TO_COLUMN[item.progressStatus],
    y: item.order,
    w: 1,
    h: 1,
  }));
};

export const updateKanbanItems = (
  prevKanbans: KanbanItem[],
  editingItem: KanbanItem,
  formData: KanbanColumn
): KanbanItem[] => {
  let newKanbans = [...prevKanbans];
  const oldStatus = editingItem.progressStatus;
  const newStatus = formData.progressStatus;
  const oldOrder = editingItem.order;

  if (oldStatus !== newStatus) {
    // Adjust orders in old column: decrease orders of items below the moved item
    newKanbans = newKanbans.map((item) => {
      if (
        item.progressStatus === oldStatus &&
        item.id !== editingItem.id &&
        item.order > oldOrder
      ) {
        return { ...item, order: item.order - 1 };
      }
      return item;
    });

    // Calculate new order in new column: max order + 1
    const newColumnItems = newKanbans.filter(
      (item) => item.progressStatus === newStatus
    );
    const maxOrderInNewColumn =
      newColumnItems.length > 0
        ? Math.max(...newColumnItems.map((item) => item.order))
        : -1;
    const newOrder = maxOrderInNewColumn + 1;

    // Update the item with new status and order
    const updatedItemWithOrder = {
      ...editingItem,
      ...formData,
      order: newOrder,
    };
    newKanbans = newKanbans.map((item) =>
      item.id === updatedItemWithOrder.id ? updatedItemWithOrder : item
    );
  } else {
    // If status not changed, just update other fields
    const updatedItem = { ...editingItem, ...formData };
    newKanbans = newKanbans.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
  }

  return newKanbans;
};
