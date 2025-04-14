"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LandForm from "../components/LandForm";
import LandRightForm from "../components/LandRightForm";
import OwnerForm from "../components/OwnerForm";
import DocumentTypeLink from "../components/DocumentTypeLink";
import PdfViewer from '../components/PdfViewer';
import { FormProvider, useFormContext } from "../contexts/FormContext";

// Component to demonstrate accessing form state from context
function FormLogger() {
  const { formData } = useFormContext();

  // Log form data when it changes
  const logFormData = () => {
    console.log('Current Form State:', formData);
  };

  return (
    <div className="mb-4 text-right">
      <button 
        onClick={logFormData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log Form State
      </button>
    </div>
  );
}

// Component for the Documents tab
function DocumentsTab() {
  const { formData } = useFormContext();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DocumentTypeLink parcelId={formData?.land?.barcode} />
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Document Instructions</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Use the Document Type Editor to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>View PDF pages associated with a parcel</li>
          <li>Assign document types to each page</li>
          <li>Rotate pages if needed</li>
          <li>Update document metadata in the database</li>
        </ul>
      </div>
    </div>
  );
}

// Component for the Document Types tab
function DocumentTypesTab() {
  const { formData } = useFormContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfExists, setPdfExists] = useState<boolean>(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const parcelId = formData?.land?.barcode;
  
  // Check if PDF exists before rendering the document type editor
  useEffect(() => {
    if (!parcelId) return;
    
    const checkPdfExists = async () => {
      setIsLoading(true);
      try {
        // Check if PDF exists using GET request
        const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
        const response = await fetch(pdfUrl);
        
        if (!response.ok) {
          setError("ບໍ່ສາມາດຊອກຫາເອກະສານ PDF ສຳລັບຕອນດິນນີ້");
          setPdfExists(false);
        } else {
          setError(null);
          setPdfExists(true);
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">ພົບຂໍ້ຜິດພາດ</h3>
        <p className="text-red-700">{error}</p>
        <p className="mt-4 text-gray-700">ກະລຸນາເລືອກຕອນດິນທີ່ມີ PDF ຫຼື ກວດສອບການເຊື່ອມຕໍ່ກັບເຊີບເວີ.</p>
      </div>
    );
  }
  
  if (!parcelId) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">ຄຳເຕືອນ</h3>
        <p className="text-yellow-700">ກະລຸນາເລືອກຕອນດິນກ່ອນ ຫຼື ປ້ອນຂໍ້ມູນຕອນດິນໃນແຖບ "ທີ່ດິນ".</p>
      </div>
    );
  }
  
  if (pdfExists) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ຈັດການປະເພດເອກະສານ</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            ທ່ານສາມາດໃຊ້ເຄື່ອງມືນີ້ເພື່ອເບິ່ງ PDF ແລະ ຈັດການກັບເອກະສານຕອນດິນ.
          </p>
          <div className="mt-4">
            <a 
              href={`/document-types?parcel=${parcelId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ຈັດການປະເພດເອກະສານ
            </a>
          </div>
        </div>
        
        <PdfViewer 
          pdfUrl={`${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`}
          initialPage={1}
          height="calc(100vh-400px)"
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">ບໍ່ພົບ PDF</h3>
      <p className="text-yellow-700">ບໍ່ມີໄຟລ໌ PDF ສຳລັບຕອນດິນນີ້. ກະລຸນາອັບໂຫຼດເອກະສານກ່ອນ.</p>
    </div>
  );
}

// Main content component that uses the form context
function LandManagementContent() {
  const [activeTab, setActiveTab] = useState<'land' | 'owner' | 'landright' | 'documents' | 'documentTypes'>('land');
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel');
  const { updateLandForm } = useFormContext();
  
  // Check for parcel parameter and set it as initial active tab if present
  useEffect(() => {
    if (parcelParam) {
      // Set initial form data with parcel ID
      updateLandForm({
        barcode: parcelParam
      });
      
      // Automatically switch to document types tab
      setActiveTab('documentTypes');
    }
  }, [parcelParam, updateLandForm]);
  
  // Add logging when tab changes to verify state persistence
  const handleTabChange = (tab: 'land' | 'owner' | 'landright' | 'documents' | 'documentTypes') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</h1>
        
        {/* Debug button */}
        <FormLogger />
        
        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6 flex-wrap">
          <button
            onClick={() => handleTabChange('land')}
            className={`py-2 px-4 font-medium text-lg ${
              activeTab === 'land'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ທີ່ດິນ
          </button>
          <button
            onClick={() => handleTabChange('owner')}
            className={`py-2 px-4 font-medium text-lg ${
              activeTab === 'owner'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ເຈົ້າຂອງ
          </button>
          <button
            onClick={() => handleTabChange('landright')}
            className={`py-2 px-4 font-medium text-lg ${
              activeTab === 'landright'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ສິດນຳໃຊ້ທີ່ດິນ
          </button>
          <button
            onClick={() => handleTabChange('documents')}
            className={`py-2 px-4 font-medium text-lg ${
              activeTab === 'documents'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ເອກະສານ
          </button>
          <button
            onClick={() => handleTabChange('documentTypes')}
            className={`py-2 px-4 font-medium text-lg ${
              activeTab === 'documentTypes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ຈັດການເອກະສານ
          </button>
        </div>
        
        {/* Tab Content - Using CSS to show/hide instead of conditional rendering */}
        <div className="tab-content">
          <div style={{ display: activeTab === 'land' ? 'block' : 'none' }}>
            <LandForm />
          </div>
          
          <div style={{ display: activeTab === 'owner' ? 'block' : 'none' }}>
            <OwnerForm />
          </div>
          
          <div style={{ display: activeTab === 'landright' ? 'block' : 'none' }}>
            <LandRightForm />
          </div>

          <div style={{ display: activeTab === 'documents' ? 'block' : 'none' }}>
            <DocumentsTab />
          </div>
          
          <div style={{ display: activeTab === 'documentTypes' ? 'block' : 'none' }}>
            <DocumentTypesTab />
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrapper component that provides the form context
export default function LandManagementPage() {
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel');
  
  // Store the initial active tab based on URL parameter
  const [initialParcelId] = useState(parcelParam);
  
  return (
    <FormProvider>
      <LandManagementContent />
    </FormProvider>
  );
} 