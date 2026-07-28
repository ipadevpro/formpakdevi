"use client";

import React, { useState } from "react";
import { Form, FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, Loader2, Star, CheckCircle2, ChevronsUpDown, Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface PublicFormProps {
  form: Form;
}

export function PublicForm({ form }: PublicFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<Record<string, boolean>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    form.fields.forEach((field) => {
      const val = answers[field.id];

      // Required check
      if (field.required) {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0) ||
          val === false
        ) {
          newErrors[field.id] = `${field.label} wajib diisi.`;
          return;
        }
      }

      // Pattern checks
      if (val) {
        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            newErrors[field.id] = "Format email tidak valid.";
          }
        }

        if (field.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            newErrors[field.id] = "Harus berupa angka.";
          } else {
            if (field.validation?.min !== undefined && num < field.validation.min) {
              newErrors[field.id] = `Nilai minimal adalah ${field.validation.min}.`;
            }
            if (field.validation?.max !== undefined && num > field.validation.max) {
              newErrors[field.id] = `Nilai maksimal adalah ${field.validation.max}.`;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Silakan lengkapi form dengan benar.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal mengirimkan formulir");
      }

      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success("Formulir berhasil dikirim!");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-lg shadow-xl border-slate-200 dark:border-slate-800 text-center py-8">
          <CardHeader className="flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2 animate-bounce" />
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Terima Kasih!
            </CardTitle>
            <CardDescription className="text-sm mt-2">
              Jawaban Anda untuk formulir <strong>{form.name}</strong> telah berhasil disimpan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">Anda dapat menutup tab halaman ini sekarang.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <Card className="w-full max-w-xl shadow-xl border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {form.name}
          </CardTitle>
          {form.description && (
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              {form.description}
            </CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {form.fields.map((field) => {
              const err = errors[field.id];
              return (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>

                  {field.helperText && <span className="text-[11px] text-slate-400">{field.helperText}</span>}

                  {/* Render input elements based on field type */}
                  {field.type === "text" && (
                    <Input
                      placeholder={field.placeholder || "Ketik jawaban Anda..."}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      placeholder={field.placeholder || "Ketik jawaban panjang..."}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      type="email"
                      placeholder={field.placeholder || "nama@email.com"}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      type="number"
                      placeholder={field.placeholder || "0"}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "phone" && (
                    <Input
                      type="tel"
                      placeholder={field.placeholder || "0812..."}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "select" && (
                    field.validation?.searchable ? (
                      <Popover
                        open={popoverOpen[field.id] || false}
                        onOpenChange={(open) =>
                          setPopoverOpen((prev) => ({ ...prev, [field.id]: open }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`w-full justify-between font-normal h-9 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md text-xs ${
                              !answers[field.id] ? "text-slate-400" : "text-slate-950 dark:text-slate-50"
                            } ${err ? "border-red-500" : ""}`}
                          >
                            {answers[field.id] || field.placeholder || "Pilih salah satu..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[300px] overflow-hidden" align="start">
                          <Command>
                            <CommandInput placeholder="Cari opsi..." className="text-xs" />
                            <CommandEmpty className="text-xs p-2 text-slate-400">Tidak ada opsi ditemukan.</CommandEmpty>
                            <CommandGroup>
                              <CommandList className="max-h-[200px] overflow-y-auto">
                                {Array.from(new Set(field.options || [])).map((opt, i) => (
                                  <CommandItem
                                    key={`${opt}-${i}`}
                                    value={opt}
                                    onSelect={(currentValue) => {
                                      const matchedOpt = Array.from(new Set(field.options || [])).find(
                                        (o) => o.toLowerCase() === currentValue.toLowerCase()
                                      ) || opt;
                                      
                                      handleInputChange(field.id, matchedOpt);
                                      setPopoverOpen((prev) => ({ ...prev, [field.id]: false }));
                                    }}
                                    className="text-xs cursor-pointer"
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        answers[field.id] === opt ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {opt}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Select onValueChange={(val: string) => handleInputChange(field.id, val)}>
                        <SelectTrigger className={err ? "border-red-500" : ""}>
                          <SelectValue placeholder={field.placeholder || "Pilih salah satu..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(field.options || [])).map((opt, i) => (
                            <SelectItem key={`${opt}-${i}`} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  )}

                  {field.type === "switch" && (
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        id={`switch-${field.id}`}
                        checked={!!answers[field.id]}
                        onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                      />
                      <Label htmlFor={`switch-${field.id}`} className="text-xs font-normal text-slate-500 cursor-pointer">
                        Saya menyetujui
                      </Label>
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="flex flex-col gap-2 mt-1">
                      {Array.from(new Set(field.options || [])).map((opt, i) => {
                        const current = answers[field.id] || [];
                        const checked = current.includes(opt);
                        return (
                          <div key={`${opt}-${i}`} className="flex items-center gap-2">
                            <Checkbox
                              id={`check-${field.id}-${opt}`}
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const next = isChecked
                                  ? [...current, opt]
                                  : current.filter((x: string) => x !== opt);
                                handleInputChange(field.id, next);
                              }}
                            />
                            <Label htmlFor={`check-${field.id}-${opt}`} className="text-xs font-normal text-slate-600 dark:text-slate-350 cursor-pointer">
                              {opt}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "radio" && (
                    <RadioGroup onValueChange={(val) => handleInputChange(field.id, val)} className="flex flex-col gap-2 mt-1">
                      {Array.from(new Set(field.options || [])).map((opt, i) => (
                        <div key={`${opt}-${i}`} className="flex items-center gap-2">
                          <RadioGroupItem id={`radio-${field.id}-${opt}`} value={opt} />
                          <Label htmlFor={`radio-${field.id}-${opt}`} className="text-xs font-normal text-slate-600 dark:text-slate-350 cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {field.type === "rating" && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const active = (answers[field.id] || 0) >= val;
                        return (
                          <button
                            type="button"
                            key={val}
                            onClick={() => handleInputChange(field.id, val)}
                            className="focus:outline-none transition-transform active:scale-95"
                          >
                            <Star
                              className={`h-7 w-7 ${
                                active ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "date" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-9 px-3 ${
                            !answers[field.id] ? "text-slate-500" : ""
                          } ${err ? "border-red-500" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {answers[field.id] ? format(answers[field.id], "PPP") : "Pilih Tanggal..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={answers[field.id]}
                          onSelect={(day) => handleInputChange(field.id, day)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {field.type === "file" && (
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app we upload this to Firebase Storage and get a URL.
                          // For our boilerplate we can store filename metadata or base64 representation.
                          // Let's store a mock structure for local simplicity.
                          const maxMB = field.validation?.maxFileSize || 10;
                          if (file.size > maxMB * 1024 * 1024) {
                            toast.error(`Ukuran file maksimal adalah ${maxMB}MB.`);
                            e.target.value = "";
                            return;
                          }
                          handleInputChange(field.id, {
                            name: file.name,
                            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                            uploadedAt: new Date().toISOString(),
                          });
                        }
                      }}
                      className={err ? "border-red-500" : ""}
                    />
                  )}

                  {err && <span className="text-xs text-red-500 mt-0.5">{err}</span>}
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mengirim Jawaban...
                </>
              ) : (
                "Kirim Jawaban"
              )}
            </Button>
            <p className="text-[10px] text-slate-400 text-center">
              Dibuat dengan AOP Form Builder
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
