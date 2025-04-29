"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LandForm from "../components/LandForm";
import OwnerAndRightForm from '../components/OwnerAndRightForm';
import { FormProvider, useFormContext } from "../contexts/FormContext";
import SplitViewPdfViewer from '../components/SplitViewPdfViewer';
import { getCurrentUser } from "../lib/auth";
import { withAuth } from "../components/AuthProvider";

// Main content component that uses the form context
function DocumentFormsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'land' | 'ownership'>('land');
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel');
  const apiBaseUrl = '/api';
  const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelParam}`;
  const [splitLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [message, setMessage] = useState<string>("");
  
  // Get return parameters for back navigation
  const returnTab = searchParams.get('returnTab') || 'type';
  const returnTypePage = searchParams.get('returnTypePage') || '1';
  const returnFormPage = searchParams.get('returnFormPage') || '1';
  const returnPerPage = searchParams.get('returnPerPage') || '10';
  const returnProvince = searchParams.get('returnProvince') || '';
  const returnDistrict = searchParams.get('returnDistrict') || '';
  const returnVillage = searchParams.get('returnVillage') || '';
  
  // Get the user from storage using useMemo
  const user = useMemo(() => getCurrentUser(), []);
  
  // Function to navigate back to documents list with preserved filters
  const handleBackToList = () => {
    const params = new URLSearchParams();
    params.set('tab', returnTab);
    params.set('typePage', returnTypePage);
    params.set('formPage', returnFormPage);
    params.set('perPage', returnPerPage);
    if (returnProvince) params.set('province', returnProvince);
    if (returnDistrict) params.set('district', returnDistrict);
    if (returnVillage) params.set('village', returnVillage);
    
    router.push(`/documents-list?${params.toString()}`);
  };
  
  // Add logging when tab changes to verify state persistence
  const handleTabChange = (tab: 'land' | 'ownership') => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      {/* Always use split view when parcel is selected */}
      {pdfUrl ? (
        <SplitViewPdfViewer
          pdfUrl={pdfUrl}
          useBuiltinPdfReader={true}
          defaultLayout={splitLayout}
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
              {message ? (
                <>
                  <p className="text-lg text-red-600 dark:text-red-300 mb-4">{message}</p>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-300">ກະລຸນາເລືອກແປງທີ່ດິນເພື່ອສະແດງຂໍ້ມູນ</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Wrap the content component with withAuth
const ProtectedDocumentFormsContent = withAuth(DocumentFormsContent);

// Component that uses useSearchParams but with Suspense boundary
function DocumentFormsWithSearchParams() {
  const searchParams = useSearchParams();
  const parcelParam = searchParams.get('parcel');
  
  // Store the initial active tab based on URL parameter
  const [initialParcelId] = useState(parcelParam);
  
  return (
    <FormProvider>
      <ProtectedDocumentFormsContent />
    </FormProvider>
  );
}

// Wrapper component with Suspense boundary
export default function DocumentFormsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <DocumentFormsWithSearchParams />
    </Suspense>
  );
} 