import { FortuneSheetConfig } from "@/types";
import type { BorderStyle, Worksheet } from "exceljs";

export const colorToArgb = (color?: string): string => {
  if (!color) return "FF000000";

  const c = color.trim().toLowerCase();

  if (c.startsWith("rgb")) {
    const nums = c
      .slice(c.indexOf("(") + 1, c.indexOf(")"))
      .replace(/\s/g, "")
      .split(",")
      .slice(0, 3)
      .map((n) => parseInt(n, 10))
      .map((n) => n.toString(16).padStart(2, "0").toUpperCase())
      .join("");

    return "FF" + nums;
  }

  // Hex
  let hex = c.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  hex = hex.padEnd(6, "0").slice(0, 6);

  return "FF" + hex.toUpperCase();
};

const BORDER_STYLE: Record<string, BorderStyle> = {
  "1": "thin",
  "2": "hair",
  "3": "dotted",
  "4": "dashed",
  "5": "double",
  "6": "medium",
  "7": "mediumDashed",
  "8": "mediumDashDot",
  "9": "mediumDashDotDot",
  "10": "slantDashDot",
  "11": "thick",
} as const;

/**
 * Apply all borders from config.borderInfo to ExcelJS worksheet
 * Handles all cases: all/outside/inside/horizontal/vertical correctly
 */
export const applyBordersFromConfig = (
  ws: Worksheet,
  config: FortuneSheetConfig | undefined,
  colorToArgb: (color: string) => string
): void => {
  if (!config?.borderInfo || config.borderInfo.length === 0) return;

  for (const item of config.borderInfo) {
    const { borderType, style = "1", color = "#000000", range } = item;

    if (item.rangeType !== "range" || !range) continue;

    const excelStyle = BORDER_STYLE[style] ?? "thin";
    const argb = colorToArgb(color);
    const borderDef = { style: excelStyle, color: { argb } };

    for (const rg of range) {
      const startRow = rg.row[0];
      const endRow = rg.row[1];
      const startCol = rg.column[0];
      const endCol = rg.column[1];

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cell = ws.getCell(r + 1, c + 1);
          if (!cell.border) cell.border = {};

          // Full border
          if (borderType === "border-all" || borderType === "border-outside") {
            Object.assign(cell.border, {
              top: borderDef,
              left: borderDef,
              bottom: borderDef,
              right: borderDef,
            });
            continue;
          }

          // Inside grid lines
          if (borderType === "border-inside") {
            if (r > startRow) cell.border.top = borderDef;
            if (r < endRow) cell.border.bottom = borderDef;
            if (c > startCol) cell.border.left = borderDef;
            if (c < endCol) cell.border.right = borderDef;
            continue;
          }

          // Individual edges
          if (borderType.includes("top")) cell.border.top = borderDef;
          if (borderType.includes("bottom")) cell.border.bottom = borderDef;
          if (borderType.includes("left")) cell.border.left = borderDef;
          if (borderType.includes("right")) cell.border.right = borderDef;

          // Vertical lines between columns
          if (borderType === "border-vertical") {
            const isSingleColumn = startCol === endCol;
            const isNotLastColumn = c < endCol;
            if (isSingleColumn || isNotLastColumn) {
              cell.border.right = borderDef;
            }
          }

          // Horizontal lines between rows
          if (borderType === "border-horizontal") {
            const isSingleRow = startRow === endRow;
            const isNotLastRow = r < endRow;
            if (isSingleRow || isNotLastRow) {
              cell.border.bottom = borderDef;
            }
          }

          // Diagonal slash border
          if (borderType === "border-slash") {
            cell.border.diagonal = {
              style: excelStyle,
              color: { argb },
              up: false,
              down: true,
            };
          }
        }
      }
    }
  }
};
