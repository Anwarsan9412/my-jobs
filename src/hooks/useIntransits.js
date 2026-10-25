import { useState, useEffect } from "react";
import { intransitServices } from "../services/intransitServices";

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

    return {intransits, editing, setEditing, save,remove,handleUpload}


} 