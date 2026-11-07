const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse');

const app = express();
app.use(cors());
app.use(express.json());

const XLSX = require('xlsx');

// const upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const upload = multer({ dest: 'uploads/' });

// KONEKSI DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', // isi password mysql kamu, default xampp kosong
  port: 3307,
  database: 'data',
  dateStrings: true, // <-- TAMBAH INI WAJIB  MySQL 2025-11-02 -> Node.js baca jadi 2025-11-01T17:00:00.000Z (jadi objek Date, kena timezone).
  timezone: '+07:00' // <-- TAMBAH INI JUGA
});

db.connect(err => {
  if(err) throw err;
  console.log('MySQL Connected!');
});


// function toMySQLDate(s) {
//   if (!s) return new Date().toISOString().substring(0,10);
//   s = String(s).trim();
//   if (s === '' || s === '0000-00-00' || s === 'NULL') {
//     return new Date().toISOString().substring(0,10);
//   }

//   // Sudah 2026-10-25
//   if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0,10);

//   // Format DD/MM/YYYY -> 28/10/2026 (DATA KAMU YANG INI)
//   if (s.includes('/')) {
//     const p = s.split('/').map(x => x.trim());
//     let d, m, y;

//     // Cek apakah DD/MM/YYYY atau MM/DD/YYYY
//     // Kalau p[0] > 12, pasti DD/MM/YYYY
//     if (parseInt(p[0]) > 12) {
//       d = p[0]; m = p[1]; y = p[2] || '2026';
//     } else if (parseInt(p[1]) > 12) {
//       // MM/DD/YYYY
//       m = p[0]; d = p[1]; y = p[2] || '2026';
//     } else {
//       // Default anggap DD/MM/YYYY karena data Indonesia
//       d = p[0]; m = p[1]; y = p[2] || '2026';
//     }

//     y = y.length === 2 ? '20' + y : y;

//     d = d.padStart(2,'0');
//     m = m.padStart(2,'0');

//     // Validasi
//     if (parseInt(m) >=1 && parseInt(m) <=12 && parseInt(d) >=1 && parseInt(d) <=31) {
//       return `${y}-${m}-${d}`;
//     }
//   }
  
//   // Fallback biar gak pernah null
//   return new Date().toISOString().substring(0,10);
// }
function formatTglStrict(tglRaw) {
  const t = String(tglRaw).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    throw new Error(`Format tglsj harus yyyy-MM-dd, dapat: ${t}`);
  }
  return t;
}


app.post('/api/intransits/upload', upload.any(), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({message:'File kosong'});

  const file = req.files[0];
  const rows = [];
  
  fs.createReadStream(file.path)
    .pipe(parse({ 
      delimiter: '|', 
      columns: ['supco','nosj','tglsj','kdtk','kdcab','keter'],
      from_line: 2, 
      trim: true,
      relax_column_count: true, // Biar baris yang keternya kosong gak crash
    }))
    .on('data', d => {
      // AMANKAN - kalau keter kosong dari csv jadi undefined
      d.keter = (d.keter || '').toString().trim();
      d.nosj = (d.nosj || '').toString().trim();
      d.kdtk = (d.kdtk || '').toString().trim();
      rows.push(d);
    })
    .on('end', async () => {
      let inserted=0, updated=0, skipped=0;
      try {
        for (const r of rows) {
          if (!r.nosj || !r.kdtk) { skipped++; continue; } // skip baris cacat

          // const tgl = toMySQLDate(r.tglsj);
          try {
              tgl = formatTglStrict(r.tglsj);
            } catch (e) {
              console.log(`Baris nosj ${r.nosj} skip karena ${e.message}`);
              skipped++;
              continue; // <-- skip baris ini
          }

          const [exist] = await db.promise().query('SELECT keter FROM intransit WHERE nosj=? AND kdtk=?', [r.nosj, r.kdtk]);
          
          if (exist.length > 0) {
            const dbKeter = (exist[0].keter || '').toString().trim();
            const uploadKeter = (r.keter || '').toString().trim();

            // LOGIC BARU:
            // 1. Kalau upload kosong -> JANGAN UPDATE, skip
            // 2. Kalau upload ada isi dan beda dengan DB -> baru update
            if (!uploadKeter) {
              skipped++; // ini yang kamu mau, data lama tetap
              continue;
            }

            if (dbKeter !== uploadKeter) {
              await db.promise().query('UPDATE intransit SET keter=? WHERE nosj=? AND kdtk=?', [uploadKeter, r.nosj, r.kdtk]);
              updated++;
            } else {
              skipped++; // sama persis, gak perlu update
            }

          } else {
            await db.promise().query(
              'INSERT INTO intransit (supco,nosj,tglsj,kdtk,kdcab,keter) VALUES (?,?,?,?,?,?)',
              [r.supco, r.nosj, tgl, r.kdtk, r.kdcab, (r.keter || '')]
            );
            inserted++;
          }
        }
        fs.unlinkSync(file.path);
        res.json({message:'OK', inserted, updated, skipped, total: rows.length});
      } catch (err) {
        console.error(err);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(500).json({message: err.message});
      }
    })
    .on('error', (err) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(500).json({message: 'CSV Error: ' + err.message});
    });
});



