
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePDFGeneration } from "@/services/pdf";
import { Report, Property } from "@/types";
import { Loader2, Eye } from "lucide-react";
import PDFPreviewDialog from "./PDFPreviewDialog";

interface PDFExportButtonProps {
  report: Report;
  property: Property;
}

const PDFExportButton = ({ report, property }: PDFExportButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { generatePDF } = usePDFGeneration();
  
  const handleGeneratePDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Generate the PDF with real report data
      const pdfData = await generatePDF(report, property);
      
      // Ensure we have the PDF data
      if (!pdfData) {
        throw new Error("Failed to generate PDF data");
      }
      
      setDownloadUrl(pdfData);
      return pdfData;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePreviewPDF = async () => {
    // Generate PDF if not already generated
    const pdfData = downloadUrl || await handleGeneratePDF();
    
    // Open the preview dialog after generating
    if (pdfData) {
      setPreviewOpen(true);
    }
  };
  
  // Determine report title
  const getReportTitle = () => {
    return `Inventory & Check In - ${property.address.replace(/\s+/g, '_')}`;
  };
  
  return (
    <>
      <Button
        onClick={handlePreviewPDF}
        disabled={isGenerating}
        className="bg-shareai-blue hover:bg-shareai-blue/90 text-white transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Preview...
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Preview PDF
          </>
        )}
      </Button>
      
      <PDFPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pdfUrl={downloadUrl}
        isLoading={isGenerating}
        downloadUrl={downloadUrl}
        reportTitle={getReportTitle()}
        report={report}
        property={property}
      />
    </>
  );
};

export default PDFExportButton;
