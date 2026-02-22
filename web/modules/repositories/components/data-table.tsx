"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchValue?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue = "",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4 flex justify-between flex-col  h-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="font-bold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          {" "}to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}
          {" "}of {table.getFilteredRowModel().rows.length} reviews
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {table.getPageCount() > 7 ? (
              <>
                <button
                  onClick={() => table.setPageIndex(0)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    table.getState().pagination.pageIndex === 0
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  1
                </button>
                {table.getState().pagination.pageIndex > 2 && (
                  <span className="px-2">...</span>
                )}
                {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                  let pageIndex;
                  if (table.getPageCount() <= 7) {
                    pageIndex = i;
                  } else if (table.getState().pagination.pageIndex < 3) {
                    pageIndex = i + 1;
                  } else if (table.getState().pagination.pageIndex >= table.getPageCount() - 3) {
                    pageIndex = table.getPageCount() - 6 + i;
                  } else {
                    pageIndex = table.getState().pagination.pageIndex - 1 + i;
                  }
                  if (pageIndex <= 0 || pageIndex >= table.getPageCount() - 1) return null;
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => table.setPageIndex(pageIndex)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        table.getState().pagination.pageIndex === pageIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  );
                })}
                {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    table.getState().pagination.pageIndex === table.getPageCount() - 1
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {table.getPageCount()}
                </button>
              </>
            ) : (
              Array.from({ length: table.getPageCount() }, (_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    table.getState().pagination.pageIndex === i
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))
            )}
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
