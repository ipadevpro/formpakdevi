"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useBuilder } from "./builder-context";
import { FieldType } from "@/lib/types";
import {
  Type,
  AlignLeft,
  Mail,
  Binary,
  Phone,
  ChevronDown,
  CheckSquare,
  List,
  ToggleLeft,
  CalendarDays,
  UploadCloud,
  Star,
} from "lucide-react";

interface SidebarElement {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SIDEBAR_ELEMENTS: SidebarElement[] = [
  { type: "text", label: "Teks Singkat", icon: <Type className="h-4 w-4" />, description: "Nama, Judul, Alamat Singkat" },
  { type: "textarea", label: "Paragraf", icon: <AlignLeft className="h-4 w-4" />, description: "Deskripsi, Feedback panjang" },
  { type: "email", label: "Email", icon: <Mail className="h-4 w-4" />, description: "Format email valid" },
  { type: "number", label: "Angka", icon: <Binary className="h-4 w-4" />, description: "Umur, Jumlah, Nominal" },
  { type: "phone", label: "Nomor Telepon", icon: <Phone className="h-4 w-4" />, description: "Kontak WA/Telepon" },
  { type: "select", label: "Dropdown", icon: <ChevronDown className="h-4 w-4" />, description: "Pilih satu dari list dropdown" },
  { type: "checkbox", label: "Kotak Centang", icon: <CheckSquare className="h-4 w-4" />, description: "Pilih beberapa pilihan" },
  { type: "radio", label: "Tombol Radio", icon: <List className="h-4 w-4" />, description: "Pilih satu dari beberapa opsi" },
  { type: "switch", label: "Switch Toggle", icon: <ToggleLeft className="h-4 w-4" />, description: "Persetujuan Ya/Tidak" },
  { type: "date", label: "Tanggal", icon: <CalendarDays className="h-4 w-4" />, description: "Pilih tanggal kalender" },
  { type: "file", label: "Unggah File", icon: <UploadCloud className="h-4 w-4" />, description: "Kirim PDF, Image, Dokumen" },
  { type: "rating", label: "Penilaian Bintang", icon: <Star className="h-4 w-4" />, description: "Skor bintang 1-5" },
];

export function ElementsSidebar() {
  const { addField } = useBuilder();

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-lg tracking-tight">Elemen Formulir</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Klik elemen di bawah untuk menambahkannya ke canvas formulir Anda.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SIDEBAR_ELEMENTS.map((elem) => (
          <DraggableSidebarElement key={elem.type} elem={elem} onClick={() => addField(elem.type)} />
        ))}
      </div>
    </div>
  );
}

function DraggableSidebarElement({ elem, onClick }: { elem: SidebarElement; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-element-${elem.type}`,
    data: {
      isSidebarElement: true,
      type: elem.type,
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-center group cursor-pointer ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 group-hover:text-primary transition-colors">
        {elem.icon}
      </div>
      <span className="text-xs font-medium mt-2 text-slate-700 dark:text-slate-300">{elem.label}</span>
    </button>
  );
}
