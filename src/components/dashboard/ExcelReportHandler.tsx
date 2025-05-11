
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { generateExcelTemplate, parseExcelFile } from '@/utils/excelUtils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ExcelReportHandlerProps {
  onDataImported: (data: any) => void;
}

const ExcelReportHandler: React.FC<ExcelReportHandlerProps> = ({ onDataImported }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      // Generate Excel template
      const blob = generateExcelTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Faculty_Report_Template.xlsx';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Template Downloaded",
        description: "Excel template has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate Excel template.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File",
        description: "Please upload an Excel (.xlsx or .xls) file.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      const data = await parseExcelFile(file);
      onDataImported(data);
      
      toast({
        title: "Import Successful",
        description: "Excel data has been imported successfully.",
      });
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast({
        title: "Import Failed",
        description: "Could not parse Excel data. Please make sure you're using the correct template.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 bg-slate-800/20 p-4 rounded-md mb-6">
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          Excel Import/Export
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Download the Excel template to fill out offline, then upload it to quickly populate the form.
        </p>
      </div>
      <div className="flex space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <input
              type="file"
              id="excel-upload"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button 
              variant="default" 
              className="flex items-center relative"
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Importing...' : 'Import from Excel'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExcelReportHandler;
