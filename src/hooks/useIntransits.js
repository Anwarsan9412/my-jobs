import { useState, useEffect } from "react";
import { intransitServices } from "../services/intransitServices";
import * as XLSX from 'xlsx';

export function useIntransits(){
    const [intransits, setIntransits] = useState([]);
    const [editing, setEditing] = useState(null);

    const load = async()=>{
        const data = await intransitServices.getAll()
        setIntransits(data);
    };

    useEffect(()=> {load();},[]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
        const result = await intransitServices.upload(file);
        alert(`Sukses! Baru: ${result.inserted}, Update: ${result.updated}`);
        await load(); // refresh data
        } catch (err) {
        alert('Gagal: ' + (err.response?.data?.message || err.message));
        }
        e.target.value = null;
    };

    const handleExportExcel = () => {
  const dataToExport = intransits.length > 0 ? intransits : intransits;
  
  if (dataToExport.length === 0) {
    alert('Data kosong!');
    return;
  }

  // Biar tanggal di Excel jadi 28/10/2026 kayak file upload kamu
  const exportData = dataToExport.map(row => {
    let tgl = row.tglsj || '';
    // 2026-10-28 -> 28/10/2026
    if (tgl && tgl.includes('-')) {
      const [y,m,d] = tgl.substring(0,10).split('-');
      tgl = `${d}/${m}/${y}`;
    }
    return {
      SUPCO: row.supco,
      NOSJ: row.nosj,
      TGLSJ: tgl,
      KDTK: row.kdtk,
      KCAB: row.kdcab,
      KETER: row.keter
    };
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "INTRANSIT");

  ws['!cols'] = [
    { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 60 }
  ];

  const fileName = `INTRANSIT_${new Date().toISOString().substring(0,10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};



    // const save = async(data)=>{
    //     try {        
    //         if(editing){
    //             await intransitServices.update(editing.id, data)
    //             setEditing(null);
    //         }else{
    //             await intransitServices.create(data);
    //         }
    //         load();
    //     } catch (error) {
    //         const message = error.response?.data?.message || error.message;
    //         if (message.includes('kdtk')) {
    //             alert("Gagal kdtk sudah ada") ;
    //         } else {
    //             alert("Gagal simpan: " + message)
    //         }
    //         console.error(error);
            
    //     }
    // };


    const save = async(data)=>{
    try {        
        if(editing && editing.id){
            await intransitServices.update(editing.id, data)
        }else{
            await intransitServices.create(data);
        }
        setEditing(null); // PINDAHIN KELUAR IF, BIAR TAMBAH DATA JUGA KETUTUP MODALNYA
        load();
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        if (message.includes('kdtk')) {
            alert("Gagal kdtk sudah ada") ;
        } else {
            alert("Gagal simpan: " + message)
        }
    }
};



    const remove = async (id) => {
        await intransitServices.delete(id);
        load();
      };

    return {intransits, editing, setEditing, save,remove,handleUpload, handleExportExcel}


} 