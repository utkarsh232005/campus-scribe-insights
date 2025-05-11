
import * as XLSX from 'xlsx';

interface ReportData {
  title: string;
  academicYear: string;
  publicationCount: string;
  conferenceCount: string;
  projectCount: string;
  fundingAmount: string;
  achievements: string;
}

export const generateExcelTemplate = (): Blob => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Define headers
  const headers = [
    'Title', 
    'Academic Year', 
    'Publications Count', 
    'Conferences Count', 
    'Projects Count', 
    'Funding Amount ($)', 
    'Achievements & Contributions'
  ];
  
  // Create worksheet with headers and example data
  const exampleData = [
    'Annual Research Report 2024-25',
    '2024-25',
    '10', 
    '5', 
    '3', 
    '50000', 
    'Include your key achievements, publications, and other contributions here...'
  ];
  
  const wsData = [headers, exampleData];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Report Template');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Convert to blob
  return new Blob([wbout], { type: 'application/octet-stream' });
};

export const parseExcelFile = (file: File): Promise<ReportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Read Excel file
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Skip header row and get data row (assume second row has data)
        if (jsonData.length < 2) {
          throw new Error('Excel file does not contain data');
        }
        
        const dataRow = jsonData[1];
        
        // Map to report data structure
        const reportData: ReportData = {
          title: String(dataRow[0] || ''),
          academicYear: String(dataRow[1] || ''),
          publicationCount: String(dataRow[2] || ''),
          conferenceCount: String(dataRow[3] || ''),
          projectCount: String(dataRow[4] || ''),
          fundingAmount: String(dataRow[5] || ''),
          achievements: String(dataRow[6] || '')
        };
        
        resolve(reportData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
