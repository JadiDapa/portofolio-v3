import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Column } from "@tanstack/react-table";

type TableSorterProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, unknown>;
  header: string;
};

/** Cycles none, ascending, descending, none, so a sort can always be cleared. */
const TableSorter: React.FC<TableSorterProps> = ({ column, header }) => {
  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  function cycle() {
    if (!sorted) column.toggleSorting(false);
    else if (sorted === "asc") column.toggleSorting(true);
    else column.clearSorting();
  }

  return (
    <button
      type="button"
      onClick={cycle}
      data-sorted={!!sorted}
      className="db-sort"
    >
      {header}
      <Icon aria-hidden />
    </button>
  );
};

export default TableSorter;
