# Dashboard RSUD Sidoarjo Barat

## Jalankan di XAMPP

1. Ekstrak ZIP ke `C:\xampp\htdocs\dashboardsibar` sehingga `index.html` dan folder `assets` berada langsung di dalam `dashboardsibar`.
2. Jalankan Apache dari XAMPP.
3. Buka `http://localhost/dashboardsibar/`.

Frontend ini menggunakan HTML, CSS, dan JavaScript. Semua aset disertakan dan aplikasi dapat dijalankan tanpa npm atau Composer.

## Akun contoh

| Peran | Nama pengguna | Kata sandi |
| --- | --- | --- |
| Admin | `admin` | `demo` |
| Direktur | `direktur` | `demo` |

Kunjungan dan Penjaminan dapat dibuka tanpa login. Master dan Laporan tersedia untuk kedua peran demo. Pengaturan panel dan interval disimpan di browser. Angka laporan adalah simulasi berdasarkan periode yang dipilih.

Pada laporan Direktur, tombol **Tanda Tangani** menambahkan penanda teks `$qrcode` dan `$nomor` ke pratinjau serta PDF. `$nomor` dicetak putih. Distribusi ini mencakup persiapan PDF di sisi frontend. Autentikasi produksi, koneksi data RSUD, dan pemrosesan dokumen eBuddy memerlukan integrasi backend.

## Tambah, edit, dan hubungkan panel ke database

1. Masuk sebagai `admin` atau `direktur`, kata sandi `demo`.
2. Buka **Master**, pilih **Kunjungan** atau **Penjaminan**, lalu klik **Tambah Container**.
3. Pilih **Bar horizontal**, **Bar vertikal**, **Garis**, **Doughnut**, **Kartu angka**, atau **Tabel**. Pilih sumber **Data contoh**, **Input manual**, atau **Endpoint API**.
4. Untuk input manual, isi satu pasangan label dan angka per baris, misalnya `BPJS; 120`. Nilai manual tetap sama saat tanggal berubah.
5. Untuk API, isi path yang disediakan backend, misalnya `./api/kunjungan.php`. Gunakan Apache dan uji endpoint dari browser. Dashboard mengirim `GET /dashboardsibar/api/kunjungan.php?date=2026-11-16` dengan tanggal pilihan. Bentuk respons JSON:

```json
{"rows":[{"label":"Rawat Jalan","value":486},{"label":"IGD","value":117}]}
```

Endpoint perlu membaca tanggal, menjalankan query agregat sesuai tanggal WIB, dan mengembalikan 1–50 baris dengan nilai angka nonnegatif. Letakkan koneksi DB, kredensial, query berparameter, dan kontrol akses di backend. Jika API beda origin, konfigurasi CORS di server bila diperlukan. Endpoint contoh di atas adalah ilustrasi path. Gunakan **Tambah** lalu **Simpan perubahan**. Panel buatan sendiri bisa diedit atau dihapus dari Master.

Pemilih tanggal kanan berlaku pada Kunjungan dan Penjaminan. **Hari ini** mengembalikan tanggal ke hari berjalan. Panel bawaan memakai angka demo. Pengaturan panel disimpan di browser. API panel tambahan dimuat sesuai tanggal dan disegarkan mengikuti interval dashboard. Laporan tetap memakai data demo dan memiliki tanggal laporan sendiri.

**Save as Image** membuat PNG dashboard aktif. **Unduh PDF** membuat PDF A4. Keduanya bisa dijalankan dari file lokal. Untuk panel API gunakan URL lokal XAMPP melalui Apache.

