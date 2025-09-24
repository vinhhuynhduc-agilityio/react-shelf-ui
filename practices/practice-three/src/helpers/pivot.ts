import { ColumnsType } from "antd/es/table";

// Types
import { DataSourceItem, Pivot } from "@/types";

export const generateDataSource = (pivot: Pivot[]): DataSourceItem[] => {
  const years: number[] = [
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
  ];

  const dataSourceMap: { [key: string]: DataSourceItem } = {};

  pivot.forEach((item) => {
    const key = item.name;
    let countryEntry = dataSourceMap[key];

    if (!countryEntry) {
      countryEntry = { key: item.key, form: item.form, name: item.name };
      dataSourceMap[key] = countryEntry;
    }

    const year = item.year;
    countryEntry[`${year}_oil_min`] = item.oil || 0;
    countryEntry[`${year}_oil_sum`] = item.oil || 0;

    years.forEach((y) => {
      if (countryEntry[`${y}_oil_min`] === undefined) {
        countryEntry[`${y}_oil_min`] = 0;
        countryEntry[`${y}_oil_sum`] = 0;
      }
    });
  });

  const dataSource = Object.values(dataSourceMap);

  dataSource.sort((a, b) => {
    if (a.form > b.form) return -1;
    if (a.form < b.form) return 1;
    return 0;
  });

  return dataSource;
};

export const generatePivotTableColumns = (): ColumnsType<DataSourceItem> => [
  { title: "form", dataIndex: "form", key: "form", width: 200, fixed: "left" },
  { title: "name", dataIndex: "name", key: "name", width: 200, fixed: "left" },
  {
    title: "2005",
    key: "2005",
    children: [
      {
        title: "oil min",
        dataIndex: "2005_oil_min",
        key: "2005_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2005_oil_sum",
        key: "2005_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2006",
    key: "2006",
    children: [
      {
        title: "oil min",
        dataIndex: "2006_oil_min",
        key: "2006_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2006_oil_sum",
        key: "2006_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2007",
    key: "2007",
    children: [
      {
        title: "oil min",
        dataIndex: "2007_oil_min",
        key: "2007_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2007_oil_sum",
        key: "2007_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2008",
    key: "2008",
    children: [
      {
        title: "oil min",
        dataIndex: "2008_oil_min",
        key: "2008_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2008_oil_sum",
        key: "2008_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2009",
    key: "2009",
    children: [
      {
        title: "oil min",
        dataIndex: "2009_oil_min",
        key: "2009_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2009_oil_sum",
        key: "2009_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2010",
    key: "2010",
    children: [
      {
        title: "oil min",
        dataIndex: "2010_oil_min",
        key: "2010_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2010_oil_sum",
        key: "2010_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2011",
    key: "2011",
    children: [
      {
        title: "oil min",
        dataIndex: "2011_oil_min",
        key: "2011_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2011_oil_sum",
        key: "2011_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2012",
    key: "2012",
    children: [
      {
        title: "oil min",
        dataIndex: "2012_oil_min",
        key: "2012_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2012_oil_sum",
        key: "2012_oil_sum",
        width: 140,
      },
    ],
  },
  {
    title: "2013",
    key: "2013",
    children: [
      {
        title: "oil min",
        dataIndex: "2013_oil_min",
        key: "2013_oil_min",
        width: 140,
      },
      {
        title: "oil sum",
        dataIndex: "2013_oil_sum",
        key: "2013_oil_sum",
        width: 140,
      },
    ],
  },
];
