import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Subject } from "@/types";


export const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  // Keep disabled until `dataProvider.create` and `subjects/create` are implemented.
  const isCreateEnabled = false;

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "courseCode",
        accessorKey: "courseCode",
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => <p className="column-title ml-2">Name</p>,
        cell: ({ getValue }) => getValue<string>(),
      },
      {
        id: "department",
        accessorKey: "department",
        header: () => <p className="column-title ml-2">Department</p>,
        cell: ({ getValue }) => getValue<string>(),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title ml-2">Description</p>,
        cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>,
      },
    ],
    []
  );

  const departmentFilter = selectedDepartment === 'all' ? [] : [{ field: 'department', operator: 'eq' as const, value: selectedDepartment }];
  const searchFilter = searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : [];

  const subjectTable = useTable<Subject>({
    columns,
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: { initial: [...departmentFilter, ...searchFilter] },
      sorters: { initial: [{ field: 'id', order: 'desc' }] },
    },
  });
  const { setFilters } = subjectTable.refineCore;

  useEffect(() => {
    const nextDepartmentFilter =
      selectedDepartment === "all"
        ? []
        : [{ field: "department", operator: "eq" as const, value: selectedDepartment }];
    const nextSearchFilter = searchQuery
      ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
      : [];

    setFilters([...nextDepartmentFilter, ...nextSearchFilter], "replace");
  }, [searchQuery, selectedDepartment, setFilters]);

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">quick essential metrices and management tools</p>
        </div>
        
        <div className="search-field max-w-lg">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="search by name.."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent> 
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENT_OPTIONS.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateButton
            resource="subjects"
            disabled={!isCreateEnabled}
            title={!isCreateEnabled ? "Create is temporarily unavailable" : undefined}
          />
        </div>
      </div>

      <DataTable table={subjectTable} />
    </ListView>
  );
}
 export default SubjectsList
 