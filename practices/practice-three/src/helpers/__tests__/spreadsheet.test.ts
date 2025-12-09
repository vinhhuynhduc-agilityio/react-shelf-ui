import {
  colorToArgb,
  applyBordersFromConfig,
  applyFortuneSheetCellToExcel,
} from "../spreadsheet";
import type { FortuneSheetConfig, FortuneSheetCell } from "@/types";
import ExcelJS from "exceljs";

describe("spreadsheet helpers", () => {
  describe("colorToArgb", () => {
    it("should return default black color when color is undefined", () => {
      expect(colorToArgb()).toBe("FF000000");
    });

    it("should return default black color when color is empty string", () => {
      expect(colorToArgb("")).toBe("FF000000");
    });

    it("should convert hex color #RRGGBB to ARGB format", () => {
      expect(colorToArgb("#FF0000")).toBe("FFFF0000");
      expect(colorToArgb("#00FF00")).toBe("FF00FF00");
      expect(colorToArgb("#0000FF")).toBe("FF0000FF");
    });

    it("should handle lowercase hex colors", () => {
      expect(colorToArgb("#ff0000")).toBe("FFFF0000");
      expect(colorToArgb("#abc123")).toBe("FFABC123");
    });

    it("should convert short hex #RGB to ARGB", () => {
      expect(colorToArgb("#F00")).toBe("FFFF0000");
      expect(colorToArgb("#0F0")).toBe("FF00FF00");
      expect(colorToArgb("#00F")).toBe("FF0000FF");
    });

    it("should handle hex without # symbol", () => {
      expect(colorToArgb("FF0000")).toBe("FFFF0000");
      expect(colorToArgb("abc")).toBe("FFAABBCC");
    });

    it("should convert RGB color to ARGB", () => {
      expect(colorToArgb("rgb(255, 0, 0)")).toBe("FFFF0000");
      expect(colorToArgb("rgb(0, 255, 0)")).toBe("FF00FF00");
      expect(colorToArgb("rgb(0, 0, 255)")).toBe("FF0000FF");
    });

    it("should convert RGB with spaces to ARGB", () => {
      expect(colorToArgb("rgb( 255 , 0 , 0 )")).toBe("FFFF0000");
    });

    it("should ignore alpha channel in rgba", () => {
      expect(colorToArgb("rgba(255, 0, 0, 0.5)")).toBe("FFFF0000");
    });

    it("should handle rgb with decimal values", () => {
      expect(colorToArgb("rgb(255.5, 0, 0)")).toBe("FFFF0000");
    });

    it("should handle black color in hex and rgb", () => {
      expect(colorToArgb("#000000")).toBe("FF000000");
      expect(colorToArgb("rgb(0, 0, 0)")).toBe("FF000000");
    });

    it("should handle white color in hex and rgb", () => {
      expect(colorToArgb("#FFFFFF")).toBe("FFFFFFFF");
      expect(colorToArgb("rgb(255, 255, 255)")).toBe("FFFFFFFF");
    });

    it("should trim whitespace from color string", () => {
      expect(colorToArgb("  #FF0000  ")).toBe("FFFF0000");
    });
  });

  describe("applyBordersFromConfig", () => {
    let worksheet: ExcelJS.Worksheet;
    let workbook: ExcelJS.Workbook;

    beforeEach(() => {
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet("test");
    });

    it("should not apply borders when config is undefined", () => {
      const cell = worksheet.getCell(1, 1);
      applyBordersFromConfig(worksheet, undefined, colorToArgb);

      expect(cell.border).toBeUndefined();
    });

    it("should not apply borders when borderInfo is empty", () => {
      const config: FortuneSheetConfig = { borderInfo: [] };
      const cell = worksheet.getCell(1, 1);
      applyBordersFromConfig(worksheet, config, colorToArgb);

      expect(cell.border).toBeUndefined();
    });

    it("should apply border-all to single cell", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.top).toBeDefined();
      expect(cell.border?.bottom).toBeDefined();
      expect(cell.border?.left).toBeDefined();
      expect(cell.border?.right).toBeDefined();
    });

    it("should apply border to range of cells", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "1",
            color: "#FF0000",
            range: [{ row: [0, 1], column: [0, 1] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell1 = worksheet.getCell(1, 1);
      const cell2 = worksheet.getCell(2, 2);
      expect(cell1.border?.top).toBeDefined();
      expect(cell2.border?.right).toBeDefined();
    });

    it("should apply border-top only", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-top",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.top).toBeDefined();
      expect(cell.border?.bottom).toBeUndefined();
      expect(cell.border?.left).toBeUndefined();
      expect(cell.border?.right).toBeUndefined();
    });

    it("should apply border-horizontal between rows", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-horizontal",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 2], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell1 = worksheet.getCell(1, 1);
      const cell2 = worksheet.getCell(2, 1);
      const cell3 = worksheet.getCell(3, 1);

      expect(cell1.border?.bottom).toBeDefined();
      expect(cell2.border?.bottom).toBeDefined();
      expect(cell3.border?.bottom).toBeUndefined();
    });

    it("should apply border-vertical between columns", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-vertical",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 2] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell1 = worksheet.getCell(1, 1);
      const cell2 = worksheet.getCell(1, 2);
      const cell3 = worksheet.getCell(1, 3);

      expect(cell1.border?.right).toBeDefined();
      expect(cell2.border?.right).toBeDefined();
      expect(cell3.border?.right).toBeUndefined();
    });

    it("should apply border-slash diagonal", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-slash",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.diagonal).toBeDefined();
      expect(cell.border?.diagonal?.down).toBe(true);
    });

    it("should use default style when style is undefined", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.top?.style).toBe("thin");
    });

    it("should convert color from config using colorToArgb", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "1",
            color: "#FF0000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.top?.color?.argb).toBe("FFFF0000");
    });

    it("should skip borders with rangeType not equal to range", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "cell",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border).toBeUndefined();
    });

    it("should apply multiple border configs to same worksheet", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-top",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
          {
            borderType: "border-bottom",
            style: "1",
            color: "#FF0000",
            range: [{ row: [1, 1], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell1 = worksheet.getCell(1, 1);
      const cell2 = worksheet.getCell(2, 1);

      expect(cell1.border?.top).toBeDefined();
      expect(cell2.border?.bottom).toBeDefined();
    });
  });

  describe("applyFortuneSheetCellToExcel", () => {
    let worksheet: ExcelJS.Worksheet;
    let workbook: ExcelJS.Workbook;

    beforeEach(() => {
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet("test");
    });

    it("should apply basic cell value", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "test value" };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toBe("test value");
    });

    it("should prefer displayed value (m) over raw value (v)", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: 10,
        m: "Ten",
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toBe("Ten");
    });

    it("should apply bold formatting", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        bl: 1,
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.bold).toBe(true);
    });

    it("should apply italic formatting", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        it: 1,
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.italic).toBe(true);
    });

    it("should apply underline formatting", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        un: 1,
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.underline).toBe(true);
    });

    it("should apply strikethrough formatting", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        cl: 1,
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.strike).toBe(true);
    });

    it("should apply font color", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        fc: "#FF0000",
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.color?.argb).toBe("FFFF0000");
    });

    it("should apply vertical alignment middle", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        vt: "1",
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.alignment?.vertical).toBe("top");
    });

    it("should apply text wrapping", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "text",
        tb: "2", // wrap
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.alignment?.wrapText).toBe(true);
    });

    it("should apply rich text formatting", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: "hello world",
        ct: {
          s: [
            { v: "hello", bl: 1, fc: "#FF0000" },
            { v: " world", it: 1, fc: "#0000FF" },
          ],
        },
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toHaveProperty("richText");
    });

    it("should apply all formatting together", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {
        v: 100,
        m: "One Hundred",
        bl: 1,
        it: 1,
        fc: "#FF0000",
        bg: "#FFFF00",
        ht: 0,
        vt: "1",
        tb: "2",
      };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toBe("One Hundred");
      expect(excelCell.font?.bold).toBe(true);
      expect(excelCell.font?.italic).toBe(true);
      expect(excelCell.font?.color?.argb).toBe("FFFF0000");
      expect(excelCell.alignment?.wrapText).toBe(true);
    });

    it("should handle empty cell value", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = {};

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toBe("");
    });

    it("should handle numeric cell value", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: 42 };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.value).toBe("42");
    });

    it("should apply default font size when not specified", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "text", bl: 1 };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.size).toBe(10);
    });

    it("should apply custom font size", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "text", fs: 14 };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.size).toBe(14);
    });

    it("should apply default font name", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "text", bl: 1 };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.name).toBe("Times New Roman");
    });

    it("should apply custom font name", () => {
      const excelCell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "text", ff: "Arial" };

      applyFortuneSheetCellToExcel(excelCell, fortuneCell);

      expect(excelCell.font?.name).toBe("Arial");
    });
  });
});
