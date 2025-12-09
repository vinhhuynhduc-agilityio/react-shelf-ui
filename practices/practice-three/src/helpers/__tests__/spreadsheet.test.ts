import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

jest.mock("file-saver");

import {
  FortuneSheetData,
  FortuneSheetConfig,
  FortuneSheetCell,
} from "@/types";
import {
  applyBordersFromConfig,
  applyFortuneSheetCellToExcel,
  colorToArgb,
  exportToXLSX,
} from "@/helpers/spreadsheet";

describe("spreadsheet helpers", () => {
  describe("colorToArgb", () => {
    it("should convert hex color to ARGB", () => {
      expect(colorToArgb("#FF0000")).toBe("FFFF0000");
    });

    it("should convert hex color without # to ARGB", () => {
      expect(colorToArgb("FF0000")).toBe("FFFF0000");
    });

    it("should convert 3-digit hex color to ARGB", () => {
      expect(colorToArgb("#F00")).toBe("FFFF0000");
    });

    it("should convert rgb color to ARGB", () => {
      expect(colorToArgb("rgb(255, 0, 0)")).toBe("FFFF0000");
    });

    it("should return default black color when undefined", () => {
      expect(colorToArgb()).toBe("FF000000");
    });

    it("should handle case insensitivity", () => {
      expect(colorToArgb("#ff0000")).toBe("FFFF0000");
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
      applyBordersFromConfig(worksheet, undefined, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border).toBeUndefined();
    });

    it("should not apply borders when borderInfo is empty", () => {
      const config: FortuneSheetConfig = { borderInfo: [] };
      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
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

    it("should apply border-all to range of cells", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 1], column: [0, 1] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      // All 4 cells should have all borders
      [1, 2].forEach((row) => {
        [1, 2].forEach((col) => {
          const cell = worksheet.getCell(row, col);
          expect(cell.border?.top).toBeDefined();
          expect(cell.border?.bottom).toBeDefined();
          expect(cell.border?.left).toBeDefined();
          expect(cell.border?.right).toBeDefined();
        });
      });
    });

    it("should apply border-inside correctly", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-inside",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 1], column: [0, 1] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      // Top-left cell - should have only right and bottom
      let cell = worksheet.getCell(1, 1);
      expect(cell.border?.right).toBeDefined();
      expect(cell.border?.bottom).toBeDefined();

      // Top-right cell - should have only left and bottom
      cell = worksheet.getCell(1, 2);
      expect(cell.border?.left).toBeDefined();
      expect(cell.border?.bottom).toBeDefined();

      // Bottom-left cell - should have only right and top
      cell = worksheet.getCell(2, 1);
      expect(cell.border?.right).toBeDefined();
      expect(cell.border?.top).toBeDefined();

      // Bottom-right cell - should have only left and top
      cell = worksheet.getCell(2, 2);
      expect(cell.border?.left).toBeDefined();
      expect(cell.border?.top).toBeDefined();
    });

    it("should apply border-vertical correctly", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-vertical",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 1], column: [0, 1] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      // All cells should have right border (vertical lines between columns)
      [1, 2].forEach((row) => {
        const cell = worksheet.getCell(row, 1);
        expect(cell.border?.right).toBeDefined();
      });
    });

    it("should apply border-horizontal correctly", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-horizontal",
            style: "1",
            color: "#000000",
            range: [{ row: [0, 1], column: [0, 1] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      // All cells should have bottom border (horizontal lines between rows)
      [1, 2].forEach((col) => {
        const cell = worksheet.getCell(1, col);
        expect(cell.border?.bottom).toBeDefined();
      });
    });

    it("should use correct border style", () => {
      const config: FortuneSheetConfig = {
        borderInfo: [
          {
            borderType: "border-all",
            style: "5", // double
            color: "#000000",
            range: [{ row: [0, 0], column: [0, 0] }],
            rangeType: "range",
          },
        ],
      };

      applyBordersFromConfig(worksheet, config, colorToArgb);

      const cell = worksheet.getCell(1, 1);
      expect(cell.border?.top?.style).toBe("double");
    });
  });

  describe("applyFortuneSheetCellToExcel", () => {
    let worksheet: ExcelJS.Worksheet;
    let workbook: ExcelJS.Workbook;

    beforeEach(() => {
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet("test");
    });

    it("should set cell value from cell.v", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Hello" };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.value).toBe("Hello");
    });

    it("should prioritize cell.m over cell.v", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Original", m: "Displayed" };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.value).toBe("Displayed");
    });

    it("should apply bold formatting", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Bold", bl: 1 };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.font?.bold).toBe(true);
    });

    it("should apply italic formatting", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Italic", it: 1 };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.font?.italic).toBe(true);
    });

    it("should apply background color", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Background", bg: "#FF0000" };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.fill).toBeDefined();
    });

    it("should apply text wrapping", () => {
      const cell = worksheet.getCell(1, 1);
      const fortuneCell: FortuneSheetCell = { v: "Wrap", tb: "2" };

      applyFortuneSheetCellToExcel(cell, fortuneCell);

      expect(cell.alignment?.wrapText).toBe(true);
    });
  });

  describe("exportToXLSX", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create workbook and add worksheet", async () => {
      const sheet: FortuneSheetData = {
        name: "TestSheet",
        data: [[{ v: "Hello" }]],
        config: {},
      };

      await exportToXLSX(sheet);

      expect(saveAs).toHaveBeenCalled();
      const [blob, filename] = (saveAs as unknown as jest.Mock).mock.calls[0];
      expect(blob).toBeInstanceOf(Blob);
      expect(filename).toBe("spreadsheet.xlsx");
    });

    it("should use default sheet name when not provided", async () => {
      const sheet: FortuneSheetData = {
        name: "",
        data: [],
        config: {},
      };

      await exportToXLSX(sheet);

      expect(saveAs).toHaveBeenCalled();
    });

    it("should call saveAs with correct filename and mime type", async () => {
      const sheet: FortuneSheetData = {
        name: "TestSheet",
        data: [],
        config: {},
      };

      await exportToXLSX(sheet);

      const [blob, filename] = (saveAs as unknown as jest.Mock).mock.calls[0];
      expect(blob.type).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      expect(filename).toBe("spreadsheet.xlsx");
    });

    it("should process cells from sheet data", async () => {
      const sheet: FortuneSheetData = {
        name: "TestSheet",
        data: [[{ v: "Cell1" }, { v: "Cell2" }]],
        config: {},
      };

      await exportToXLSX(sheet);

      expect(saveAs).toHaveBeenCalled();
    });

    it("should apply borders from config", async () => {
      const sheet: FortuneSheetData = {
        name: "TestSheet",
        data: [[{ v: "Cell" }]],
        config: {
          borderInfo: [
            {
              borderType: "border-all",
              style: "1",
              color: "#000000",
              range: [{ row: [0, 0], column: [0, 0] }],
              rangeType: "range",
            },
          ],
        },
      };

      await exportToXLSX(sheet);

      expect(saveAs).toHaveBeenCalled();
    });
  });
});
