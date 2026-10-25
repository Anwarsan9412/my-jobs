import React from "react";

export default function IntransitList({intransits, onEdit, onDelete}){
    if (intransits.length === 0) return <p>Belum ada data.</p>;
    return(
      <table border="1" cellPadding="1" width="100%">
        <thead>
            <tr>
                <th>supco</th>
                <th>nosj</th>
                <th>tglsj</th>
                <th>kdtk</th>
                <th>kdcab</th>
                <th>keter</th>
                <th>created_at</th>
                <th>updated_at</th>
                <th>aksi</th>
            </tr>
        </thead>
            <tbody>
                {intransits.map(p => (
                    <tr key={p.id}>
                        <td>{p.supco}</td>
                        <td>{p.nosj}</td>
                        <td>{p.tglsj}</td>
                        <td>{p.kdtk}</td>
                        <td>{p.kdcab}</td>
                        <td>{p.keter}</td>
                        <td>{p.created_at}</td>
                        <td>{p.updated_at}</td>
                        <td>
                            <button onClick={() => onEdit(p)}>Edit</button>
                            <button onClick={() => onDelete(p.id)} style={{ marginLeft: '5px' }}>Hapus</button>
                        </td>
                    </tr>
                    
                ))}
            </tbody>
      </table>
    )
}