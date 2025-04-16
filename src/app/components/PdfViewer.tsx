"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Import PDF.js worker as recommended in official documentation
// This needs to be done once before using react-pdf components
import { pdfjs } from 'react-pdf';

// Use an older, more compatible version of PDF.js worker (2.4.456)
// that doesn't require Promise.withResolvers
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js`;

// Dynamically import react-pdf components with fallback UI
const Document = dynamic(
  () => import('react-pdf').then(mod => mod.Document),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

const Page = dynamic(
  () => import('react-pdf').then(mod => mod.Page),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

interface PdfViewerProps {
  pdfUrl: string;
  initialPage?: number;
  initialRotation?: number;
  onPageChange?: (pageNumber: number) => void;
  onRotationChange?: (rotation: number) => void;
  height?: number | string;
  showControls?: boolean;
  className?: string;
}

const PdfViewer = ({
  pdfUrl,
  initialPage = 1,
  initialRotation = 0,
  onPageChange,
  onRotationChange,
  height = "calc(100vh-300px)",
  showControls = true,
  className = ""
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [rotation, setRotation] = useState<number>(initialRotation);
  const [scale, setScale] = useState<number>(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial page from props
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    // Set initial rotation from props
    setRotation(initialRotation);
  }, [initialRotation]);

  // Reset position when scale or page changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [scale, currentPage, rotation]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError("ບໍ່ສາມາດໂຫຼດ PDF ໄດ້");
    setLoading(false);
  };

  const navigatePage = (direction: number) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber = parseInt(e.target.value) || 1;
    const validatedPageNumber = Math.min(Math.max(1, pageNumber), numPages);
    setCurrentPage(validatedPageNumber);
    onPageChange?.(validatedPageNumber);
  };

  const handleRotationChange = (newRotation: number) => {
    // Ensure rotation is always 0, 90, 180, or 270
    const validRotation = newRotation % 360;
    setRotation(validRotation);
    onRotationChange?.(validRotation);
  };

  const handleRotateLeft = () => {
    handleRotationChange((rotation + 270) % 360);
  };

  const handleRotateRight = () => {
    handleRotationChange((rotation + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const zoomOptions = [
    { value: 0.5, label: "50%" },
    { value: 0.75, label: "75%" },
    { value: 1, label: "100%" },
    { value: 1.25, label: "125%" },
    { value: 1.5, label: "150%" },
    { value: 2, label: "200%" }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ເບິ່ງ PDF - ໜ້າ {currentPage}</h2>
          <div className="flex items-center space-x-2">
            {/* Zoom controls */}
            <button 
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              title="ຂະຫຍາຍອອກ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <select
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {zoomOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              title="ຂະຫຍາຍເຂົ້າ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            {/* Separator */}
            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            
            {/* Rotation controls */}
            <button 
              onClick={handleRotateLeft}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
              title="ໝູນໄປຊ້າຍ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <div className="px-2 min-w-[50px] text-center font-medium">
              {rotation === 0 ? (
                <span>0°</span>
              ) : rotation === 90 ? (
                <span className="text-green-600 dark:text-green-400">90°</span>
              ) : rotation === 180 ? (
                <span className="text-blue-600 dark:text-blue-400">180°</span>
              ) : (
                <span className="text-purple-600 dark:text-purple-400">270°</span>
              )}
            </div>
            <button 
              onClick={handleRotateRight}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
              title="ໝູນໄປຂວາ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showControls && (
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigatePage(-1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-l-md hover:bg-gray-300 disabled:opacity-50"
          >
            &larr;
          </button>
          <input
            type="number"
            value={currentPage}
            onChange={handlePageNumberChange}
            className="w-20 text-center px-3 py-2 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max={numPages}
          />
          <button
            onClick={() => navigatePage(1)}
            disabled={currentPage >= numPages}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-r-md hover:bg-gray-300 disabled:opacity-50"
          >
            &rarr;
          </button>
          <span className="ml-2 text-sm text-gray-500">ຈາກທັງໝົດ {numPages} ໜ້າ</span>
        </div>
      )}

      <div 
        className={`w-full overflow-hidden ${typeof height === 'string' ? 'h-[' + height + ']' : `h-[${height}px]`}`}
        ref={pdfContainerRef}
      >
        {loading && !error && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center items-center h-full bg-red-50 text-red-500 p-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {!error && (
          <div
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
            }}
            className="transition-transform duration-100 ease-out"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              error={
                <div className="flex justify-center items-center h-full bg-red-50 text-red-500 p-4 rounded">
                  <p>ບໍ່ສາມາດໂຫຼດ PDF ໄດ້</p>
                </div>
              }
            >
              <Page 
                pageNumber={currentPage} 
                width={undefined}
                height={undefined}
                scale={1} // We handle scaling at the container level
                rotate={rotation}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                loading={
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer; 