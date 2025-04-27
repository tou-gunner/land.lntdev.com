"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SplitViewPdfViewer, { SplitViewPdfViewerRef } from "../components/SplitViewPdfViewer";
import { DocTypeRequest, updateDocumentTypes, lockParcelRecord, fetchPdfInfo } from "../lib/api";
import { useGetDocumentTypesQuery } from "../redux/api/apiSlice";
import { getCurrentUser } from "../lib/auth";
import { withAuth } from "../components/AuthProvider";
import Link from "next/link";
import { useToast } from "../hooks/useToast";
import { isSet } from "util/types";

// Main component that uses searchParams
function DocumentTypeUpdateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelIdFromUrl = searchParams.get("parcel");
  const parcelId = parcelIdFromUrl;
  const { showToast } = useToast();
  // Get the user from storage using useMemo
  const user = useMemo(() => getCurrentUser(), []);
  
  const pdfViewerRef = useRef<SplitViewPdfViewerRef>(null);
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [docType, setDocType] = useState<string>("");
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");
  const [savedPages, setSavedPages] = useState<DocTypeRequest[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);

  // Fetch document types from API
  const { data: documentTypes, isLoading: isLoadingDocTypes, error: docTypesError } = useGetDocumentTypesQuery();

  // Find if current page is saved
  const currentPageSaved = savedPages.find(page => page.page === currentPage);

  useEffect(() => {
    if (!parcelId) {
      setMessage("ບໍ່ມີລະຫັດຕອນດິນ");
      return;
    }
    
    // Attempt to lock the parcel record for this user session
    const lockParcel = async () => {
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        setIsLocking(true);
        setMessage("ກຳລັງລັອກຕອນດິນ...");
        
        // Use the imported lockParcelRecord function from api.ts
        await lockParcelRecord(user.user_name, parcelId);
        
        setMessage("ລັອກຕອນດິນສຳເລັດ");
        
        // Continue with PDF loading after successful lock
        fetchParcelPdf();
      } catch (error) {
        console.error('Error locking parcel record:', error);
        setMessage('ບໍ່ສາມາດລັອກເອກະສານຕອນດິນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.');
        // Redirect back to the documents list page after a short delay
        // setTimeout(() => {
        //   router.push('/documents-list');
        // }, 3000);
      } finally {
        setIsLocking(false);
      }
    };
    
    // Check if PDF exists and get the file using the API function
    const fetchParcelPdf = async () => {
      try {
        setLoading(true);
        setMessage("ກຳລັງໂຫຼດຂໍ້ມູນ PDF...");
        
        // Use the imported fetchPdfInfo function from api.ts
        const { pdfUrl } = await fetchPdfInfo(parcelId);
        
        setPdfFile(pdfUrl);
        setMessage("");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDF info:", error);
        setMessage("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ PDF");
        setLoading(false);
      }
    };
    
    // First lock the parcel, then fetch the PDF
    lockParcel();
  }, [parcelId, user, router]);

  useEffect(() => {
    setDocType(currentPageSaved?.doctype || "");
    setRotationImperative(currentPageSaved?.rotate || 0);
  }, [currentPage]);

  const handlePdfPageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePdfRotationChange = (rotationAngle: number) => {
    setRotation(rotationAngle);
  };

  // Function to go to previous page using imperative API
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      pdfViewerRef.current?.previousPage();
    }
  };

  // Function to go to next page using imperative API
  const goToNextPage = () => {
    if (currentPage < pdfPages) {
      pdfViewerRef.current?.nextPage();
    }
  };

  // Function to set rotation using imperative API
  const setRotationImperative = (angle: number) => {
    pdfViewerRef.current?.setRotation(angle);
  };

  const saveCurrentPage = () => {
    if (!parcelId || !user) {
      setMessage("ຕ້ອງລະບຸລະຫັດຕອນດິນ ແລະ ຊື່ຜູ້ໃຊ້");
      return false;
    }
    
    if (!documentTypes || documentTypes.length === 0) {
      setMessage("ບໍ່ສາມາດບັນທຶກໄດ້ ເນື່ອງຈາກບໍ່ມີຂໍ້ມູນປະເພດເອກະສານ");
      return false;
    }

    // Check if this page already exists in the saved pages
    const existingPageIndex = savedPages.findIndex(page => page.page === currentPage);
    
    const pageData: DocTypeRequest = {
      parcel: parcelId,
      page: currentPage,
      doctype: docType,
      rotate: rotation,
      user_name: user.user_name
    };

    // Update or add the page
    if (existingPageIndex >= 0) {
      // Update existing page
      const updatedPages = [...savedPages];
      updatedPages[existingPageIndex] = pageData;
      setSavedPages(updatedPages);
    } else {
      // Add new page
      setSavedPages([...savedPages, pageData]);
    }
    return true;
  };

  const handleSavePage = () => {
    const saved = saveCurrentPage();
    if (saved && pdfPages > currentPage) {
      // Go to the next page if current page was saved successfully
      // and we're not on the last page
      goToNextPage();
    }
  };

  const handleSubmit = async () => {
    if (!parcelId || !user) {
      setMessage("ຕ້ອງລະບຸລະຫັດຕອນດິນ ແລະ ຊື່ຜູ້ໃຊ້");
      return;
    }
    
    // Save current page first
    const saved = saveCurrentPage();
    if (!saved) return;
    
    // If no pages saved, show error
    if (savedPages.length === 0) {
      setMessage("ບໍ່ມີໜ້າເອກະສານທີ່ຈະບັນທຶກ");
      return;
    }
    
    try {
      setIsSaving(true);
      setMessage("ກຳລັງບັນທຶກຂໍ້ມູນ...");
      
      // Send data using the API function
      const result = await updateDocumentTypes(savedPages);
      
      setMessage("ບັນທຶກຂໍ້ມູນສຳເລັດ");
      
      // Redirect to land management page after success
      setTimeout(() => {
        router.push(`/document-forms?parcel=${parcelId}`);
      }, 200);
      
    } catch (error) {
      console.error("Error updating document types:", error);
      setMessage(`ເກີດຂໍ້ຜິດພາດ: ${error instanceof Error ? error.message : 'ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const rotationOptions = [
    { value: 0, label: "0°" },
    { value: 90, label: "90°" },
    { value: 180, label: "180°" },
    { value: 270, label: "270°" }
  ];

  if (!parcelId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">ອັບເດດປະເພດເອກະສານ</h1>
          <p className="text-red-500 text-center">ບໍ່ມີລະຫັດຕອນດິນ. ກະລຸນາລະບຸລະຫັດຕອນດິນ.</p>
          <Link
            href="/documents-list"
            className="mt-4 block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
          >
            ໄປທີ່ໜ້າຈັດການຂໍ້ມູນທີ່ດິນ
          </Link>
        </div>
      </div>
    );
  }

  // Loading state for locking
  if (isLocking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">ອັບເດດປະເພດເອກະສານ</h1>
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-700 dark:text-gray-300 text-center">ກຳລັງລັອກຕອນດິນ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group document types by group for better organization in select
  const groupedDocTypes: {[key: string]: typeof documentTypes} = {};
  
  if (documentTypes) {
    documentTypes.forEach(type => {
      const group = type.group || 'ອື່ນໆ';
      if (!groupedDocTypes[group]) {
        groupedDocTypes[group] = [];
      }
      groupedDocTypes[group].push(type);
    });
  }

  return (
    <div className="">
      {pdfFile ? (
        <SplitViewPdfViewer 
          ref={pdfViewerRef}
          pdfUrl={pdfFile}
          height="calc(100vh - 100px)"
          defaultLayout="horizontal"
          defaultRatio={0.6}
          initialPage={currentPage}
          initialRotation={rotation}
          onPageChange={handlePdfPageChange}
          onRotationChange={handlePdfRotationChange}
          onLoadSuccess={(pdf) => {
            setPdfPages(pdf.numPages);
          }}
        >
          <div className="bg-white dark:bg-gray-800 p-3 shadow-md h-full overflow-y-auto">
            <div className="mb-4">
              {/* <label className="block text-sm font-medium mb-2">ລະຫັດຕອນດິນ</label> */}
              <input
                type="hidden"
                value={parcelId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700"
              />
            </div>
            
            {user && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                ຜູ້ໃຊ້: {user.user_name}
              </div>
            )}
            
            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.includes('ຜິດພາດ') || message.includes('ບໍ່ສາມາດ') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
                {message}
              </div>
            )}

            {/* All Pages Grid */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">ໜ້າທັງໝົດ: {pdfPages} ໜ້າ</p>
              {pdfPages > 0 && (
                <div className="mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 max-h-60 overflow-y-auto">
                  <div className="inline-flex flex-wrap gap-2">
                    {Array.from({ length: pdfPages }, (_, i) => i + 1).map(page => {
                      const isSaved = savedPages.some(savedPage => savedPage.page === page);
                      return (
                        <div 
                          key={page} 
                          className={`
                            text-center w-10 py-1 cursor-pointer rounded-md text-xs flex items-center justify-center
                            ${page === currentPage ? 'ring-2 ring-blue-500' : ''}
                            ${isSaved 
                              ? 'bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-100' 
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'}
                          `}
                          onClick={() => pdfViewerRef.current?.goToPage(page)}
                        >
                          {page}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              {/* <label className="block text-sm font-medium mb-2">ໜ້າ</label> */}
              <div className="flex items-center">
                <input
                  type="hidden"
                  value={currentPage}
                  // readOnly
                  // className="w-full text-center px-3 py-2 border bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400 rounded-md cursor-not-allowed opacity-80"
                  // min="1"
                  // max={pdfPages}
                />
                {/* {currentPageSaved && (
                  <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                    ✓ ຖືກບັນທຶກແລ້ວ
                  </span>
                )} */}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">ປະເພດເອກະສານ</label>
              {isLoadingDocTypes ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center">
                  ກຳລັງໂຫຼດຂໍ້ມູນ...
                </div>
              ) : docTypesError ? (
                <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700 text-center">
                  ບໍ່ສາມາດໂຫຼດຂໍ້ມູນປະເພດເອກະສານໄດ້
                </div>
              ) : documentTypes && Object.keys(groupedDocTypes).length > 0 ? (
                <select
                  value={docType}
                  onChange={(e) => {
                    const newDocType = e.target.value;
                    setDocType(newDocType);
                    // Auto-save when document type changes
                    if (parcelId && user) {
                      const pageData: DocTypeRequest = {
                        parcel: parcelId,
                        page: currentPage,
                        doctype: newDocType,
                        rotate: rotation,
                        user_name: user.user_name
                      };
                      
                      // Update or add the page
                      const existingPageIndex = savedPages.findIndex(page => page.page === currentPage);
                      if (existingPageIndex >= 0) {
                        // Update existing page
                        const updatedPages = [...savedPages];
                        updatedPages[existingPageIndex] = pageData;
                        setSavedPages(updatedPages);
                      } else {
                        // Add new page
                        setSavedPages([...savedPages, pageData]);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {!currentPageSaved && (
                    <option value="" disabled>
                      --- ກະລຸນາເລືອກປະເພດເອກະສານ ---
                    </option>
                  )}
                  {Object.entries(groupedDocTypes).map(([group, types]) => (
                    <optgroup key={group} label={group}>
                      {types && types.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50 text-yellow-700 text-center">
                  ບໍ່ມີຂໍ້ມູນປະເພດເອກະສານ
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">ການໝູນເອກະສານ</label>
              <select
                value={rotation}
                onChange={(e) => {
                  const angle = parseInt(e.target.value);
                  setRotationImperative(angle);
                  
                  // Auto-save when rotation changes
                  if (parcelId && user && currentPageSaved) {
                    const pageData: DocTypeRequest = {
                      parcel: parcelId,
                      page: currentPage,
                      doctype: docType,
                      rotate: angle,
                      user_name: user.user_name
                    };
                    
                    // Update or add the page
                    const existingPageIndex = savedPages.findIndex(page => page.page === currentPage);
                    if (existingPageIndex >= 0) {
                      // Update existing page
                      const updatedPages = [...savedPages];
                      updatedPages[existingPageIndex] = pageData;
                      setSavedPages(updatedPages);
                    } else {
                      // Add new page
                      setSavedPages([...savedPages, pageData]);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rotationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSubmit}
                disabled={loading || isSaving || savedPages.length === 0 || savedPages.length < pdfPages}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading || isSaving || savedPages.length === 0 || savedPages.length < pdfPages
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title={savedPages.length < pdfPages ? `ຍັງເຫຼືອ ${pdfPages - savedPages.length} ໜ້າທີ່ຍັງບໍ່ໄດ້ບັນທຶກ` : ""}
              >
                {isSaving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກທັງໝົດ"}
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">ບັນທຶກແລ້ວ: {savedPages.length} ໜ້າ</p>
              {savedPages.length > 0 && (
                <div className="mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 max-h-40 overflow-y-auto">
                  {savedPages.map((page, index) => (
                    <div 
                      key={index} 
                      className="text-xs py-1 flex justify-between cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 px-2 rounded"
                      onClick={() => pdfViewerRef.current?.goToPage(page.page)}
                    >
                      <span>ໜ້າ {page.page}</span>
                      <span>
                        {documentTypes
                          ? documentTypes.find(opt => opt.value === parseInt(page.doctype))?.label || `ປະເພດ ${page.doctype}`
                          : `ປະເພດ ${page.doctype}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SplitViewPdfViewer>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">ອັບເດດປະເພດເອກະສານ</h1>
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-700 dark:text-gray-300 text-center">ກຳລັງໂຫຼດເອກະສານ...</p>
              </div>
            ) : (
              <p className="text-red-500 text-center">{message || "ບໍ່ພົບຂໍ້ມູນເອກະສານ"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component with Suspense boundary
function DocumentTypeUpdate() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <DocumentTypeUpdateContent />
    </Suspense>
  );
}

// Export the component wrapped with the AuthProvider's withAuth HOC
export default withAuth(DocumentTypeUpdate); 