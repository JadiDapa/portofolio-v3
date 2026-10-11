import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface SearchDataTableProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  column: string;
}

export default function SearchDataTable<TData>({
  table,
  placeholder = "Search...",
  column,
}: SearchDataTableProps<TData>) {
  return (
    <div className="db-search">
      <Search aria-hidden />
      <input
        className="db-input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(column)?.setFilterValue(event.target.value)
        }
      />
    </div>
  );
}
