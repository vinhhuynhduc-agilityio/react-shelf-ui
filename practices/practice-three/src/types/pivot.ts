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

export interface DataSourceItem {
  key: number;
  form: string;
  name: string;
  [key: string]: number | string; // For dynamic year-based keys like 2005_oil_min, etc.
}

export interface TreeDataChild {
  key: string;
  name: string;
  [key: string]: number | string; // For dynamic year-based keys like 2005_oil_min, etc.
}

export interface TreeData {
  key: string;
  name: string;
  children: TreeDataChild[];
  [key: string]: number | string | TreeDataChild[]; // For dynamic year-based keys like 2005_oil_min, etc.
}

export interface CustomExpandIconProps {
  expanded: boolean;
  onExpand: (
    record: TreeData,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  record: TreeData;
}
