import { useState } from 'react';
import axios from 'axios';

const UploadIntransit = ({ handleUpload }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
    
//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:5000/api/intransits/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setResult(res.data);
//       alert(`Sukses! Baru: ${res.data.inserted}, Update keter: ${res.data.updated}, Skip: ${res.data.skipped}`);
//     //   load(); // refresh tabel
//     if (typeof fetchData === 'function') fetchData();
//     else if (typeof getIntransits === 'function') getIntransits();
//     else if (typeof loadData === 'function') loadData();
//     else window.location.reload();
//     } catch (err) {
//       alert('Gagal upload: ' + err.message);
//     } finally {
//       setLoading(false);
//       e.target.value = ''; // reset input
//     }
//   };

  return (
    <div style={{ marginBottom: '20px' }}>
  <div style={{ 
    background: 'white', 
    border: '2.5px solid black', 
    borderRadius: '20px', 
    boxShadow: '6px 6px 0px black', 
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  }}>
    {/* Tombol Upload */}
    <label style={{ 
      background: 'black', 
      color: 'white', 
      padding: '12px 20px', 
      borderRadius: '50px', 
      fontWeight: '900', 
      fontSize: '13px', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: '2.5px solid black',
      boxShadow: '3px 3px 0px black'
    }}>
      <span>{loading ? '⏳' : '📤'}</span> 
      {loading ? 'PROSES...' : 'UPLOAD CSV INTRANSIT'}
      <input type="file" accept=".csv" hidden onChange={handleUpload} disabled={loading} />
    </label>

    {/* Hasil */}
    {result ? (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ background: '#f3f4f6', border: '2px solid black', borderBottom: '4px solid black', borderRadius: '12px', padding: '6px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: 0 }}>TOTAL</p>
          <b style={{ fontSize: '14px' }}>{result.total}</b>
        </div>
        <div style={{ background: '#dcfce7', border: '2px solid #22c55e', borderBottom: '4px solid #22c55e', borderRadius: '12px', padding: '6px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>INSERT</p>
          <b style={{ fontSize: '14px', color: '#15803d' }}>+{result.inserted}</b>
        </div>
        <div style={{ background: '#fef08a', border: '2px solid #eab308', borderBottom: '4px solid #eab308', borderRadius: '12px', padding: '6px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#a16207', margin: 0 }}>UPDATE</p>
          <b style={{ fontSize: '14px', color: '#854d0e' }}>↻{result.updated}</b>
        </div>
      </div>
    ) : (
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', letterSpacing: '1px' }}>FORMAT: .CSV • MAX 5MB</span>
    )}
  </div>
</div>
  );
};

export default UploadIntransit;