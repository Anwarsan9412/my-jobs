import React from 'react' ;
import Header from '../Header';
import IntransitForm from '../IntransitForm' ;
import IntransitList from "../IntransitList";

const Intransit = ({ intransits, editing, setEditing, handleUpload, handleExportExcel, save, remove }) => {
  return (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Header />
      <h2 style={{ fontWeight: '900', borderLeft: '6px solid black', paddingLeft: '12px', marginBottom: '16px' }}>INTRANSIT APP</h2>
          <IntransitForm editing={editing} onSave={save} onCancel={() => setEditing(null)} />
          <IntransitList intransits={intransits} onEdit={setEditing} onDelete={remove} handleExportExcel={handleExportExcel} />
    </div>
  )
}

export default Intransit
