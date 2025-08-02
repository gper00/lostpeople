# Daftar Perbaikan untuk Aplikasi Blog

Berikut adalah daftar saran perbaikan untuk meningkatkan kualitas aplikasi dari berbagai aspek, mulai dari struktur kode, performa, hingga SEO.

---

### 🔮 Peningkatan Aplikasi & Struktur Kode

- [ ] **Implementasi Service Layer**
  - **Tujuan:** Memisahkan logika bisnis dari controller. Controller seharusnya hanya bertugas menangani request dan response HTTP, sementara service menangani validasi data, interaksi dengan model, dll.
  - **Langkah:** Buat direktori `app/services`. Contoh, buat `postService.js` yang berisi fungsi seperti `createPost(data)`, `getPostBySlug(slug)`, dll. Controller kemudian akan memanggil service ini.

- [ ] **Manajemen Konfigurasi Terpusat**
  - **Tujuan:** Menghindari pemanggilan `process.env` di banyak tempat dan memiliki satu sumber kebenaran untuk konfigurasi.
  - **Langkah:** Buat file `app/config/index.js` yang mengekspor objek berisi semua variabel lingkungan (e.g., `PORT`, `DB_URI`, `JWT_SECRET`). Gunakan file ini di seluruh aplikasi.

- [ ] **Refaktor Validasi Input**
  - **Tujuan:** Membuat controller lebih bersih dengan memisahkan aturan validasi.
  - **Langkah:** Buat direktori `app/validations`. Untuk setiap set route, buat file validasi (e.g., `postValidation.js`) yang mengekspor array aturan `express-validator`. Impor dan gunakan di file route.

- [ ] **Buat Middleware Penanganan Error Terpusat**
  - **Tujuan:** Menangani semua error (e.g., error validasi, not found, error server) secara konsisten dan menghindari crash.
  - **Langkah:** Buat middleware di `app/middlewares/errorHandler.js` yang menerima 4 argumen `(err, req, res, next)`. Gunakan `if (err instanceof ...)` untuk menangani tipe error yang berbeda dan kirim response yang sesuai (render halaman error atau kirim JSON).

---

### ⚡️ Peningkatan Performa

- [ ] **Implementasi Caching Sisi Server (Server-Side Caching)**
  - **Tujuan:** Mengurangi query ke database untuk data yang sering diakses.
  - **Langkah:** Gunakan `node-cache` (untuk cache sederhana) atau `redis` untuk menyimpan hasil query database. Contoh: cache daftar postingan di halaman utama selama beberapa menit.

- [ ] **Optimasi Aset CSS**
  - **Tujuan:** Memastikan ukuran file CSS seoptimal mungkin.
  - **Langkah:** Pastikan konfigurasi `tailwind.config.js` pada bagian `content` (sebelumnya `purge`) sudah mencakup semua file template (`.ejs`) agar Tailwind dapat menghapus class yang tidak terpakai saat build.

- [ ] **Optimasi Database dengan Indexing**
  - **Tujuan:** Mempercepat query ke MongoDB.
  - **Langkah:** Pada Mongoose Schema (di `app/models`), tambahkan index pada field yang sering digunakan untuk pencarian. Contoh: `slug: { type: String, unique: true, index: true }`.

- [ ] **Terapkan Lazy Loading untuk Gambar**
  - **Tujuan:** Mempercepat waktu muat awal halaman dengan hanya memuat gambar yang terlihat.
  - **Langkah:** Tambahkan atribut `loading="lazy"` pada semua tag `<img>` di file `.ejs` Anda. Ini adalah fitur browser modern yang mudah diimplementasikan.

---

###  SEO (Search Engine Optimization)

- [ ] **Implementasi Meta Tags Dinamis**
  - **Tujuan:** Memberikan judul dan deskripsi yang unik untuk setiap halaman agar lebih menarik di hasil pencarian.
  - **Langkah:** Saat merender halaman (e.g., `post-detail.ejs`), kirimkan data `title` dan `description` dari controller. Di layout utama (`main-layout.ejs`), gunakan variabel ini untuk mengisi tag `<title>` dan `<meta name="description">`.

- [ ] **Tambahkan Data Terstruktur (Schema Markup)**
  - **Tujuan:** Membantu mesin pencari memahami konten halaman Anda dengan lebih baik.
  - **Langkah:** Di halaman detail postingan, tambahkan skrip JSON-LD dengan tipe `Article` atau `BlogPosting`. Isi propertinya secara dinamis dengan data postingan.

- [ ] **Buat File `robots.txt`**
  - **Tujuan:** Memberi arahan kepada crawler mesin pencari.
  - **Langkah:** Buat file `robots.txt` di direktori `public`. Anda bisa mengizinkan semua crawler (`User-agent: *`, `Allow: /`) dan menunjuk ke sitemap Anda (`Sitemap: https://yourdomain.com/sitemap.xml`).

- [ ] **Gunakan URL Kanonikal**
  - **Tujuan:** Menghindari masalah duplikat konten jika sebuah halaman dapat diakses melalui beberapa URL.
  - **Langkah:** Di layout utama, tambahkan `<link rel="canonical" href="URL_ASLI_HALAMAN">`. URL ini harus di-generate secara dinamis untuk setiap halaman.

- [ ] **Buat Sitemap XML Dinamis**
  - **Tujuan:** Memberikan daftar semua URL penting di situs Anda kepada mesin pencari.
  - **Langkah:** Anda sudah memiliki `sitemap.ejs`. Pastikan route yang men-generate sitemap ini mengambil semua URL postingan dari database dan memformatnya dalam format XML yang benar.
