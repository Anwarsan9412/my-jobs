import { useState, useMemo } from 'react';

const IntransitList = ({ intransits = [], onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 1. SEARCH FILTER
  const filtered = useMemo(() => {
    if (!search) return intransits;
    const s = search.toLowerCase();
    return intransits.filter(item => 
      (item.supco?.toLowerCase().includes(s)) ||
      (item.nosj?.toLowerCase().includes(s)) ||
      (item.kdtk?.toLowerCase().includes(s)) ||
      (item.kdcab?.toLowerCase().includes(s))
    );
  }, [search, intransits]);

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
          placeholder="🔍 SEARCH SUPCO / NO SJ / KDTK..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: '200px', border: '2.5px #9ca3af black', borderRadius: '50px', padding: '10px 16px', fontWeight: '700', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: '#f3f4f6', border: '2px #9ca3af black', borderRadius: '50px', padding: '10px 16px', fontWeight: '900', fontSize: '11px' }}>
            TOTAL: {filtered.length}
          </span>
          <button 
            onClick={handleExportCSV}
            style={{ background: '#303231', color: 'white', border: '2.5px #9ca3af black', borderRadius: '50px', padding: '10px 16px', fontWeight: '900', fontSize: '11px', boxShadow: '3px 3px 0px black', cursor: 'pointer' }}
          >
            📥 EXPORT CSV
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
              <div style={{ flex: 1 }}>{item.keter}</div>
              <div style={{ width: '120px', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button onClick={() => onEdit(item)} style={{ background: 'white', border: '2px solid #9ca3af', borderRadius: '50px', padding: '4px 10px', fontWeight: '900', fontSize: '10px', cursor: 'pointer' }}>EDIT</button>
                <button onClick={() => onDelete(item)} style={{ background: 'black', color: 'white', border: '2px solid #9ca3af', borderRadius: '50px', padding: '4px 10px', fontWeight: '900', fontSize: '10px', cursor: 'pointer' }}>HAPUS</button>
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