import type { BorderStyle, Worksheet } from "exceljs";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

// types
import {
  FortuneSheetCell,
  FortuneSheetConfig,
  FortuneSheetData,
  FortuneSheetRow,
} from "@/types";

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

/**
 * Apply the entire style of a FortuneSheet cell to the ExcelJS cell
 */
export const applyFortuneSheetCellToExcel = (
  excelCell: ExcelJS.Cell,
  cell: FortuneSheetCell
) => {
  // Use the displayed value (m) if present, otherwise fall back to raw value (v)
  // Convert v to string when needed – Excel accepts string | number
  excelCell.value =
    cell.m ?? ((cell.v != null ? String(cell.v) : "") as string | number);

  // === RICH TEXT & BASIC FORMATTING ===
  // Use cell.ct.s for per-character formatting (bold, italic, color, etc.)
  // Fallback to cell-level properties (bl, it, fc, etc.) when rich text is not present
  if (cell.ct && cell.ct.s) {
    const richText = cell.ct.s.map((segment) => ({
      text: segment.v,
      font: {
        bold: segment.bl === 1,
        italic: segment.it === 1,
        underline: segment.un === 1,
        strike: segment.cl === 1,
        size: segment.fs || 10,
        name: cell.ff || "Times New Roman",
        color: {
          argb: colorToArgb(segment.fc),
        },
      },
    }));
    excelCell.value = { richText };
  } else {
    // Fallback for cells without rich text
    const updatedFont = {
      ...(excelCell.font || {}),
      ...(cell.bl === 1 && { bold: true }),
      ...(cell.it === 1 && { italic: true }),
      ...(cell.un === 1 && { underline: true }),
      ...(cell.cl === 1 && { strike: true }),
      ...{ size: cell.fs || 10 },
      ...{ name: cell.ff ?? "Times New Roman" },
      ...(cell.fc && {
        color: {
          argb: colorToArgb(cell.fc),
        },
      }),
    };

    if (Object.keys(updatedFont).length > 0) {
      excelCell.font = updatedFont;
    }
  }

  // === CELL BACKGROUND (FILL) ===
  if (cell.bg) {
    excelCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colorToArgb(cell.bg) },
    };
  }

  // === CELL ALIGNMENT ===
  const updatedAlignment = {
    ...(excelCell.alignment || {}),
    ...(cell.ht && {
      horizontal: (["center", "left", "right"] as const)[cell.ht],
    }),
    ...(cell.vt && {
      vertical: (["middle", "top", "bottom"] as const)[Number(cell.vt)],
    }),
    // Text control
    ...(cell.tb === "2" && { wrapText: true }),
  };

  if (Object.keys(updatedAlignment).length > 0) {
    excelCell.alignment = updatedAlignment;
  }
};

//  Export a single FortuneSheet to a real .xlsx file
export const exportToXLSX = async (sheet: FortuneSheetData) => {
  // Create a new Excel workbook in memory
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet – use the original sheet name if available
  const ws = workbook.addWorksheet(sheet.name || "Sheet1");

  sheet.data.forEach((row: FortuneSheetRow, rowIndex: number) => {
    if (!Array.isArray(row)) return;

    row.forEach((cell: FortuneSheetCell | null, colIndex: number) => {
      if (!cell) return;

      const excelCell = ws.getCell(rowIndex + 1, colIndex + 1);
      applyFortuneSheetCellToExcel(excelCell, cell);
    });
  });

  // Apply all borders in one clean call
  applyBordersFromConfig(ws, sheet.config, colorToArgb);

  // Convert the entire workbook to a binary buffer (the actual .xlsx file)
  const buffer = await workbook.xlsx.writeBuffer();

  // Wrap the buffer in a Blob with correct MIME type
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Trigger browser download with a nice filename
  saveAs(blob, "spreadsheet.xlsx");
};
