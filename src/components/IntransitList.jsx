import { useState, useMemo, useEffect } from 'react';

const IntransitList = ({ intransits = [], onEdit, onDelete, editing,handleUpload,search, setSearch, filterTanggal, setFilterTanggal}) => {
  // const [search, setSearch] = useState('');
  // const [filterTanggal, setFilterTanggal] = useState(''); 
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 1. SEARCH FILTER
// const filtered = useMemo(() => {
//   if (!search) return intransits;
//   const keywords = search.split(/[,;\n\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
//   return intransits.filter(item => {
//     const nosj = (item.nosj || '').toLowerCase();
//     const kdtk = (item.kdtk || '').toLowerCase();
//     const keter = (item.keter || '').toLowerCase();
//     const supco = (item.supco || '').toLowerCase();
//     const kdcab = (item.kdcab || '').toLowerCase();
//     return keywords.some(k => 
//       nosj.includes(k) || 
//       kdtk.includes(k) ||
//       keter.includes(k) ||
//       supco.includes(k) ||
//       kdcab.includes(k) ||
//       nosj === k || 
//       kdtk === k || 
//       keter === k
//     );
//   });
// }, [search, intransits]);
// 1. SEARCH + TANGGAL FILTER

console.log(filterTanggal);

  const filtered = useMemo(() => {
    let data = intransits;

    // FILTER TANGGAL DULU
    if (filterTanggal) {
      data = data.filter(item => {
        if (!item.tglsj) return false;
        // tglsj dari backend bisa "2026-11-05T00:00:00.000Z" / "2026-11-05"
        const tglItem = String(item.tglsj).slice(0, 7);
        return tglItem === filterTanggal;
      });
    }

    // FILTER SEARCH
    if (search) {
      const keywords = search.split(/[,;\n\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
      data = data.filter(item => {
        const nosj = (item.nosj || '').toLowerCase();
        const kdtk = (item.kdtk || '').toLowerCase();
        const keter = (item.keter || '').toLowerCase();
        const supco = (item.supco || '').toLowerCase();
        const kdcab = (item.kdcab || '').toLowerCase();
        return keywords.some(k => 
          nosj.includes(k) || 
          kdtk.includes(k) ||
          keter.includes(k) ||
          supco.includes(k) ||
          kdcab.includes(k) ||
          nosj === k || 
          kdtk === k || 
          keter === k
        );
      });
    }

    return data;
  }, [search, filterTanggal, intransits]);



  // 2. PAGINATION
  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // 3. EXPORT CSV
  const handleExportCSV = () => {
    const header = ['supco','tglsj','kdtk','nosj','kdcab','keter'];
    const rows = filtered.map(row => header.map(h => `"${row[h] || ''}"`).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intransit_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      
      {/* TOP BAR - SEARCH + EXPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text"
          placeholder="🔍 SEARCH 2610290062,2610290346..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: '200px', border: '2.5px #9ca3af black', borderRadius: '50px', padding: '10px 16px', fontWeight: '700', outline: 'none' }}
        />
          {/* MENU TANGGAL DI SEBELAH SEARCH */}
        <input
          type="month" // <-- dari "date" jadi "month"
          value={filterTanggal || ''}
          onChange={(e) => setFilterTanggal(e.target.value)}
          style={{ minWidth: '200px', borderRadius: '10px', border: '2.5px #9ca3af black',padding: '10px 16px',  outline: 'none' }}
        />
        <button onClick={() => { setSearch(''); setFilterTanggal(''); }}>Reset</button>
         
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f3f4f6', border: '2px #9ca3af black', borderRadius: '50px', padding: '10px 16px', fontWeight: '900', fontSize: '11px' }}>
            TOTAL: {filtered.length}
          </span>
            <label style={{ background: 'white', color: 'black', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}>
            📤 UPLOAD CSV
            <input type="file" accept=".csv" hidden onChange={handleUpload} />
          </label>
          {!editing && (
            <button 
              onClick={() => onEdit({ supco: '', tglsj: new Date().toISOString().substring(0,10), kdtk: '', nosj: '', kdcab: '', keter: '' })} 
              style={{ background: 'white', color: 'black', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
            >
              ➕ TAMBAH DATA
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            style={{ background: 'white', color: 'black', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', fontSize: '11px', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
          >
            📊 EXPORT EXCEL
          </button>
        </div>
      </div>

      {/* LIST */}
      <div style={{ background: 'transparent' }}>
        <div style={{ display: 'flex', padding: '10px 16px', fontWeight: '900', fontSize: '11px', borderBottom: '2px solid black', background: '#252526',  borderRadius: '10px' }}>
          <div style={{ flex: 1, color: 'white' }}>SUPCO</div>
          <div style={{ flex: 1, color: 'white' }}>TGL SJ</div>
          <div style={{ flex: 1, color: 'white' }}>KDTK</div>
          <div style={{ flex: 1, color: 'white'}}>NO SJ</div>
          <div style={{ flex: 1, color: 'white'}}>KDCAB</div>
          <div style={{ flex: 1, color: 'white'}}>KETERANGAN</div>
          <div style={{ width: '120px', textAlign: 'right' }}>AKSI</div>
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', fontWeight: '900' }}>DATA KOSONG</div>
        ) : (
          paginated.map((item, index) => (
            <div key={index} style={{ display: 'flex', padding: '14px 4px', fontSize: '13px', alignItems: 'center', borderBottom: '1.5px dashed black' }}>
              <div style={{ flex: 1, fontWeight: '700' }}>{item.supco}</div>
              <div style={{ flex: 1 }}>{item.tglsj}</div>
              <div style={{ flex: 1 }}>{item.kdtk}</div>
              <div style={{ flex: 1 }}>{item.nosj}</div>
              <div style={{ flex: 1 }}>{item.kdcab}</div>
              <div style={{ flex: 1 }}>{item.keter}</div>
              <div style={{ width: '120px', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button onClick={() => onEdit(item)} style={{ background: 'white', border: '2px solid #9ca3af', borderRadius: '50px', padding: '4px 10px', fontWeight: '900', fontSize: '10px', cursor: 'pointer' }}>EDIT</button>
                <button  onClick={() => { if(window.confirm(`Hapus ${item.nosj} ?`)) onDelete(item.id) }}  style={{ background: 'black', color: 'white', border: '2px solid #9ca3af', borderRadius: '50px', padding: '4px 10px', fontWeight: '900', fontSize: '10px', cursor: 'pointer' }}>HAPUS</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ border: '2px solid black', borderRadius: '50px', padding: '6px 14px', fontWeight: '900', cursor: 'pointer', opacity: page === 1 ? 0.3 : 1 }}>‹ PREV</button>
          {Array.from({ length: totalPage }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => setPage(num)} style={{ background: page === num ? 'black' : 'white', color: page === num ? 'white' : 'black', border: '2px solid black', borderRadius: '50px', padding: '6px 12px', fontWeight: '900', cursor: 'pointer' }}>{num}</button>
          ))}
          <button disabled={page === totalPage} onClick={() => setPage(p => p + 1)} style={{ border: '2px solid black', borderRadius: '50px', padding: '6px 14px', fontWeight: '900', cursor: 'pointer', opacity: page === totalPage ? 0.3 : 1 }}>NEXT ›</button>
        </div>
      )}
    </div>
  );
};

export default IntransitList;