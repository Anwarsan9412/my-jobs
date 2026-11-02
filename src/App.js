import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/pages/About';
import Home from './components/pages/Home'

// import IntransitList from "./components/IntransitList";

import { useIntransits } from "./hooks/useIntransits";
import UploadIntransit from "./components/intransitUpload";
import Coba from "./components/Coba";
import Intransit from "./components/pages/Intransit";


export default function App() {
  const {intransits, setIntransits,editing,setEditing,remove,save, handleUpload,handleExportExcel} = useIntransits();

 return (
    <Routes>
      <Route path="/" element={
        <Home 
          intransits={intransits} 
          editing={editing} 
          setEditing={setEditing}
          handleUpload={handleUpload}
          handleExportExcel={handleExportExcel}
          save={save}
          remove={remove}
        />
      } />
      <Route path="/about" element={<About />} />
      <Route path="/intransit" element={ <Intransit  intransits={intransits} 
          setIntransits={setIntransits}
          editing={editing} 
          setEditing={setEditing}
          handleUpload={handleUpload}
          handleExportExcel={handleExportExcel}
          save={save}
          remove={remove} />} />
    </Routes>
  );




}