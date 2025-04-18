"use client";

import { useState, useEffect, useRef } from 'react';
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
  onPageChange?: (pageNumber: number) => void;
  initialPage?: number;
  initialRotation?: number;
  onRotationChange?: (rotation: number) => void;
}

export default function PdfViewer2({ 
  pdfUrl, 
  height = '500px', 
  showControls = true, 
  onPageChange,
  initialPage = 1,
  initialRotation = 0,
  onRotationChange
}: PdfViewer2Props) {
  const { theme } = useTheme();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(initialRotation);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update page width based on container size
  useEffect(() => {
    const updatePageWidth = () => {
      if (containerRef.current) {
        // Set page width to container width minus padding
        const containerWidth = containerRef.current.clientWidth - 20;
        setPageWidth(containerWidth);
      }
    };

    // Initial update
    updatePageWidth();
    
    // Update on window resize
    window.addEventListener('resize', updatePageWidth);
    
    // Small delay to ensure container is fully rendered
    const timeoutId = setTimeout(updatePageWidth, 100);
    
    return () => {
      window.removeEventListener('resize', updatePageWidth);
      clearTimeout(timeoutId);
    };
  }, []);

  // Effect to sync with initialPage if it changes
  useEffect(() => {
    setPageNumber(initialPage);
  }, [initialPage]);

  // Effect to sync with initialRotation if it changes
  useEffect(() => {
    setRotation(initialRotation);
  }, [initialRotation]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(initialPage);
    setLoading(false);
    
    // Update width after document loads
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 20;
      setPageWidth(containerWidth);
    }
  }

  // Effect to notify parent about page changes
  useEffect(() => {
    if (numPages > 0 && !loading && onPageChange) {
      onPageChange(pageNumber);
    }
  }, [numPages, pageNumber, loading, onPageChange]);

  // Effect to notify parent about rotation changes
  useEffect(() => {
    if (onRotationChange) {
      onRotationChange(rotation);
    }
  }, [rotation, onRotationChange]);

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return newPageNumber;
    });
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

  function rotateClockwise() {
    setRotation(prevRotation => {
      const newRotation = (prevRotation + 90) % 360;
      return newRotation;
    });
  }

  function rotateCounterClockwise() {
    setRotation(prevRotation => {
      const newRotation = (prevRotation - 90 + 360) % 360;
      return newRotation;
    });
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white dark:bg-gray-900" style={{ height }}>
      {showControls && numPages > 0 && (
        <div className="sticky top-0 z-10 flex justify-center items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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

            <button
              onClick={rotateCounterClockwise}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="ໝູນຊ້າຍ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
              </svg>
            </button>
            
            <button
              onClick={rotateClockwise}
              className="px-2 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="ໝູນຂວາ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
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

        <div className="flex-1 flex justify-center px-2 py-4">
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
            {pageWidth > 0 && (
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className={`${theme === 'dark' ? 'invert filter brightness-90 contrast-95' : ''}`}
                loading={null}
                scale={scale}
                width={pageWidth}
                canvasBackground={theme === 'dark' ? '#333' : 'transparent'}
                rotate={rotation}
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  );
}
