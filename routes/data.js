const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Endpoint GET untuk mengambil semua data
router.get("/", (req, res) => {
  db.query("SELECT * FROM data_baru", (err, result) => {
    if (err) return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    res.json(result);
  });
});

// Endpoint GET untuk mengambil data berdasarkan ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM data_baru WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.length === 0) return res.status(404).send("Data tidak ditemukan");
    res.json(results[0]);
  });
});

// Endpoint POST untuk menyimpan data baru (dengan upload gambar)
router.post("/", upload.single("gambar"), (req, res) => {
  const { nama, tinggi_badan, tanggal } = req.body;
  const gambar_path = req.file ? req.file.path : null;

  if (!nama || !tinggi_badan || !tanggal || !gambar_path) {
    return res.status(400).send("Semua kolom wajib diisi!");
  }

  const query = "INSERT INTO data_baru (nama, tinggi_badan, tanggal, gambar) VALUES (?, ?, ?, ?)";
  const values = [nama, parseInt(tinggi_badan), tanggal, gambar_path];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
    res.status(201).json({ message: "Data baru berhasil ditambahkan!", id: result.insertId });
  });
});

// Endpoint PUT untuk memperbarui data (dengan upload gambar opsional)
router.put("/:id", upload.single("gambar"), (req, res) => {
  const { nama, tinggi_badan, tanggal } = req.body;
  const id = req.params.id;
  const new_gambar_path = req.file ? req.file.path : null;

  // Pertama, ambil data lama untuk mendapatkan path gambar
  db.query("SELECT gambar FROM data_baru WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    if (results.length === 0) return res.status(404).json({ message: `Data dengan id ${id} tidak ditemukan.` });

    const old_gambar_path = results[0].gambar;
    const final_gambar_path = new_gambar_path || old_gambar_path;

    const query = `UPDATE data_baru SET nama = ?, tinggi_badan = ?, tanggal = ?, gambar = ? WHERE id = ?`;
    const values = [nama, parseInt(tinggi_badan), tanggal, final_gambar_path, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Terjadi kesalahan pada server." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: `Data dengan id ${id} tidak ditemukan.` });
      }

      // Jika ada gambar baru diunggah, hapus gambar lama
      if (new_gambar_path && old_gambar_path && old_gambar_path !== new_gambar_path) {
        fs.unlink(path.join(__dirname, '..', old_gambar_path), (unlinkErr) => {
          if (unlinkErr) console.error("Gagal menghapus file lama:", unlinkErr);
        });
      }

      res.status(200).json({
        message: `Data dengan id ${id} berhasil diperbarui.`,
        updatedData: { nama, tinggi_badan, tanggal, gambar: final_gambar_path }
      });
    });
  });
});

// Endpoint DELETE untuk menghapus data
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  // Pertama, ambil path gambar untuk dihapus
  db.query("SELECT gambar FROM data_baru WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.length === 0) return res.status(404).send("Data tidak ditemukan");

    const gambar_path_to_delete = results[0].gambar;

    // Hapus data dari database
    db.query("DELETE FROM data_baru WHERE id = ?", [id], (err, deleteResult) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (deleteResult.affectedRows === 0) return res.status(404).send("Data tidak ditemukan");

      // Hapus file gambar dari server
      if (gambar_path_to_delete) {
        fs.unlink(path.join(__dirname, '..', gambar_path_to_delete), (unlinkErr) => {
          if (unlinkErr) console.error("Gagal menghapus file gambar:", unlinkErr);
        });
      }

      res.status(200).json({ message: `Data dengan id ${id} berhasil dihapus.` });
    });
  });
});

module.exports = router;