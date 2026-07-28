"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilder } from "./builder-context";
import { FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, Star } from "lucide-react";

export function DesignerCanvas() {
  const { fields, activeField, setActiveField, removeField, setFields } = useBuilder();

  const { setNodeRef, isOver } = useDroppable({
    id: "designer-canvas",
    data: {
      isDesignerCanvas: true,
    },
  });

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto flex justify-center">
      <div
        ref={setNodeRef}
        className={`w-full max-w-2xl min-h-[500px] border-2 border-dashed rounded-2xl p-6 transition-all bg-white dark:bg-slate-900 ${
          isOver
            ? "border-primary bg-slate-100/50 dark:bg-slate-900/50 scale-[1.01]"
            : "border-slate-200 dark:border-slate-800"
        } ${fields.length === 0 ? "flex items-center justify-center" : ""}`}
      >
        {fields.length === 0 ? (
          <div className="text-center text-slate-400 dark:text-slate-500 py-12">
            <p className="text-lg font-medium">Canvas Editor Kosong</p>
            <p className="text-sm mt-1">Klik elemen di sidebar kiri untuk mulai mendesain form.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableDesignerField
                  key={field.id}
                  field={field}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  removeField={removeField}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableDesignerField({
  field,
  activeField,
  setActiveField,
  removeField,
}: {
  field: FormField;
  activeField: FormField | null;
  setActiveField: (field: FormField | null) => void;
  removeField: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = activeField?.id === field.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setActiveField(field);
      }}
      className={`group flex items-start gap-3 p-4 border rounded-xl bg-white dark:bg-slate-950 transition-all cursor-pointer select-none relative ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 dark:ring-primary/40 shadow-md"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      } ${isDragging ? "opacity-30" : ""}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded shrink-0 self-center"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <label className="text-sm font-semibold flex items-center gap-1 text-slate-900 dark:text-slate-100">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>

        {field.helperText && <span className="text-[11px] text-slate-400 dark:text-slate-500">{field.helperText}</span>}

        {/* Dynamic Placeholder UI Components */}
        <div className="pointer-events-none mt-1">
          {field.type === "text" && (
            <input
              type="text"
              placeholder={field.placeholder || "Masukkan jawaban..."}
              className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs"
              readOnly
            />
          )}

          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder || "Masukkan jawaban panjang..."}
              className="w-full min-h-[60px] p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs resize-none"
              readOnly
            />
          )}

          {field.type === "email" && (
            <input
              type="email"
              placeholder={field.placeholder || "nama@email.com"}
              className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs"
              readOnly
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              placeholder={field.placeholder || "0"}
              className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs"
              readOnly
            />
          )}

          {field.type === "phone" && (
            <input
              type="tel"
              placeholder={field.placeholder || "0812..."}
              className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs"
              readOnly
            />
          )}

          {field.type === "date" && (
            <div className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs flex items-center text-slate-400">
              Pilih Tanggal...
            </div>
          )}

          {field.type === "file" && (
            <div className="w-full h-16 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md flex flex-col items-center justify-center text-slate-450 text-[10px]">
              <span>Klik atau seret file ke sini untuk mengunggah</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Maksimal: {field.validation?.maxFileSize || 10}MB</span>
            </div>
          )}

          {field.type === "rating" && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 text-slate-300 fill-transparent" />
              ))}
            </div>
          )}

          {field.type === "switch" && (
            <div className="flex items-center gap-2">
              <div className="h-5 w-9 bg-slate-200 dark:bg-slate-800 rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
              </div>
              <span className="text-xs text-slate-400">Persetujuan</span>
            </div>
          )}

          {field.type === "select" && (
            <div className="w-full h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs flex items-center justify-between text-slate-400">
              <span>Pilih salah satu...</span>
              <span className="text-[10px]">▼</span>
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="flex flex-col gap-2 mt-1">
              {(field.options || ["Pilihan 1", "Pilihan 2"]).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 w-4 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{opt}</span>
                </div>
              ))}
            </div>
          )}

          {field.type === "radio" && (
            <div className="flex flex-col gap-2 mt-1">
              {(field.options || ["Opsi 1", "Opsi 2"]).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 w-4 border border-slate-300 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-900 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{opt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete button (only visible when not active to reduce noise, or show on hover) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        className="opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-400 p-1.5 transition-opacity duration-150 absolute top-2 right-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
