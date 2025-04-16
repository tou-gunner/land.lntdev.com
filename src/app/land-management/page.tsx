"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LandForm from "../components/LandForm";
import OwnerForm from "../components/OwnerForm";
import OwnerAndRightForm from '../components/OwnerAndRightForm';
import { FormProvider, useFormContext } from "../contexts/FormContext";
import SplitViewPdfViewer from '../components/SplitViewPdfViewer';

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

// Main content component that uses the form context
function LandManagementContent() {
  const [activeTab, setActiveTab] = useState<'land' | 'ownership'>('land');
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel');
  const { updateLandForm, formData } = useFormContext();
  const [splitLayout, setSplitLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // Check for parcel parameter and set it as initial active tab if present
  useEffect(() => {
    if (parcelParam) {
      // Set initial form data with parcel ID
      updateLandForm({
        barcode: parcelParam
      });
    }
  }, [parcelParam, updateLandForm]);
  
  // Add logging when tab changes to verify state persistence
  const handleTabChange = (tab: 'land' | 'ownership') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };
  
  // Toggle split layout orientation
  const toggleSplitLayout = () => {
    setSplitLayout(splitLayout === 'horizontal' ? 'vertical' : 'horizontal');
  };
  
  // Generate PDF URL
  const getPdfUrl = () => {
    return `${apiBaseUrl}/parcel/pdf?parcel=${formData?.land?.barcode}`;
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6 text-center">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</h1>
      
      {/* Top controls with form logger and layout toggle */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          {formData?.land?.barcode && (
            <button
              onClick={toggleSplitLayout}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center"
              title={splitLayout === 'horizontal' ? "ສະແດງແບບແນວຕັ້ງ" : "ສະແດງແບບແນວນອນ"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {splitLayout === 'horizontal' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                )}
              </svg>
              {splitLayout === 'horizontal' ? 'ແນວຕັ້ງ' : 'ແນວນອນ'}
            </button>
          )}
        </div>
        
        <FormLogger />
      </div>
      
      {/* Always use split view when parcel is selected */}
      {formData?.land?.barcode ? (
        <SplitViewPdfViewer
          pdfUrl={getPdfUrl()}
          defaultLayout={splitLayout}
          height="700px"
        >
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
              onClick={() => handleTabChange('ownership')}
              className={`py-2 px-4 font-medium text-lg ${
                activeTab === 'ownership'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ເຈົ້າຂອງ & ສິດນຳໃຊ້
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="tab-content">
            <div style={{ display: activeTab === 'land' ? 'block' : 'none' }}>
              <LandForm />
            </div>
            
            <div style={{ display: activeTab === 'ownership' ? 'block' : 'none' }}>
              <OwnerAndRightForm />
            </div>
          </div>
        </SplitViewPdfViewer>
      ) : (
        <>
          <div className="flex justify-center items-center p-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">ກະລຸນາເລືອກແປງທີ່ດິນເພື່ອສະແດງຂໍ້ມູນ</p>
            </div>
          </div>
        </>
      )}
    </div>
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