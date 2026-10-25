const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse');

const app = express();
app.use(cors());
app.use(express.json());

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
  dateStrings: true, // <-- TAMBAH INI WAJIB
  timezone: '+07:00' // <-- TAMBAH INI JUGA
});

db.connect(err => {
  if(err) throw err;
  console.log('MySQL Connected!');
});

// FUNGSI PARSE TANGGAL ANTI 0000-00-00
function toMySQLDate(s) {
  if (!s) return null;
  s = String(s).trim();
  if (s === '' || s === '0000-00-00' || s === 'NULL') return null;

  // Sudah benar 2026-10-25 atau 2026-10-25 13:14:44
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0,10);

  // Format 6/26/2026 atau 6/26/26 atau 6/26 atau 10/1
  if (s.includes('/')) {
    const p = s.split('/');
    let m = p[0].padStart(2,'0');
    let d = p[1].padStart(2,'0');
    let y = '2026';
    if (p[2]) {
      y = p[2].length === 2 ? '20' + p[2] : p[2];
      if (y.length === 1) y = '200' + y; // jaga2
    }
    // validasi bulan 1-12, tanggal 1-31
    if (parseInt(m) >=1 && parseInt(m) <=12) {
      return `${y}-${m}-${d}`;
    }
  }
  return null; // kalau gak jelas, jadi NULL bukan 0000-00-00
}

app.post('/api/intransits/upload', upload.any(), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({message:'File kosong'});

  const file = req.files[0];
  const rows = [];
  
  fs.createReadStream(file.path)
    .pipe(parse({ 
      delimiter: '|', 
      columns: ['supco','nosj','tglsj','kdtk','kdcab','keter'], // <-- SESUAI SCREENSHOT KAMU
      from_line: 2, 
      trim: true 
    }))
    .on('data', d => rows.push(d))
    .on('end', async () => {
      let inserted=0, updated=0;
      for (const r of rows) {
        const tgl = toMySQLDate(r.tglsj);
        const [exist] = await db.promise().query('SELECT keter FROM intransit WHERE nosj=? AND kdtk=?', [r.nosj, r.kdtk]);
        
        if (exist.length > 0) {
          if (exist[0].keter !== r.keter) {
            await db.promise().query('UPDATE intransit SET keter=? WHERE nosj=? AND kdtk=?', [r.keter, r.nosj, r.kdtk]);
            updated++;
          }
        } else {
          await db.promise().query(
            'INSERT INTO intransit (supco,nosj,tglsj,kdtk,kdcab,keter) VALUES (?,?,?,?,?,?)',
            [r.supco, r.nosj, tgl, r.kdtk, r.kdcab, r.keter]
          );
          inserted++;
        }
      }
      fs.unlinkSync(file.path);
      res.json({message:'OK', inserted, updated, total: rows.length});
    });
});



app.get('/api/intransits', (req, res) => {
  db.query("SELECT id, supco,nosj, DATE_FORMAT(tglsj, '%Y-%m-%d') as tglsj, kdtk, kdcab, keter,created_at,updated_at FROM intransit", (err, results) => {
    if(err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/intransits', (req, res) => {
  const { supco,nosj, tglsj, kdtk,  kdcab, keter } = req.body;
  const cleanTgl = tglsj ? tglsj.substring(0, 10) : null;
  db.query('INSERT INTO intransit (supco,nosj, tglsj, kdtk,  kdcab, keter) VALUES (?, ?, ?, ?, ?, ?)', [supco, nosj,cleanTgl, kdtk,  kdcab, keter], (err, result) => {
    if(err) return res.status(500).json(err);
    res.json({ id: result.insertId, supco, nosj, tglsj, kdtk, kdcab, keter });
  });
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




app.listen(5000, () => console.log('Server jalan di http://localhost:5000'));