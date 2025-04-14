"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PdfViewer from "../components/PdfViewer";

interface DocTypeRequest {
  parcel: string;
  page: number;
  doctype: number;
  rotate: number;
  user_name: string;
}

interface DocumentTypeUpdateProps {
  parcelId?: string;
}

export default function DocumentTypeUpdate({ parcelId: propParcelId }: DocumentTypeUpdateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parcelIdFromUrl = searchParams.get("parcel");
  const parcelId = propParcelId || parcelIdFromUrl;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [docType, setDocType] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");

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

  const handleSubmit = async () => {
    if (!parcelId || !userName) {
      setMessage("ຕ້ອງລະບຸລະຫັດຕອນດິນ ແລະ ຊື່ຜູ້ໃຊ້");
      return;
    }
    
    try {
      setLoading(true);
      
      const docTypeRequest: DocTypeRequest = {
        parcel: parcelId,
        page: currentPage,
        doctype: docType,
        rotate: rotation,
        user_name: userName
      };
      
      const response = await fetch(`${apiBaseUrl}/parcel/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([docTypeRequest]), // API expects an array
      });
      
      if (!response.ok) {
        throw new Error("ບໍ່ສາມາດອັບເດດປະເພດເອກະສານໄດ້");
      }
      
      setMessage("ອັບເດດປະເພດເອກະສານສຳເລັດແລ້ວ!");
      setLoading(false);
      
      // Move to next page if not at the end
      if (currentPage < pdfPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error("Error updating document type:", error);
      setMessage("ເກີດຂໍ້ຜິດພາດໃນການອັບເດດປະເພດເອກະສານ");
      setLoading(false);
    }
  };

  const docTypeOptions = [
    { value: 1, label: "ໃບຕາດິນ" },
    { value: 2, label: "ເອກະສານສຳຫຼວດ" },
    { value: 3, label: "ບັດປະຈຳຕົວຂອງເຈົ້າຂອງ" },
    { value: 4, label: "ສັນຍາ" },
    { value: 5, label: "ອື່ນໆ" }
  ];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">ອັບເດດປະເພດເອກະສານ</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ລະຫັດຕອນດິນ</label>
            <input
              type="text"
              value={parcelId || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ຊື່ຜູ້ໃຊ້</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ໜ້າ</label>
            <div className="flex items-center">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(Math.min(Math.max(1, parseInt(e.target.value) || 1), pdfPages))}
                className="w-full text-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={pdfPages}
              />
              <span className="ml-2 text-sm text-gray-500">ຈາກທັງໝົດ {pdfPages} ໜ້າ</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ປະເພດເອກະສານ</label>
            <select
              value={docType}
              onChange={(e) => setDocType(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {docTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">ການໝູນເອກະສານ</label>
            <select
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rotationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ ແລະ ໄປໜ້າຕໍ່ໄປ"}
          </button>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${message.includes('ຜິດພາດ') || message.includes('ບໍ່ສາມາດ') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message}
            </div>
          )}
        </div>
        
        <PdfViewer 
          pdfUrl={pdfFile}
          initialPage={currentPage}
          initialRotation={rotation}
          onPageChange={handlePdfPageChange}
          onRotationChange={handlePdfRotationChange}
          height="calc(100vh-300px)"
        />
      </div>
    </div>
  );
} 