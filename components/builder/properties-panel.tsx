"use client";

import React, { useState, useEffect } from "react";
import { useBuilder } from "./builder-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Settings } from "lucide-react";

export function PropertiesPanel() {
  const { activeField, updateField, removeField } = useBuilder();
  const [optionInput, setOptionInput] = useState("");

  if (!activeField) {
    return (
      <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
        <Settings className="h-10 w-10 mb-2 opacity-50 animate-pulse" />
        <p className="text-sm">Klik salah satu elemen di canvas untuk mengatur properti & validasi.</p>
      </div>
    );
  }

  const showPlaceholder = !["checkbox", "radio", "switch", "date", "file", "rating"].includes(activeField.type);
  const showOptions = ["select", "checkbox", "radio"].includes(activeField.type);

  const handleAddOption = () => {
    if (!optionInput.trim()) return;
    const currentOptions = activeField.options || [];
    if (currentOptions.includes(optionInput.trim())) return;
    updateField(activeField.id, {
      options: [...currentOptions, optionInput.trim()],
    });
    setOptionInput("");
  };

  const handleRemoveOption = (indexToRemove: number) => {
    const currentOptions = activeField.options || [];
    updateField(activeField.id, {
      options: currentOptions.filter((_, i) => i !== indexToRemove),
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = activeField.options || [];
    const updated = [...currentOptions];
    updated[index] = value;
    updateField(activeField.id, { options: updated });
  };

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg tracking-tight">Properti Elemen</h3>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => removeField(activeField.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        {/* Label */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="prop-label">Label Elemen</Label>
          <Input
            id="prop-label"
            value={activeField.label}
            onChange={(e) => updateField(activeField.id, { label: e.target.value })}
          />
        </div>

        {/* Helper Text */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="prop-helper">Deskripsi Singkat / Keterangan</Label>
          <Input
            id="prop-helper"
            value={activeField.helperText || ""}
            onChange={(e) => updateField(activeField.id, { helperText: e.target.value })}
            placeholder="Petunjuk pengisian..."
          />
        </div>

        {/* Placeholder */}
        {showPlaceholder && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prop-placeholder">Placeholder</Label>
            <Input
              id="prop-placeholder"
              value={activeField.placeholder || ""}
              onChange={(e) => updateField(activeField.id, { placeholder: e.target.value })}
              placeholder="Masukkan placeholder..."
            />
          </div>
        )}

        {/* Required */}
        <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 mt-2">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="prop-required" className="cursor-pointer">
              Wajib Diisi (Required)
            </Label>
            <span className="text-[10px] text-slate-400">User tidak bisa submit jika kosong</span>
          </div>
          <Switch
            id="prop-required"
            checked={activeField.required}
            onCheckedChange={(checked) => updateField(activeField.id, { required: checked })}
          />
        </div>

        {/* Searchable Toggle for Select dropdowns */}
        {activeField.type === "select" && (
          <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 mt-2">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="prop-searchable" className="cursor-pointer">
                Pencarian Aktif (Combobox)
              </Label>
              <span className="text-[10px] text-slate-400">Aktifkan pencarian filter pilihan</span>
            </div>
            <Switch
              id="prop-searchable"
              checked={!!activeField.validation?.searchable}
              onCheckedChange={(checked) =>
                updateField(activeField.id, {
                  validation: { ...activeField.validation, searchable: checked },
                })
              }
            />
          </div>
        )}

        {/* Choices Options list */}
        {showOptions && (
          <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Label>Daftar Pilihan (Opsi)</Label>
            <div className="flex flex-col gap-2">
              {(activeField.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 shrink-0" onClick={() => handleRemoveOption(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Input
                placeholder="Tambah opsi baru..."
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleAddOption}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Validation limits for texts or numbers */}
        {activeField.type === "number" && (
          <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Label>Batasan Nilai Angka</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="prop-min" className="text-[10px] text-slate-500">Nilai Min</Label>
                <Input
                  id="prop-min"
                  type="number"
                  placeholder="Min"
                  value={activeField.validation?.min ?? ""}
                  onChange={(e) =>
                    updateField(activeField.id, {
                      validation: { ...activeField.validation, min: e.target.value ? Number(e.target.value) : undefined },
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="prop-max" className="text-[10px] text-slate-500">Nilai Max</Label>
                <Input
                  id="prop-max"
                  type="number"
                  placeholder="Max"
                  value={activeField.validation?.max ?? ""}
                  onChange={(e) =>
                    updateField(activeField.id, {
                      validation: { ...activeField.validation, max: e.target.value ? Number(e.target.value) : undefined },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation limits for File Upload */}
        {activeField.type === "file" && (
          <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Label>Pengaturan File</Label>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prop-max-file-size" className="text-xs">Ukuran Maksimal (MB)</Label>
              <Input
                id="prop-max-file-size"
                type="number"
                value={activeField.validation?.maxFileSize ?? 10}
                onChange={(e) =>
                  updateField(activeField.id, {
                    validation: { ...activeField.validation, maxFileSize: Number(e.target.value) },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
