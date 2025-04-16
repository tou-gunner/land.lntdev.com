"use client";

import { useState } from 'react';
import PdfViewer2 from './PdfViewer2';

interface InlinePdfViewerProps {
  pdfUrl: string;
  height?: string;
}

export default function InlinePdfViewer({ pdfUrl, height = '500px' }: InlinePdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-100">
        <h2 className="text-sm font-semibold truncate">
          ເອກະສານ PDF
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none p-1"
            title={isExpanded ? "ຫຍໍ້ລົງ" : "ຂະຫຍາຍ"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* PDF viewer container */}
      <div style={{ height: isExpanded ? "800px" : height }} className="transition-all duration-300">
        <PdfViewer2 
          pdfUrl={pdfUrl}
          height="100%"
          showControls={true}
        />
      </div>
    </div>
  );
} 