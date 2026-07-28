"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { BuilderProvider, useBuilder } from "./builder-context";
import { ElementsSidebar } from "./elements-sidebar";
import { DesignerCanvas } from "./designer-canvas";
import { PropertiesPanel } from "./properties-panel";
import { Form, FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Save, Eye, CheckCircle2, Loader2, BarChart2, MessageSquare, Clipboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormBuilderProps {
  initialForm: Form;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  return (
    <BuilderProvider initialFields={initialForm.fields}>
      <FormBuilderWorkspace initialForm={initialForm} />
    </BuilderProvider>
  );
}

function FormBuilderWorkspace({ initialForm }: { initialForm: Form }) {
  const { fields, setFields, addField } = useBuilder();
  const [formName, setFormName] = useState(initialForm.name);
  const [formDesc, setFormDesc] = useState(initialForm.description || "");
  const [isPublished, setIsPublished] = useState(initialForm.published);
  const [slug, setSlug] = useState(initialForm.slug);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Pointer sensor for DnD items
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // allows standard click/select on fields without triggering drag
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Case 1: Dragging from sidebar to add a new field
    if (String(active.id).startsWith("sidebar-element-")) {
      const type = active.data.current?.type;
      if (!type) return;

      let targetIndex = fields.length;
      if (over.id !== "designer-canvas") {
        const overIndex = fields.findIndex((f) => f.id === over.id);
        if (overIndex !== -1) {
          targetIndex = overIndex;
        }
      }

      addField(type, targetIndex);
      toast.success("Elemen berhasil ditambahkan!");
      return;
    }

    // Case 2: Sorting existing fields
    if (active.id !== over.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/forms/${initialForm.id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          description: formDesc,
          published: isPublished,
          slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, ""),
          fields,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan formulir");
      }

      // Update slug in state if backend validated/changed it
      if (result.slug) {
        setSlug(result.slug);
      }

      toast.success("Formulir berhasil disimpan!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link formulir berhasil disalin!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col min-w-0">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-base font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-0.5 truncate text-slate-900 dark:text-slate-100"
              placeholder="Judul Formulir"
            />
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="text-xs text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none py-0.5 truncate"
              placeholder="Deskripsi singkat formulir..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick links to Stats / Submissions */}
          <Link href={`/forms/${initialForm.id}/stats`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistik</span>
            </Button>
          </Link>
          <Link href={`/forms/${initialForm.id}/subs`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Submissions</span>
            </Button>
          </Link>

          <Separator orientation="vertical" className="h-6" />

          {/* Custom Slug configuration */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">form.pakdevi.com/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-[10px] font-semibold bg-transparent w-24 border-none focus:outline-none text-slate-900 dark:text-slate-100"
              placeholder="slug-kustom"
            />
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-200 dark:hover:bg-slate-900" onClick={copyPublicLink} title="Salin Link">
              <Clipboard className="h-3 w-3" />
            </Button>
          </div>

          {/* Publish Switch */}
          <div className="flex items-center gap-2">
            <Switch id="publish-switch" checked={isPublished} onCheckedChange={setIsPublished} />
            <Label htmlFor="publish-switch" className="text-xs font-semibold cursor-pointer hidden md:inline">
              Publish
            </Label>
          </div>

          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>

          <Button variant="outline" size="sm" onClick={() => window.open(`/${slug}`, "_blank")} className="hidden sm:flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Pratinjau
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* Workspace Area */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          <ElementsSidebar />
          <DesignerCanvas />
          <PropertiesPanel />
        </div>
      </DndContext>
    </div>
  );
}
