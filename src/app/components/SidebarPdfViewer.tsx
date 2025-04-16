"use client";

import { useState, useEffect } from 'react';
import PdfViewer2 from './PdfViewer2';

interface SidebarPdfViewerProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarPdfViewer({ pdfUrl, isOpen, onClose }: SidebarPdfViewerProps) {
  const [width, setWidth] = useState(350);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('main');
  
  // Handle expand/collapse with animation
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    setWidth(isExpanded ? 350 : 500);
  };
  
  // Handle resize by dragging
  useEffect(() => {
    if (!isOpen) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = Math.max(250, window.innerWidth - e.clientX);
        setWidth(Math.min(newWidth, window.innerWidth * 0.6));
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isOpen]);
  
  // Start resize drag operation
  const handleResizeStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    e.preventDefault();
  };
  
  // Handle window resize
  useEffect(() => {
    if (!isOpen) return;
    
    const handleWindowResize = () => {
      // Ensure sidebar doesn't exceed reasonable width on window resize
      setWidth(prev => Math.min(prev, window.innerWidth * 0.6));
    };
    
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Semi-transparent overlay that allows clicking through */}
      <div 
        className="fixed inset-0 bg-black/5 pointer-events-none z-30"
        aria-hidden="true"
      />
      
      {/* Sidebar container */}
      <aside 
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-40 transition-all duration-300 flex flex-col"
        style={{ 
          width: `${width}px`,
          borderLeft: '1px solid #e5e7eb'
        }}
      >
        {/* Resize handle */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize flex items-center justify-center hover:bg-blue-100 group"
          onMouseDown={handleResizeStart}
        >
          <div className="h-8 w-1 bg-gray-300 group-hover:bg-blue-400 rounded-full"></div>
        </div>
        
        {/* Header with controls */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-100">
          <h2 className="text-sm font-semibold truncate">
            ເອກະສານ PDF
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleExpand}
              className="text-gray-600 hover:text-gray-800 focus:outline-none p-1"
              title={isExpanded ? "ຫຍໍ້ເຂົ້າ" : "ຂະຫຍາຍອອກ"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600 focus:outline-none p-1"
              title="ປິດ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Document selector - can be expanded if needed */}
        
        {/* PDF viewer container */}
        <div className="flex-grow overflow-hidden">
          <PdfViewer2 
            pdfUrl={pdfUrl}
            height="100%"
            showControls={true}
          />
        </div>
      </aside>
      
      {/* Main content adjustment */}
      <style jsx global>{`
        @media (min-width: 768px) {
          main.container.with-sidebar {
            margin-right: ${width}px;
            width: calc(100% - ${width}px);
            transition: margin-right 0.3s, width 0.3s;
          }
        }
      `}</style>
    </>
  );
} 