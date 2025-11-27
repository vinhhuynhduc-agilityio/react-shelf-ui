import { ColumnsType } from "antd/es/table";

// Types
import { DataSourceItem, Pivot, TreeData, TreeDataChild } from "@/types";

// Components
import { Icon } from "@/components";

// Icons
import { fa } from "@/icons/fa";

export const getUniqueSortedYears = (pivot: Pivot[]): number[] =>
  Array.from(new Set(pivot.map((item) => item.year))).sort((a, b) => a - b) ||
  [];

export const generateDataSource = (pivot: Pivot[]): DataSourceItem[] => {
  const years: number[] = getUniqueSortedYears(pivot);

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

export const generatePivotTableColumns = (
  pivot: Pivot[]
): ColumnsType<DataSourceItem> => {
  const years: number[] = getUniqueSortedYears(pivot);

  const columns: ColumnsType<DataSourceItem> = [
    {
      title: "form",
      dataIndex: "form",
      key: "form",
      width: 200,
      fixed: "left",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
    },
  ];

  years.forEach((year) => {
    columns.push({
      title: year.toString(),
      key: year.toString(),
      align: "left",
      children: [
        {
          title: "oil min",
          dataIndex: `${year}_oil_min`,
          key: `${year}_oil_min`,
          width: 140,
          sorter: (a, b) =>
            (Number(a[`${year}_oil_min`]) || 0) -
            (Number(b[`${year}_oil_min`]) || 0),
          render: (value: number) => value.toFixed(3),
        },
        {
          title: "oil sum",
          dataIndex: `${year}_oil_sum`,
          key: `${year}_oil_sum`,
          width: 140,
          sorter: (a, b) =>
            (Number(a[`${year}_oil_sum`]) || 0) -
            (Number(b[`${year}_oil_sum`]) || 0),
          render: (value: number) => value.toFixed(3),
        },
      ],
    });
  });

  return columns;
};

export const generatePivotTreeColumns = (
  pivot: Pivot[]
): ColumnsType<TreeData> => {
  const years: number[] = getUniqueSortedYears(pivot);

  const columns: ColumnsType<TreeData> = [
    {
      title: (
        <span>
          form <Icon icon={fa.faGreaterThan} className="fa-xs text-[#94A1B3]" />{" "}
          name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      width: 300,
      fixed: "left",
      render: (text: string, record: TreeData) => {
        const isParent = record.children && record.children.length > 0;
        const icon = isParent ? (
          <Icon icon={fa.faFolderOpen} className="fa-lg text-[#DADEE0]" />
        ) : (
          <Icon icon={fa.faFile} className="fa-lg text-[#DADEE0]" />
        );
        const marginLeft = isParent ? "ml-[12px]" : "ml-[42px]";

        return (
          <span className={`${marginLeft}`}>
            {icon}
            <span className="ml-[10px]">{text}</span>
          </span>
        );
      },
    },
  ];

  years.forEach((year) => {
    columns.push({
      title: year.toString(),
      key: year.toString(),
      align: "left",
      children: [
        {
          title: "oil min",
          dataIndex: `${year}_oil_min`,
          key: `${year}_oil_min`,
          width: 140,
          sorter: (a: TreeData, b: TreeData) =>
            (Number(a[`${year}_oil_min`]) || 0) -
            (Number(b[`${year}_oil_min`]) || 0),
          render: (value: number) => value.toFixed(3),
        },
        {
          title: "oil sum",
          dataIndex: `${year}_oil_sum`,
          key: `${year}_oil_sum`,
          width: 140,
          sorter: (a: TreeData, b: TreeData) =>
            (Number(a[`${year}_oil_sum`]) || 0) -
            (Number(b[`${year}_oil_sum`]) || 0),
          render: (value: number) => value.toFixed(3),
        },
      ],
    });
  });

  return columns;
};

export const generateTreeData = (pivot: Pivot[]): TreeData[] => {
  const dataMap: { [key: string]: TreeData } = {}; // Group data by form and name
  const years: number[] = getUniqueSortedYears(pivot);

  pivot.forEach((item) => {
    const formKey = item.form;
    const nameKey = item.name;
    const year = item.year;
    const oil = item.oil || 0;

    // Initialize form if it doesn't exist
    if (!dataMap[formKey]) {
      dataMap[formKey] = {
        key: formKey,
        name: formKey,
        children: [],
      };
    }

    // Initialize name if it doesn't exist
    let nameEntry = dataMap[formKey].children.find(
      (child: TreeDataChild) => child.name === nameKey
    );
    if (!nameEntry) {
      nameEntry = {
        key: `${formKey}-${nameKey}`,
        name: nameKey,
      };
      dataMap[formKey].children.push(nameEntry);
    }

    // Assign oil values directly for each year
    nameEntry[`${year}_oil_min`] = oil;
    nameEntry[`${year}_oil_sum`] = oil;
  });

  // Convert dataMap to final treeData
  const treeData: TreeData[] = Object.values(dataMap).map((form: TreeData) => ({
    ...form,
    children: form.children.map((child: TreeDataChild) => ({
      ...child,
      // Ensure all years are initialized with 0 if missing
      ...years.reduce((acc, year) => {
        const minKey = `${year}_oil_min`;
        const sumKey = `${year}_oil_sum`;
        acc[minKey] = Number(child[minKey]) || 0;
        acc[sumKey] = Number(child[sumKey]) || 0;
        return acc;
      }, {} as { [key: string]: number }),
    })),
    // Calculate oil min and sum for form based on children
    ...years.reduce((acc, year) => {
      const min = Math.min(
        ...form.children.map(
          (child: TreeDataChild) => Number(child[`${year}_oil_min`]) || 0
        )
      );
      const sum = form.children.reduce(
        (total: number, child: TreeDataChild) =>
          total + Number(child[`${year}_oil_sum`] || 0),
        0
      );
      acc[`${year}_oil_min`] = min;
      acc[`${year}_oil_sum`] = sum;
      return acc;
    }, {} as { [key: string]: number }),
  }));

  return treeData;
};

export const generateChartData = (
  pivot: Pivot[]
): { year: string; type: string; value: number }[] => {
  const years = getUniqueSortedYears(pivot);

  return years.reduce((data, year) => {
    const yearData = pivot.filter((item) => item.year === year);

    if (yearData.length > 0) {
      const oils = yearData.map((item) => item.oil || 0);

      const minOil = Math.round(Math.min(...oils) * 1000) / 1000;
      const sumOil =
        Math.round(oils.reduce((acc, curr) => acc + curr, 0) * 1000) / 1000;

      data.push({ year: year.toString(), type: "oil (min)", value: minOil });
      data.push({ year: year.toString(), type: "oil (sum)", value: sumOil });
    }

    return data;
  }, [] as { year: string; type: string; value: number }[]);
};
