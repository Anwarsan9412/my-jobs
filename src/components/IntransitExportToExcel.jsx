import * as XLSX from 'xlsx';

const handleExportExcel = () => {
  if (intransits.length === 0) {
    alert('Data kosong!');
    return;
  }

  // Siapkan data sesuai header screenshot kamu
  const exportData = filtered.map(row => ({
    SUPCO: row.supco,
    NOSJ: row.nosj,
    TGLSJ: row.tglsj,
    KDTK: row.kdtk,
    KCAB: row.kdcab,
    KETER: row.keter
  }));

  // Buat workbook
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "INTRANSIT");

  // Atur lebar kolom biar rapi
  ws['!cols'] = [
    { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 50 }
  ];

  // Download
  const fileName = `INTRANSIT_${new Date().toISOString().substring(0,10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};