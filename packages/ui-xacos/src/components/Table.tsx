import React from "react";
import clsx from "clsx";

export interface TableColumn<T extends Record<PropertyKey, unknown>> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps<T extends Record<PropertyKey, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

function defaultCell<T extends Record<PropertyKey, unknown>>(row: T, col: TableColumn<T>): React.ReactNode {
  const raw = row[String(col.key) as keyof T];
  return String(raw ?? "—");
}

export function Table<T extends Record<PropertyKey, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available.",
  onRowClick,
  className,
}: TableProps<T>) {
  const alignClass = { left: "text-left", center: "text-center", right: "text-right" };

  return (
    <div className={clsx("overflow-x-auto rounded-xacos border border-xacos-border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-xacos-border bg-white/[0.03]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={col.width ? { width: col.width } : undefined}
                className={clsx("px-4 py-3 font-medium text-xacos-muted", alignClass[col.align ?? "left"])}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xacos-muted">
                Loading…
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xacos-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "border-b border-xacos-border last:border-0",
                  "hover:bg-white/[0.03] transition-colors duration-100",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx("px-4 py-3 text-xacos-text", alignClass[col.align ?? "left"])}
                  >
                    {col.render ? col.render(row, i) : defaultCell(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

