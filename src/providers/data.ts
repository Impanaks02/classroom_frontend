import {
  BaseRecord,
  CrudFilters,
  CrudOperators,
  CrudSort,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { Subject } from "@/types";
import { mockSubjects } from "./mockSubjects";

const applyFilter = (items: Subject[], filters?: CrudFilters): Subject[] => {
  if (!filters?.length) {
    return items;
  }

  return items.filter((item) => {
    return filters.every((filter) => {
      if ("field" in filter) {
        const value = item[filter.field as keyof Subject];
        const filterValue = filter.value;

        switch (filter.operator as CrudOperators) {
          case "eq":
            return value === filterValue;
          case "contains":
            return String(value ?? "")
              .toLowerCase()
              .includes(String(filterValue ?? "").toLowerCase());
          default:
            return true;
        }
      }

      return true;
    });
  });
};

const applySort = (items: Subject[], sorters?: CrudSort[]): Subject[] => {
  if (!sorters?.length) {
    return items;
  }

  const [firstSorter] = sorters;
  const { field, order } = firstSorter;

  return [...items].sort((a, b) => {
    const aValue = a[field as keyof Subject];
    const bValue = b[field as keyof Subject];

    if (aValue === bValue) {
      return 0;
    }

    if (aValue == null) {
      return order === "asc" ? -1 : 1;
    }

    if (bValue == null) {
      return order === "asc" ? 1 : -1;
    }

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }

    return order === "asc" ? 1 : -1;
  });
};

const applyPagination = (items: Subject[], params: GetListParams): Subject[] => {
  const currentPage = params.pagination?.currentPage ?? 1;
  const pageSize = params.pagination?.pageSize ?? items.length;
  const start = (currentPage - 1) * pageSize;

  return items.slice(start, start + pageSize);
};

export const dataProvider: DataProvider = {
  getApiUrl: () => "mock://subjects",

  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> => {
    if (params.resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    const filtered = applyFilter(mockSubjects, params.filters);
    const sorted = applySort(filtered, params.sorters);
    const paged = applyPagination(sorted, params);

    return {
      data: paged as unknown as TData[],
      total: filtered.length,
    };
  },

  getOne: async () => {
    throw new Error("getOne is not implemented in the mock data provider.");
  },

  create: async () => {
    throw new Error("create is not implemented in the mock data provider.");
  },

  update: async () => {
    throw new Error("update is not implemented in the mock data provider.");
  },

  deleteOne: async () => {
    throw new Error("deleteOne is not implemented in the mock data provider.");
  },
};
