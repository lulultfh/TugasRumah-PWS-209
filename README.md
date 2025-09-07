# Tugas Rumah Mata Kuliah Pengembangan Web Service
> author: Lu'lu' Luthfiah - 20230140209

## Table of Content
- [Deskripsi Program](#deskripsi-program)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Project Documentation](#project-documentation)

## Deskripsi Program
Aplikasi web sederhana yang terdiri dari basis data MySQL, API dengan Node.js (Express.js), dan antarmuka HTML + JavaScript.

## Project Structure
```
├── db/
│   ├── db.js                          # Konfigurasi dan inisialisasi koneksi ke MySQL
├── public/
│   ├── css/
│   ├── index.html
│   ├── daftar.html
├── routes/                            # Routing API untuk CRUD
│   ├── data.js
├── uploads/                           # Untuk menyimpan gambar yang diunggah
├── .env
├── index.js                           # Entry point server Express
└── README.md                          # Dokumentasi utama proyek
```

## How to Run
1. Clone Repository (Jalankan di dalam WSL)
   ```
   git clone https://github.com/lulultfh/TugasRumah-PWS-209.git
   cd TugasRumah-PWS-209
   ```
2. Set Up MySQL Workbench
   - Buat database di MySQL Workbench dengan nama `biodata-db`
   - Import file `data-baru.sql` dari repository ini
3. Set Up Env
   - Buka file `.env` di root project.
   - Sesuaikan PORT, DB_HOST, DB_USER, dan DB_PASSWORD dengan konfigurasi MySQL Workbench kamu
5. Install dependencies
   ```
   npm install
   ```
6. Run Project
   ```
   node server.js
   ```

## Project Documentation
| Page | Screenshot |
|---|---|
| **Input Page** |<img width="1919" height="1005" alt="image" src="https://github.com/user-attachments/assets/10ec4494-5fe5-4353-bf8e-6eb3b9369aba" />|
| **Input Data** |<img width="1919" height="1009" alt="image" src="https://github.com/user-attachments/assets/91ff13f9-d1a4-4835-aeaf-c2ad94c31786" />|
| **Daftar Data** |<img width="1919" height="1007" alt="image" src="https://github.com/user-attachments/assets/7f209322-e3ed-4507-a4ca-7be468ce6ddf" />|
| **Daftar Data di Database** |<img width="1918" height="1008" alt="image" src="https://github.com/user-attachments/assets/7f722711-a980-4ecf-98bd-893e7cf5c1e1" />|
