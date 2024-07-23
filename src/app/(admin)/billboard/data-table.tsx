'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// import { Meta } from '@/types/interface';
import Search from '@/components/search';
// import { TableSelect, TableFooter } from '@/components/table';
import useUnitColumn from './columns';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  meta: any;
}

export function DataTable<TData>({ data, meta }: DataTableProps<TData>) {
  const { gerColumns } = useUnitColumn();

  const columns: any = React.useMemo(
    () => gerColumns({ meta: meta }),
    [gerColumns, meta]
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns: columns,
    pageCount: meta?.totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    state: {
      columnVisibility,
    },
  });

  return (
    <React.Fragment>
      <div className="container mt-5">
        <div className="flex justify-between">
          <div>
            <h2 className="font-bold text-2xl">Billboards (0)</h2>
            <span>Manage billboard for your store.</span>
          </div>
          <Button asChild variant={'default'}>
            <Link href={'/billboard/create'}>
              <Plus className="w-5 h-5" />
              <span>Add</span>
            </Link>
          </Button>
        </div>
        <div className="bg-gray-200 w-full h-[1px] mt-5"></div>
      </div>
      <div className="flex items-center py-4 justify-between w-full mt-5">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Search placeholder="Filter" />
      </div>
      <div className="rounded-md overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <TableFooter
        meta={meta}
        currentItems={data.length}
        totalRows={table.getRowModel().rows?.length}
      /> */}
    </React.Fragment>
  );
}
