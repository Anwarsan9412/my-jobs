import React from "react";
// import IntransitList from "./components/IntransitList";
import IntransitList from "./components/IntransitListFinal";
import IntransitForm from "./components/IntransitForm";
import { useIntransits } from "./hooks/useIntransits";
import UploadIntransit from "./components/intransitUpload";

export default function App() {
  const {intransits, editing,setEditing,remove,save, handleUpload} = useIntransits();

  return (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontWeight: '900', borderLeft: '6px solid black', paddingLeft: '12px', marginBottom: '16px' }}>INTRANSIT APP</h2>

        {/* UPLOAD CSV */}
      <div style={{ background: 'white', border: '2.5px solid black', borderRadius: '20px', boxShadow: '6px 6px 0px black', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ background: 'white', color: 'black', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}>
            📤 UPLOAD CSV
            <input type="file" accept=".csv" hidden onChange={handleUpload} />
          </label>

          {!editing && (
            <button 
              onClick={() => setEditing({ supco: '', tglsj: new Date().toISOString().substring(0,10), kdtk: '', nosj: '', kdcab: '', keter: '' })} 
              style={{ background: 'white', color: 'black', border: '2.5px solid black', borderRadius: '50px', padding: '10px 18px', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
            >
              ➕ TAMBAH DATA
            </button>
          )}
        </div>

        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', background: '#f3f4f6', padding: '6px 12px', borderRadius: '50px', border: '2px solid black' }}>
          TOTAL: {intransits.length}
        </span>
      </div>

      {/* MODAL POPUP - TARUH DI LUAR */}
      <IntransitForm 
        editing={editing} 
        onSave={save} 
        onCancel={() => setEditing(null)} 
      />

      <IntransitList intransits={intransits} onEdit={setEditing} onDelete={remove} />
    </div>

  );



}