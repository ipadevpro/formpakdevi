"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { FormField, Submission } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Clipboard, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface SubmissionsTableProps {
  fields: FormField[];
  submissions: Submission[];
}

export function SubmissionsTable({ fields, submissions }: SubmissionsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // 1. Prepare Columns
  // Static headers: No, Date
  // Dynamic headers: Mapped from form fields
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor((row, index) => index + 1, {
      id: "no",
      header: "No",
      cell: (info) => <span className="font-mono text-slate-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor("submittedAt", {
      id: "submittedAt",
      header: "Tanggal Mengisi",
      cell: (info) => {
        const val = info.getValue();
        return val ? format(new Date(val), "dd/MM/yyyy HH:mm") : "-";
      },
    }),
    // Dynamic fields columns
    ...fields.map((field) =>
      columnHelper.accessor((row) => row.answers[field.id], {
        id: field.id,
        header: field.label,
        cell: (info) => {
          const val = info.getValue();
          if (val === undefined || val === null) return <span className="text-slate-400">-</span>;
          if (typeof val === "object") {
            if (val.name) {
              // File upload details
              return (
                <span className="text-primary underline cursor-pointer" onClick={() => handleCopy(val.name)}>
                  {val.name} ({val.size})
                </span>
              );
            }
            return JSON.stringify(val);
          }
          if (typeof val === "boolean") {
            return val ? "Ya" : "Tidak";
          }
          return (
            <div className="flex items-center justify-between gap-2 max-w-[250px] truncate group">
              <span className="truncate">{String(val)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(String(val));
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 transition-opacity"
                title="Salin isi sel"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          );
        },
      })
    ),
  ];

  // 2. Setup TanStack Table
  // Map submissions to compatible row shape
  const data = submissions.map((sub) => ({
    id: sub.id,
    submittedAt: sub.submittedAt,
    answers: sub.answers,
  }));

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Salin ke clipboard!");
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error("Belum ada submission untuk diekspor.");
      return;
    }

    // Header strings
    const headers = ["No", "Tanggal Mengisi", ...fields.map((f) => f.label)];

    // Rows mapping
    const csvRows = [
      headers.join(","), // column headers
      ...data.map((row, index) => {
        const line = [
          index + 1,
          row.submittedAt ? format(new Date(row.submittedAt), "yyyy-MM-dd HH:mm") : "",
          ...fields.map((field) => {
            const val = row.answers[field.id];
            if (val === undefined || val === null) return "";
            if (typeof val === "object") return val.name || JSON.stringify(val);
            // Escape double quotes in text to keep CSV spec compliant
            const stringVal = String(val).replace(/"/g, '""');
            return `"${stringVal}"`;
          }),
        ];
        return line.join(",");
      }),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Berhasil diunduh!");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari data respon..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="gap-1.5 self-start sm:self-auto">
          <Download className="h-4 w-4" />
          Ekspor ke CSV
        </Button>
      </div>

      {/* Spreadsheet Table grid */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[500px]">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950 sticky top-0 border-b border-slate-200 dark:border-slate-800 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold text-slate-700 dark:text-slate-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400">
                    Tidak ada data respon yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-slate-800 dark:text-slate-200 max-w-[300px] truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {table.getPageCount() > 1 && (
          <div className="h-14 border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500">
              Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 gap-1"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
