"use client";

import React, { createContext, useContext, useState } from "react";
import { FormField, FieldType } from "@/lib/types";

interface BuilderContextType {
  fields: FormField[];
  activeField: FormField | null;
  addField: (type: FieldType, index?: number) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updatedField: Partial<FormField>) => void;
  setActiveField: (field: FormField | null) => void;
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

// Helper helper to generate readable labels based on field type
function getDefaultLabel(type: FieldType): string {
  switch (type) {
    case "text":
      return "Teks Singkat";
    case "textarea":
      return "Paragraf / Teks Panjang";
    case "email":
      return "Alamat Email";
    case "number":
      return "Angka";
    case "phone":
      return "Nomor Telepon";
    case "select":
      return "Pilihan Dropdown";
    case "checkbox":
      return "Pilihan Kotak Centang";
    case "radio":
      return "Pilihan Tombol Radio";
    case "switch":
      return "Toggle Switch (Ya/Tidak)";
    case "date":
      return "Pilih Tanggal";
    case "file":
      return "Unggah File";
    case "rating":
      return "Penilaian Bintang (Rating)";
    default:
      return "Field Baru";
  }
}

export function BuilderProvider({
  children,
  initialFields = [],
}: {
  children: React.ReactNode;
  initialFields?: FormField[];
}) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [activeField, setActiveFieldState] = useState<FormField | null>(null);

  const addField = (type: FieldType, index?: number) => {
    const newField: FormField = {
      id: `${type}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: type === "select" || type === "radio" || type === "checkbox" ? "" : "Masukkan jawaban...",
      helperText: "",
      options: ["Opsi 1", "Opsi 2", "Opsi 3"],
      validation: {},
    };

    setFields((prev) => {
      const updated = [...prev];
      if (typeof index === "number") {
        updated.splice(index, 0, newField);
      } else {
        updated.push(newField);
      }
      return updated;
    });

    setActiveFieldState(newField);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (activeField?.id === id) {
      setActiveFieldState(null);
    }
  };

  const updateField = (id: string, updatedField: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const merged = { ...f, ...updatedField };
          if (activeField?.id === id) {
            setActiveFieldState(merged);
          }
          return merged;
        }
        return f;
      })
    );
  };

  const setActiveField = (field: FormField | null) => {
    if (field) {
      // Find fresh instance from fields array to avoid state drift
      const current = fields.find((f) => f.id === field.id);
      setActiveFieldState(current || field);
    } else {
      setActiveFieldState(null);
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        fields,
        activeField,
        addField,
        removeField,
        updateField,
        setActiveField,
        setFields,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
