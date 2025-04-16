"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PdfViewer from "./PdfViewer";
import OwnerAndRightForm from "./OwnerAndRightForm";
import { FormProvider } from "../contexts/FormContext";

interface DocumentViewerWithFormProps {
  parcelId?: string;
}

interface DocumentOption {
  id: string;
  label: string;
  url: string;
}

export default function DocumentViewerWithForm({ parcelId: initialParcelId }: DocumentViewerWithFormProps) {
  const searchParams = useSearchParams();
  const parcelIdFromUrl = searchParams.get("parcel");
  const parcelId = initialParcelId || parcelIdFromUrl;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [pdfExists, setPdfExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'side-by-side' | 'stacked'>('side-by-side');
  const [activePdfPage, setActivePdfPage] = useState<number>(1);
  const [documentOptions, setDocumentOptions] = useState<DocumentOption[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('main');
  
  // Mock document options - in a real app, these would be fetched from an API
  useEffect(() => {
    if (parcelId) {
      // In a real application, you would fetch this from an API
      const mockDocuments: DocumentOption[] = [
        { id: 'main', label: 'ໃບຕາດິນຫຼັກ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}` },
        { id: 'survey', label: 'ເອກະສານສຳຫຼວດ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=survey` },
        { id: 'owner_id', label: 'ບັດປະຈຳຕົວຂອງເຈົ້າຂອງ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=id` },
        { id: 'contract', label: 'ສັນຍາ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=contract` }
      ];
      
      setDocumentOptions(mockDocuments);
      setSelectedDocumentId('main');
    }
  }, [parcelId, apiBaseUrl]);
  
  // Check if PDF exists on component mount
  useEffect(() => {
    if (!parcelId) {
      setError("ກະລຸນາລະບຸລະຫັດຕອນດິນ");
      setIsLoading(false);
      return;
    }
    
    const checkPdfExists = async () => {
      try {
        const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
        const response = await fetch(pdfUrl);
        
        if (response.ok) {
          setPdfExists(true);
          setError(null);
        } else {
          setPdfExists(false);
          setError("ບໍ່ພົບເອກະສານ PDF ສຳລັບຕອນດິນນີ້");
        }
      } catch (err) {
        console.error("Error checking PDF existence:", err);
        setError("ເກີດຂໍ້ຜິດພາດໃນການກວດສອບເອກະສານ PDF");
        setPdfExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPdfExists();
  }, [parcelId, apiBaseUrl]);
  
  // Handle page changes in the PDF viewer
  const handlePageChange = (pageNumber: number) => {
    setActivePdfPage(pageNumber);
  };
  
  // Toggle between side-by-side and stacked layouts
  const toggleLayout = () => {
    setLayoutMode(prevMode => prevMode === 'side-by-side' ? 'stacked' : 'side-by-side');
  };
  
  // Get the selected document URL
  const getSelectedDocumentUrl = (): string => {
    const selectedDoc = documentOptions.find(doc => doc.id === selectedDocumentId);
    return selectedDoc?.url || `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!parcelId || error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">ຂໍ້ຜິດພາດ</h3>
        <p className="text-red-700">{error || "ກະລຸນາລະບຸລະຫັດຕອນດິນ"}</p>
      </div>
    );
  }
  
  // Base rendering with PDF and form
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">ຂໍ້ມູນຕອນດິນ ແລະ ເຈົ້າຂອງ: {parcelId}</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Document selector */}
          <select
            value={selectedDocumentId}
            onChange={(e) => setSelectedDocumentId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {documentOptions.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.label}
              </option>
            ))}
          </select>
          
          {/* Layout toggle button */}
          <button 
            onClick={toggleLayout}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
          >
            {layoutMode === 'side-by-side' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                ປ່ຽນເປັນແບບຊ້ອນກັນ
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                ປ່ຽນເປັນແບບຄຽງຂ້າງກັນ
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`grid gap-6 ${layoutMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* PDF Viewer Section */}
        {pdfExists && (
          <div className={`bg-white rounded-lg shadow-md ${layoutMode === 'stacked' ? 'mb-6' : ''}`}>
            <PdfViewer 
              pdfUrl={getSelectedDocumentUrl()}
              initialPage={activePdfPage}
              height={layoutMode === 'side-by-side' ? "calc(100vh - 200px)" : "calc(50vh)"}
              onPageChange={handlePageChange}
              showControls={true}
            />
          </div>
        )}
        
        {/* Owner and Land Right Form Section */}
        <div className="bg-white rounded-lg shadow-md">
          <FormProvider>
            <OwnerAndRightForm />
          </FormProvider>
        </div>
      </div>
    </div>
  );
} 