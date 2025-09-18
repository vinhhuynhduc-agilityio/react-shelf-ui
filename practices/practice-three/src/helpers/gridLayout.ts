import { Layout } from "react-grid-layout";

// This function rearranges the layout of grid items when the number of columns or rows changes.
// It ensures that no items overflow the grid boundaries by repositioning them to the next available space.
export const rearrangeLayoutOnResize = (
  layout: Layout[],
  newCols: number,
  newMaxRows: number
): Layout[] => {
  const newLayout = [...layout];

  for (let i = 0; i < newLayout.length; i++) {
    const icon = newLayout[i];

    const isOverflowRight = icon.x + icon.w > newCols;
    const isOverflowBottom = icon.y + icon.h > newMaxRows;
    if (isOverflowRight || isOverflowBottom) {
      let foundPosition = false;

      for (let newX = 0; newX < newCols && !foundPosition; newX++) {
        let newY = 0;

        while (newY < newMaxRows) {
          const isPositionOccupied = newLayout.some(
            (item) => item.x === newX && item.y === newY
          );

          if (!isPositionOccupied) {
            newLayout[i] = {
              ...icon,
              x: newX,
              y: newY,
            };
            foundPosition = true;
            break;
          }

          newY++;
        }
      }
    }
  }

  return newLayout;
};
