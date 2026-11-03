import { useState, useMemo } from 'react';

export default function IntransitList({ intransits, onEdit, onDelete,editing,handleUpload }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const perPage = 6;

  const filtered = useMemo(() => {
    if (!search) return intransits;
    const s = search.toLowerCase();
    return intransits.filter(r => `${r.nosj} ${r.supco} ${r.kdtk} ${r.kdcab} ${r.keter}`.toLowerCase().includes(s));
  }, [intransits, search]);

  const totalPage = Math.ceil(filtered.length / perPage) || 1;
  const visibleData = filtered.slice(page * perPage, page * perPage + perPage);

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


      {/* BOX LIST */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '16px' 
        }}>
        {visibleData.map(row => (
          <div key={row.id} style={{ width: '100%', background: 'white', border: '2.5px solid black', borderRadius: '20px', boxShadow: '6px 6px 0px black', overflow: 'hidden' }}>
            
            <div style={{ background: 'black', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <b style={{ fontSize: '12px' }}>{row.supco}</b>
              <span style={{ background: 'white', color: 'black', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '20px' }}>{row.kdcab}</span>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1.5px dashed #d1d5db' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af' }}>NO SJ</span><b>{row.nosj}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1.5px dashed #d1d5db' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af' }}>KODE TOKO</span><b style={{ background: '#fef08a', padding: '2px 10px', borderRadius: '20px', border: '1.5px solid black' }}>{row.kdtk}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '3px solid black' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af' }}>TGL SJ</span><b style={{ fontSize: '12px' }}>{row.tglsj?.substring(0,10)}</b>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center', padding: '10px', background: '#f5f3ff', border: '2px solid #ddd6fe', borderBottom: '4px solid #8b5cf6', borderRadius: '12px', fontWeight: '900', fontSize: '12px', color: '#6d28d9' }}>{row.keter}</div>

              {/* TOMBOL EDIT HAPUS - NYAMBUNG KE App.js */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button 
                  onClick={() => onEdit(row)} 
                  style={{ flex: 1, padding: '10px', background: '#fef08a', color: 'black', borderRadius: '12px', fontWeight: '900', border: '2px solid black', cursor: 'pointer' }}
                >
                  ✏️ EDIT
                </button>
                <button 
                onClick={() => { if(window.confirm(`Hapus ${row.nosj} ?`)) onDelete(row.id) }} 
                style={{ flex: 1, padding: '10px', background: '#fecaca', color: 'black', borderRadius: '12px', fontWeight: '900', border: '2px solid black', cursor: 'pointer' }}
                >
                🗑️ HAPUS
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '2.5px solid black', borderRadius: '50px', padding: '6px 10px', boxShadow: '4px 4px 0px black' }}>
          <button onClick={() => setPage(p => Math.max(0, p-1))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'black', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer' }}>‹</button>
          <b style={{ fontSize: '12px' }}>{page+1} / {totalPage}</b>
          <button onClick={() => setPage(p => Math.min(totalPage-1, p+1))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'black', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer' }}>›</button>
        </div>
      </div>

    </div>
  );
}