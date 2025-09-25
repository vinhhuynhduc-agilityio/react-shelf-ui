export interface Pivot {
  name: string;
  year: number;
  continent: string;
  form: string;
  gdp: number;
  oil: number;
  balance: number;
  key: number;
}

type DynamicFields = Record<string, number | string>;

export interface DataSourceItem extends DynamicFields {
  key: number;
  form: string;
  name: string;
  [key: string]: number | string; // For dynamic year-based keys like 2005_oil_min, etc.
}
