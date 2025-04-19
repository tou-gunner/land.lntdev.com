"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SplitViewPdfViewer, { SplitViewPdfViewerRef } from "../components/SplitViewPdfViewer";
import { DocTypeRequest, updateDocumentTypes } from "../lib/api";
import { useGetDocumentTypesQuery } from "../redux/api/apiSlice";

interface DocumentTypeUpdateProps {
  parcelId?: string;
}

export default function DocumentTypeUpdate({ parcelId: propParcelId }: DocumentTypeUpdateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelIdFromUrl = searchParams.get("parcel");
  const parcelId = propParcelId || parcelIdFromUrl;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const pdfViewerRef = useRef<SplitViewPdfViewerRef>(null);
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [docType, setDocType] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [userName, setUserName] = useState<string>("dol11");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");
  const [savedPages, setSavedPages] = useState<DocTypeRequest[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch document types from API
  const { data: documentTypes, isLoading: isLoadingDocTypes, error: docTypesError } = useGetDocumentTypesQuery();

  useEffect(() => {
    if (!parcelId) {
      setMessage("ບໍ່ມີລະຫັດຕອນດິນ");
      return;
    }
    
    // Check if PDF exists and get the file
    const fetchPdfInfo = async () => {
      try {
        setLoading(true);
        
        // Check if the PDF exists
        const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
        const pdfResponse = await fetch(pdfUrl);
        
        if (!pdfResponse.ok) {
          setMessage("ບໍ່ສາມາດຊອກຫາເອກະສານ PDF ສຳລັບຕອນດິນນີ້");
          setLoading(false);
          return;
        }
        
        setPdfFile(pdfUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDF info:", error);
        setMessage("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ PDF");
        setLoading(false);
      }
    };
    
    fetchPdfInfo();
  }, [parcelId, apiBaseUrl]);

  const handlePdfPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
    if (!parcelId || !userName) {
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
      user_name: userName
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
    if (!parcelId || !userName) {
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
      // setTimeout(() => {
      //   router.push('/land-management');
      // }, 2000);
      
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
          <button
            onClick={() => router.push('/land-management')}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ໄປທີ່ໜ້າຈັດການຂໍ້ມູນທີ່ດິນ
          </button>
        </div>
      </div>
    );
  }

  // Find if current page is saved
  const currentPageSaved = savedPages.find(page => page.page === currentPage);

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
            
            <div className="mb-4">
              {/* <label className="block text-sm font-medium mb-2">ຊື່ຜູ້ໃຊ້</label> */}
              <input
                type="hidden"
                value={userName}
                // onChange={(e) => setUserName(e.target.value)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // required
              />
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
                  value={currentPageSaved?.doctype || ""}
                  onChange={(e) => {
                    const newDocType = parseInt(e.target.value);
                    setDocType(newDocType);
                    // Auto-save when document type changes
                    if (parcelId && userName) {
                      const pageData: DocTypeRequest = {
                        parcel: parcelId,
                        page: currentPage,
                        doctype: newDocType,
                        rotate: rotation,
                        user_name: userName
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
                value={currentPageSaved?.rotate || 0}
                onChange={(e) => {
                  const angle = parseInt(e.target.value);
                  setRotation(angle);
                  setRotationImperative(angle);
                  
                  // Auto-save when rotation changes
                  if (parcelId && userName && currentPageSaved) {
                    const pageData: DocTypeRequest = {
                      parcel: parcelId,
                      page: currentPage,
                      doctype: docType,
                      rotate: angle,
                      user_name: userName
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
                    
                    setMessage(`ບັນທຶກຂໍ້ມູນຂອງໜ້າທີ່ ${currentPage} ສຳເລັດ`);
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
                {isSaving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກທັງໝົດ ແລະ ກັບໄປໜ້າຫຼັກ"}
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
                          ? documentTypes.find(opt => opt.value === page.doctype)?.label || `ປະເພດ ${page.doctype}`
                          : `ປະເພດ ${page.doctype}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.includes('ຜິດພາດ') || message.includes('ບໍ່ສາມາດ') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
                {message}
              </div>
            )}
          </div>
        </SplitViewPdfViewer>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">ອັບເດດປະເພດເອກະສານ</h1>
            <p className="text-red-500 text-center">{message || "ກຳລັງໂຫຼດເອກະສານ..."}</p>
            <button
              onClick={() => router.push('/land-management')}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              ໄປທີ່ໜ້າຈັດການຂໍ້ມູນທີ່ດິນ
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 