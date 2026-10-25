import { useState, useEffect } from 'react';

export default function IntransitForm({ onSave, editing, onCancel }) {
  const [form, setForm] = useState({ supco: '', tglsj: '', kdtk: '', nosj: '', kdcab: '', keter: '' });

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  if (!editing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nosj || !form.supco || !form.kdtk) return alert('Lengkapi!');
    onSave({ ...form, tglsj: form.tglsj?.substring(0,10) || '' });
  };

  const inputBox = { width: '100%', padding: '12px 14px', border: '2.5px solid black', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', outline: 'none' };
  const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#6b7280', marginBottom: '6px', display: 'block', letterSpacing: '1px' };

  const isEditMode = editing.nosj && editing.nosj !== '';

  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', zIndex: 999 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '92%', maxWidth: '520px', background: 'white', border: '3px solid black',
        borderRadius: '24px', boxShadow: '12px 12px 0px black', zIndex: 1000, overflow: 'hidden',
        animation: 'popUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ background: '#facc15', color: 'black', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid black' }}>
          <b style={{ fontSize: '14px' }}>{isEditMode ? `✏️ EDIT - ${editing.nosj}` : '➕ TAMBAH DATA BARU'}</b>
          <button onClick={onCancel} style={{ width: '32px', height: '32px', background: 'black', color: 'white', border: 'none', borderRadius: '50%', fontWeight: '900', cursor: 'pointer' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div><label style={labelStyle}>KODE TOKO *</label><input value={form.kdtk} onChange={e => setForm({...form, kdtk: e.target.value})} style={inputBox} /></div>
          <div><label style={labelStyle}>NO SJ *</label><input value={form.nosj} onChange={e => setForm({...form, nosj: e.target.value})} style={{...inputBox, background: '#fef08a'}} /></div>
          <div><label style={labelStyle}>TGL SJ *</label><input type="date" value={form.tglsj?.substring(0,10) || ''} onChange={e => setForm({...form, tglsj: e.target.value})} style={inputBox} /></div>
          <div><label style={labelStyle}>SUPCO *</label><input value={form.supco} onChange={e => setForm({...form, supco: e.target.value})} style={inputBox} /></div>
          <div><label style={labelStyle}>KODE CABANG *</label><input value={form.kdcab} onChange={e => setForm({...form, kdcab: e.target.value})} style={inputBox} /></div>
          <div><label style={labelStyle}>KETERANGAN</label><input value={form.keter} onChange={e => setForm({...form, keter: e.target.value})} style={{...inputBox, borderBottomWidth: '4px', borderColor: '#8b5cf6'}} /></div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '14px', background: 'black', color: 'white', border: '2.5px solid black', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black' }}>
              {isEditMode ? '💾 UPDATE' : '💾 SIMPAN'}
            </button>
            <button type="button" onClick={onCancel} style={{ padding: '14px 20px', background: 'white', border: '2.5px solid black', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}>BATAL</button>
          </div>
        </form>
      </div>
      <style>{`@keyframes popUp { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }`}</style>
    </>
  );
}