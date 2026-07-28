# Rencana Desain: Integrasi Searchable Combobox pada AOP Form Builder

Rencana ini menjelaskan integrasi fitur dropdown pencarian (Combobox) ke dalam elemen Select yang ada pada aplikasi AOP Form Builder.

## 1. Perubahan Skema Tipe (`lib/types.ts`)
Kami menambahkan atribut opsional `searchable` ke dalam sub-skema `validation` pada objek `FormField`:

```typescript
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helperText?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    maxFileSize?: number;
    allowedExtensions?: string[];
    searchable?: boolean; // True jika pencarian aktif (menggunakan Combobox)
  };
}
```

## 2. Pemasangan Komponen & Dependensi (`Command`)
Menggunakan Shadcn UI Command component yang didukung oleh pustaka `cmdk`. Komponen ini diinstal menggunakan:
- `bunx shadcn@latest add command -y`

## 3. Integrasi Sidebar Properti (`components/builder/properties-panel.tsx`)
Ketika pengguna mengedit elemen bertipe `"select"`, panel properti di bagian kanan akan menampilkan toggle switch tambahan:
- **Label:** "Pencarian Aktif (Combobox)"
- **Deskripsi:** "Aktifkan pencarian filter (Combobox)"
- **Aksi:** Memperbarui state context bidang bersangkutan `validation: { ...validation, searchable: checked }`.

## 4. Kompilasi Halaman Publik (`components/builder/public-form.tsx`)
Pada bagian rendering elemen bertipe `"select"`:
- **Jika `searchable` dinonaktifkan:** Menggunakan komponen `<Select>` standar.
- **Jika `searchable` diaktifkan:** Menggunakan paduan `<Popover>`, `<Button role="combobox">`, dan `<Command>` (Combobox) untuk fuzzy search list pilihan.
- Mendukung dynamic option deduplication agar tidak terjadi duplikasi React keys.
