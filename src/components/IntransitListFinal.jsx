import { useState, useMemo } from 'react';

export default function IntransitList({ intransits, onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const perPage = 4;

  const filtered = useMemo(() => {
    if (!search) return intransits;
    const s = search.toLowerCase();
    return intransits.filter(r => `${r.nosj} ${r.supco} ${r.kdtk} ${r.kdcab} ${r.keter}`.toLowerCase().includes(s));
  }, [intransits, search]);

  const totalPage = Math.ceil(filtered.length / perPage) || 1;
  const visibleData = filtered.slice(page * perPage, page * perPage + perPage);

  return (
    <div style={{ marginTop: '20px' }}>
      
      {/* SEARCH */}
      <div style={{ marginBottom: '16px' }}>
        <input 
          value={search} 
          onChange={e => { setSearch(e.target.value); setPage(0); }} 
          placeholder="🔍 Cari nosj / toko / supco..." 
          style={{ width: '100%', padding: '12px 16px', border: '2.5px solid black', borderRadius: '16px', fontWeight: 'bold', boxShadow: '4px 4px 0px black', outline: 'none' }} 
        />
      </div>

      {/* BOX LIST */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', paddingTop: '6px' }}>
        {visibleData.map(row => (
          <div key={row.nosj} style={{ minWidth: '310px', maxWidth: '310px', background: 'white', border: '2.5px solid black', borderRadius: '20px', boxShadow: '6px 6px 0px black', overflow: 'hidden', flexShrink: 0 }}>
            
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