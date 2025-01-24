import * as XLSX from 'xlsx';

export const ExcelService = {
  async processExcel(file) {
    try {
      const data = await readFile(file);
      const workbook = XLSX.read(data, { type: 'array' });

      let allContent = '';
      const sheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1, 
          defval: '', 
          raw: false, 
        });

        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        let sheetContent = `Sheet: ${name}\nHeaders: ${headers.join(', ')}`;
        rows.forEach((row, index) => {
          sheetContent += `\nRow ${index + 1}: ${headers.map((header, colIndex) => {
            return row[colIndex] !== '' ? `${header}: ${row[colIndex]}` : '';
          }).join(', ')}`;
        });
        allContent += sheetContent + '\n\n';

        return {
          name,
          data: rows.map((row) => {
            return headers.reduce((acc, header, index) => {
              acc[header] = row[index];
              return acc;
            }, {});
          }),
        };
      });

      const columns = [...new Set(sheets.flatMap(sheet => sheet.data.length > 0 ? Object.keys(sheet.data[0]) : []))];

      const flatData = sheets.flatMap((sheet) => sheet.data);

      return { content: allContent, data: flatData, columns, sheets };
    } catch (error) {
      console.error('Excel Processing Error:', error);
      throw new Error("Failed to process the Excel file. Please ensure it's a valid Excel file.");
    }
  },
};

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target?.result));
    reader.onerror = () => reject(new Error('Failed to read the file. Please try again.'));
    reader.readAsArrayBuffer(file);
  });
};
