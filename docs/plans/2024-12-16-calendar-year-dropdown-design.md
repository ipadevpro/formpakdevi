# Rencana Desain: Integrasi Pemilihan Tahun pada Date Picker

Rencana ini menjelaskan kustomisasi komponen Kalender (Shadcn UI) pada AOP Form Builder agar mendukung pemilihan tahun dan bulan menggunakan dropdown secara langsung (seperti TTL / Tanggal Lahir).

## 1. Perubahan Komponen Kalender (`components/ui/calendar.tsx`)
Mengubah parameter properti pada pustaka `react-day-picker` v9 yang dibungkus oleh komponen `<Calendar>`:
- Menambahkan batasan bulan awal (`startMonth`) 100 tahun ke belakang.
- Menambahkan batasan bulan akhir (`endMonth`) 2 tahun ke depan.
- Mengubah layout keterangan bulan & tahun (`captionLayout`) menjadi `"dropdown"` (menampilkan dropdown seleksi alih-alih label statis).

## 2. Kustomisasi Kelas Tampilan (Tailwind Classes)
Menambahkan override style yang sesuai ke dalam parameter `classNames` pada komponen `DayPicker` untuk merapikan dropdown pilihan bulan dan tahun agar terintegrasi indah dengan tema dark/light mode Shadcn UI.
