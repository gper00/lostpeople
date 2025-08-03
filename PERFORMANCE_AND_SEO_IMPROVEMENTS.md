# Catatan Perbaikan Performa & SEO

Dokumen ini berisi daftar saran dan langkah-langkah yang dapat diambil untuk meningkatkan performa dan optimisasi mesin pencari (SEO) dari aplikasi web ini. Perubahan ini dirancang agar tidak mengganggu gaya atau alur kerja yang sudah ada.

## Daftar Isi
1.  [Perbaikan Performa Frontend](#perbaikan-performa-frontend)
    *   [1.1. Kompresi Aset (Gzip/Brotli)](#11-kompresi-aset-gzipbrotli)
    *   [1.2. Minifikasi dan Bundling Aset CSS & JS](#12-minifikasi-dan-bundling-aset-css--js)
    *   [1.3. Lazy Loading untuk Gambar](#13-lazy-loading-untuk-gambar)
    *   [1.4. Optimisasi Pemuatan Font Google](#14-optimisasi-pemuatan-font-google)
2.  [Perbaikan Performa Backend](#perbaikan-performa-backend)
    *   [2.1. Caching Sisi Server](#21-caching-sisi-server)
    *   [2.2. Indeksasi Database](#22-indeksasi-database)
3.  [Perbaikan SEO](#perbaikan-seo)
    *   [3.1. Buat File `robots.txt`](#31-buat-file-robotstxt)
    *   [3.2. Buat Sitemap Dinamis (`sitemap.xml`)](#32-buat-sitemap-dinamis-sitemapxml)
    *   [3.3. Penyempurnaan Schema.org (Structured Data)](#33-penyempurnaan-schemaorg-structured-data)

---

## Perbaikan Performa Frontend

... (Konten sebelumnya tetap sama)

---

## Perbaikan Performa Backend

### 2.1. Caching Sisi Server

**Masalah:** Waktu respons server (Time to First Byte - TTFB) tinggi untuk halaman yang memerlukan query ke database (misalnya, homepage, halaman detail postingan). Setiap permintaan pengguna menyebabkan server menjalankan query yang sama berulang kali ke database, yang memakan waktu dan sumber daya, terutama dengan adanya latensi jaringan ke layanan database eksternal seperti MongoDB Atlas.

**Solusi:** Implementasikan strategi caching di sisi server. Simpan hasil query database yang mahal di dalam memori server untuk jangka waktu tertentu (misalnya, 5 menit). Ketika permintaan berikutnya untuk data yang sama datang, sajikan data dari cache (yang hampir instan) alih-alih mengakses database lagi. Ini secara drastis mengurangi TTFB.

**Langkah-langkah:**

1.  **Instalasi:** Instal paket `node-cache`.
    ```bash
    npm install node-cache
    ```

2.  **Buat Modul Cache:** Buat file utilitas baru, misalnya `app/utils/cache.js`, untuk menginisialisasi dan mengekspor satu instance cache. Ini memastikan cache bersifat singleton di seluruh aplikasi.

3.  **Terapkan di Controller:** Di dalam controller yang menangani rute padat-query (seperti `home-controller.js`):
    *   Sebelum menjalankan query database, periksa apakah data yang relevan sudah ada di cache.
    *   Jika ada (cache hit), ambil data dari cache dan render halaman.
    *   Jika tidak ada (cache miss), jalankan query database seperti biasa.
    *   Setelah mendapatkan hasil dari database, simpan hasil tersebut di cache dengan kunci yang unik (misalnya, `latest-posts`) dan durasi (TTL - Time To Live) sebelum merender halaman.

4.  **Invalidasi Cache:** Pastikan cache dihapus (di-flush) setiap kali ada perubahan data yang relevan. Misalnya, di `post-controller.js`, setelah berhasil membuat, memperbarui, atau menghapus postingan, panggil `cache.flushAll()` atau hapus kunci spesifik untuk memastikan data yang disajikan selalu segar.

### 2.2. Indeksasi Database

**Masalah:** Query database, terutama untuk pengurutan (`sort`) dan pencarian (`find`), bisa menjadi lambat pada koleksi data yang besar jika tidak ada indeks. Tanpa indeks, database harus melakukan pemindaian koleksi penuh (full collection scan) untuk menemukan dokumen yang cocok, yang sangat tidak efisien.

**Solusi:** Tentukan indeks pada field-field di Mongoose schema yang sering digunakan dalam kriteria query, pengurutan, atau agregasi.

**Langkah-langkah:**

1.  **Identifikasi Field Kunci:** Tinjau query Anda. Field yang umum untuk diindeks adalah:
    *   `slug`: Untuk pencarian cepat satu postingan.
    *   `createdAt`, `updatedAt`: Untuk pengurutan.
    *   `status`: Untuk memfilter postingan yang `published`.
    *   `category`, `tags`: Untuk memfilter berdasarkan taksonomi.

2.  **Tambahkan Indeks ke Schema:** Modifikasi file model Anda (misalnya, `app/models/post-model.js`) untuk menambahkan properti `index: true` atau mendefinisikan indeks gabungan (compound index).

    ```javascript
    // Di dalam file /app/models/post-model.js
    const postSchema = new mongoose.Schema({
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true }, // Indeks tunggal
        status: { type: String, enum: ['published', 'draft'], default: 'draft' },
        // ... field lainnya
    }, { timestamps: true });

    // Indeks gabungan untuk query yang sering dilakukan di homepage/halaman postingan
    postSchema.index({ status: 1, createdAt: -1 });

    module.exports = mongoose.model('Post', postSchema);
    ```
    *Mongoose akan secara otomatis membuat indeks ini di MongoDB saat aplikasi dimulai.*

---

## Perbaikan SEO

### 2.1. Buat File `robots.txt`

**Masalah:** Tidak ada file `robots.txt` untuk memberi tahu crawler mesin pencari (seperti Googlebot) halaman mana yang boleh dan tidak boleh mereka jelajahi.

**Solusi:** Buat file `robots.txt` di direktori `public`.

**Langkah-langkah:**

1.  Buat file baru: `public/robots.txt`.
2.  Tambahkan konten berikut ke dalamnya. Ini mengizinkan semua crawler untuk mengakses semua bagian situs dan menunjuk ke lokasi sitemap Anda (yang akan kita buat selanjutnya).

    ```
    User-agent: *
    Allow: /

    Sitemap: https://nama-domain-anda.com/sitemap.xml
    ```
    *   **Penting:** Ganti `https://nama-domain-anda.com` dengan URL domain Anda yang sebenarnya.

### 2.2. Buat Sitemap Dinamis (`sitemap.xml`)

**Masalah:** Tidak ada sitemap yang membantu mesin pencari menemukan semua URL penting di situs Anda, terutama halaman postingan yang dibuat secara dinamis.

**Solusi:** Buat route Express baru yang secara dinamis menghasilkan file `sitemap.xml` dari data postingan di database Anda.

**Langkah-langkah:**

1.  **Tambahkan route baru di `app/routes/visitor-routes.js`:**

    ```javascript
    // Di dalam file /app/routes/visitor-routes.js
    const router = require('express').Router();
    const Post = require('../models/post-model'); // Pastikan model Post diimpor
    const { getHome } = require('../controllers/home-controller');
    // ... controller lainnya

    // ... route lainnya

    // Route untuk Sitemap
    router.get('/sitemap.xml', async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: -1 });
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            let sitemap = `<?xml version="1.0" encoding="UTF-8"?>`;
            sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

            // URL Halaman Statis
            sitemap += `
                <url>
                    <loc>${baseUrl}/</loc>
                    <changefreq>weekly</changefreq>
                    <priority>1.0</priority>
                </url>
                <url>
                    <loc>${baseUrl}/posts</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>
                 <url>
                    <loc>${baseUrl}/about</loc>
                    <changefreq>monthly</changefreq>
                    <priority>0.5</priority>
                </url>
            `;

            // URL Halaman Postingan Dinamis
            posts.forEach(post => {
                sitemap += `
                    <url>
                        <loc>${baseUrl}/posts/${post.slug}</loc>
                        <lastmod>${post.updatedAt.toISOString()}</lastmod>
                        <changefreq>never</changefreq>
                        <priority>0.9</priority>
                    </url>
                `;
            });

            sitemap += `</urlset>`;

            res.header('Content-Type', 'application/xml');
            res.send(sitemap);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


    module.exports = router;
    ```

### 2.3. Penyempurnaan Schema.org (Structured Data)

**Masalah:** Schema `BlogPosting` Anda sudah bagus, tetapi bisa lebih deskriptif untuk memberikan lebih banyak konteks kepada mesin pencari.

**Solusi:** Tambahkan properti seperti `wordCount` dan `keywords` ke dalam skrip JSON-LD Anda.

**Langkah-langkah:**

1.  **Hitung Jumlah Kata di Controller:** Sebelum merender `post-detail.ejs`, hitung jumlah kata dari konten postingan.

    ```javascript
    // Di dalam controller yang merender halaman detail post
    // (misalnya di dalam getPostBySlug di post-controller.js)

    const post = await Post.findOne({ slug: req.params.slug }).populate('userId');
    if (!post) return res.status(404).render('404');

    const wordCount = post.content.split(/\s+/).length; // Hitung jumlah kata

    res.render('post-detail', {
        post,
        wordCount, // Kirim wordCount ke template
        // ... variabel lainnya
    });
    ```

2.  **Perbarui Skrip JSON-LD di `post-detail.ejs`:**

    ```html
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "<%= post.title %>",
      "image": "<%= `${post.thumbnail}` %>",
      "author": {
        "@type": "Person",
        "name": "<%= post.userId.fullname %>" // Pastikan ini 'fullname' sesuai dengan data
      },
      "publisher": {
        "@type": "Organization",
        "name": "<%= locale.name %>",
        "logo": {
          "@type": "ImageObject",
          "url": "<%= locale.icon %>"
        }
      },
      "datePublished": "<%= post.createdAt.toISOString() %>",
      "dateModified": "<%= post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString() %>",
      "description": "<%= post.excerpt %>",
      "mainEntityOfPage": "<%= locale.url %>/<%= post.slug %>",
      "wordCount": "<%= wordCount %>", // Properti baru
      "keywords": "<%= post.tags.join(', ') %>" // Properti baru
    }
    </script>
    ```
