export interface FortuneSheetCell {
  v?: string | number | null;
  m?: string;
  ct?: {
    fa?: string;
    t?: string;
    s?: Array<{
      v: string;
      bl?: 1;
      it?: 1;
      un?: 1;
      cl?: 1;
      fs?: number;
      fc?: string;
    }>;
  };
  ff?: string;
  fs?: number;
  fc?: string;
  bl?: 1;
  it?: 1;
  un?: 1;
  cl?: 1;
  bg?: string;
  ht?: number;
  vt?: number;
  tb?: "0" | "1" | "2";
}

export type FortuneSheetRow = (FortuneSheetCell | null)[];

export interface FortuneSheetData {
  name?: string;
  data: FortuneSheetRow[];
  config?: FortuneSheetConfig;
}

export interface RangeRef {
  row: [number, number];
  column: [number, number];
}

export interface BorderInfoItem {
  rangeType: "range" | "cell";
  borderType:
    | "border-all"
    | "border-outside"
    | "border-inside"
    | "border-horizontal"
    | "border-vertical"
    | "border-top"
    | "border-bottom"
    | "border-left"
    | "border-right"
    | "border-slash";
  style?: string; // "1" → "11"
  color?: string; // "#000000" or "rgb(...)"
  range: RangeRef[];
}

export interface FortuneSheetConfig {
  borderInfo?: BorderInfoItem[];
}
