"use client";

import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useTheme } from './ThemeProvider';

// Import styles for PDF viewer
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

interface PdfViewer2Props {
  pdfUrl: string;
  height?: string;
  showControls?: boolean;
}

export default function PdfViewer2({ pdfUrl, height = '500px', showControls = true }: PdfViewer2Props) {
  const { theme } = useTheme();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [scale, setScale] = useState<number>(1.0);

  // Set initial page width based on container size
  useEffect(() => {
    // Set initial page width based on container size
    setPageWidth(Math.min(600, window.innerWidth - 50));

    // Update page width on window resize
    const handleResize = () => {
      setPageWidth(Math.min(600, window.innerWidth - 50));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function resetZoom() {
    setScale(1.0);
  }

  return (
    <div className="bg-white dark:bg-gray-900" style={{ height, overflow: 'auto' }}>
      {showControls && numPages > 0 && (
        <div className="flex flex-col justify-center items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
          <div className="flex justify-center items-center gap-3">
            <button
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ຫນ້າກ່ອນ
            </button>
            
            <span className="text-gray-800 dark:text-gray-200">
              ຫນ້າ {pageNumber} ຂອງ {numPages}
            </span>
            
            <button
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ຫນ້າຕໍ່ໄປ
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={zoomOut}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="ຂະຫຍາຍອອກ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
              </svg>
            </button>
            
            <button
              onClick={resetZoom}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="ຄືນຄ່າຂະຫຍາຍ"
            >
              {Math.round(scale * 100)}%
            </button>
            
            <button
              onClick={zoomIn}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="ຂະຫຍາຍເຂົ້າ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center py-5">
          ບໍ່ສາມາດໂຫຼດ PDF ໄດ້: {error.message}
        </div>
      )}

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => {
          setError(err);
          setLoading(false);
        }}
        loading={null}
        className="pdf-document"
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className={`mx-auto ${theme === 'dark' ? 'invert filter brightness-90 contrast-95' : ''}`}
          loading={null}
          scale={scale}
          width={pageWidth}
          canvasBackground={theme === 'dark' ? '#333' : 'transparent'}
        />
      </Document>
    </div>
  );
}
