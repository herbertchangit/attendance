import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
}

export function DataTable<T extends Record<string, unknown>>({ title, rows, columns, searchKeys }: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(normalized)));
  }, [query, rows, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="rounded-lg border border-border bg-white shadow-soft dark:bg-muted">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" className="pl-9 sm:w-72" />
          </div>
          <Button variant="secondary" size="sm">Export</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-muted/70">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-200">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={String(row.id ?? index)} className="border-t border-border">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 align-middle">
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-slate-500">
        <span>{filtered.length} records</span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <span>Page {page} of {pageCount}</span>
          <Button variant="secondary" size="sm" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      </div>
    </section>
  );
}
