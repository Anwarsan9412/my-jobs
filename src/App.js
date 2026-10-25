import React from "react";
// import IntransitList from "./components/IntransitList";
import IntransitList from "./components/IntransitListFinal";
import IntransitForm from "./components/IntransitForm";
import { useIntransits } from "./hooks/useIntransits";
import UploadIntransit from "./components/intransitUpload";

export default function App() {
  const {intransits, editing,setEditing,remove,save, handleUpload} = useIntransits();

  return (
  <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontWeight: '900', borderLeft: '6px solid black', paddingLeft: '12px', marginBottom: '16px' }}>INTRANSIT APP</h2>

        {/* UPLOAD CSV */}
        <div style={{ background: 'white', border: '2.5px solid black', borderRadius: '20px', boxShadow: '6px 6px 0px black', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ background: 'black', color: 'white', padding: '10px 18px', borderRadius: '50px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>
            📤 UPLOAD CSV
            <input type="file" accept=".csv" hidden onChange={handleUpload} />
          </label>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af' }}>TOTAL: {intransits.length}</span>
        </div>

        {/* MODAL POPUP - EDITING DARI HOOK */}
        <IntransitForm 
          editing={editing} 
          onSave={save} 
          onCancel={() => setEditing(null)} 
        />

        {/* TOMBOL TAMBAH - CUMA MUNCUL KALAU TIDAK LAGI EDITING */}
        {!editing && (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button 
              onClick={() => setEditing({ supco: '', tglsj: new Date().toISOString().substring(0,10), kdtk: '', nosj: '', kdcab: '', keter: '' })} 
              style={{ background: 'black', color: 'white', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
            >
              ➕ TAMBAH DATA
            </button>
          </div>
        )}


      <UploadIntransit handleUpload={handleUpload} />
      <IntransitList intransits={intransits} onEdit={setEditing} onDelete={remove} />
    </div>

  );



}