app.get('/api/intransits', (req, res) => {
  db.query("SELECT id, supco,nosj, DATE_FORMAT(tglsj, '%Y-%m-%d') as tglsj, kdtk, kdcab, keter,created_at,updated_at FROM intransit order by tglsj desc ", (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

// app.post('/api/intransits', (req, res) => {
//   const { supco,nosj, tglsj, kdtk,  kdcab, keter } = req.body;
//   const cleanTgl = tglsj ? tglsj.substring(0, 10) : null;
//   db.query('INSERT INTO intransit (supco,nosj, tglsj, kdtk,  kdcab, keter) VALUES (?, ?, ?, ?, ?, ?)', [supco, nosj,cleanTgl, kdtk,  kdcab, keter], (err, result) => {
//     if(err) return res.status(500).json(err);
//     res.json({ id: result.insertId, supco, nosj, tglsj, kdtk, kdcab, keter });
//   });
// });
// backend - routes/intransit.js
app.get('/api/intransits', async (req, res) => {
  const { search, tglsj,bulan_dari, bulan_sampai } = req.query;
  let sql = 'SELECT * FROM intransit WHERE 1=1';
  let params = [];

  if (search) {
    sql += ' AND (nosj LIKE ? OR kdtk LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // if (tglsj) {
  //   sql += ` AND DATE_FORMAT(tglsj, '%Y-%m') = ?`;
  //   params.push(tglsj); // format yyyy-MM-dd
  // }

    // Kalau pilih 2 bulan (yang baru - RANGE)
  if (bulan_dari && bulan_sampai) {
    sql += ` AND DATE_FORMAT(tglsj, '%Y-%m') BETWEEN ? AND ?`;
    params.push(bulan_dari, bulan_sampai); // "2026-10" sampai "2026-11"
  } else if (bulan_dari && !bulan_sampai) {
    // Kalau cuma isi Dari aja, anggap sama kayak tglsj
    sql += ` AND DATE_FORMAT(tglsj, '%Y-%m') = ?`;
    params.push(bulan_dari);
  }

  sql += ' ORDER BY tglsj DESC';
  const [rows] = await db.promise().query(sql, params);
  res.json(rows);
});

app.put('/api/intransits/:id', (req, res) => {
  const { supco, nosj, tglsj, kdtk, kdcab, keter } = req.body;
  const cleanTgl = tglsj ? tglsj.substring(0,10) : null;
  
  db.query('UPDATE intransit SET supco=?, nosj=?, tglsj=?, kdtk=?, kdcab=?, keter=? WHERE id=?', 
  [supco,  nosj,cleanTgl, kdtk, kdcab, keter, req.params.id], (err) => {
    if(err) return res.status(500).json(err);
    res.json({ message: 'Updated' });
  });
});

app.delete('/api/intransits/:id', (req, res) => {
  db.query('DELETE FROM intransit WHERE id=?', [req.params.id], (err) => {
    if(err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});




app.get('/api/intransits/export', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT supco,nosj,tglsj,kdtk,kdcab,keter FROM intransit ORDER BY tglsj ASC');
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "INTRANSIT");
    const buf = XLSX.write(wb, {type:'buffer', bookType:'xlsx'});
    res.setHeader('Content-Disposition', 'attachment; filename=INTRANSIT.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch(e){ res.status(500).json({message:e.message}) }
});




app.listen(5000, () => console.log('Server jalan di http://localhost:5000'));