"use client";

import { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PdfViewer3Props {
  pdfUrl: string;
  height?: string;
  snapped?: boolean;
}

export default function PdfViewer3({ pdfUrl, height = '600px', snapped = false }: PdfViewer3Props) {
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState("100%");
  
  // Create the default layout plugin with custom configuration
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
  });
  
  // Handle window resize when in snapped mode
  useEffect(() => {
    if (snapped) {
      const updateWidth = () => {
        // Calculate a reasonable width for the snapped viewer (30% of window width)
        const snappedWidth = Math.min(450, window.innerWidth * 0.3);
        setContainerWidth(`${snappedWidth}px`);
      };
      
      updateWidth(); // Initial calculation
      window.addEventListener('resize', updateWidth);
      
      return () => window.removeEventListener('resize', updateWidth);
    } else {
      setContainerWidth("100%");
    }
  }, [snapped]);

  return (
    <div style={{ 
      height, 
      width: containerWidth,
      position: snapped ? 'fixed' : 'relative',
      top: snapped ? '20px' : 'auto',
      right: snapped ? '10px' : 'auto',
      zIndex: snapped ? 50 : 'auto',
      borderRadius: snapped ? '8px' : '0',
      boxShadow: snapped ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none',
      border: snapped ? '1px solid #e5e7eb' : 'none',
      overflow: 'hidden',
      transition: 'width 0.3s'
    }}>
      {error ? (
        <div className="text-red-500 text-center py-5 bg-white">
          ບໍ່ສາມາດໂຫຼດ PDF ໄດ້: {error}
        </div>
      ) : (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: '100%' }}>
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              onError={(error) => setError(error.message)}
            />
          </div>
        </Worker>
      )}
      
      {/* Close button when in snapped mode */}
      {snapped && (
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('closePdfViewer'))}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          title="ປິດ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 