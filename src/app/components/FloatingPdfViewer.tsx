"use client";

import { useState, useEffect, useRef } from "react";
import PdfViewer2 from "./PdfViewer2";

interface DocumentOption {
  id: string;
  label: string;
  url: string;
}

interface FloatingPdfViewerProps {
  parcelId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingPdfViewer({ parcelId, isOpen, onClose }: FloatingPdfViewerProps) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 600, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [minimized, setMinimized] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const [previousState, setPreviousState] = useState({ position: { x: 20, y: 20 }, size: { width: 600, height: 700 } });
  const [documentOptions, setDocumentOptions] = useState<DocumentOption[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('main');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock document options - in a real app, these would be fetched from an API
  useEffect(() => {
    if (parcelId) {
      // In a real application, you would fetch this from an API
      const mockDocuments: DocumentOption[] = [
        { id: 'main', label: 'ໃບຕາດິນຫຼັກ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}` },
        { id: 'survey', label: 'ເອກະສານສຳຫຼວດ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=survey` },
        { id: 'owner_id', label: 'ບັດປະຈຳຕົວຂອງເຈົ້າຂອງ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=id` },
        { id: 'contract', label: 'ສັນຍາ', url: `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}&type=contract` }
      ];
      
      setDocumentOptions(mockDocuments);
      setSelectedDocumentId('main');
    }
  }, [parcelId, apiBaseUrl]);
  
  // Handle mouse events outside component
  useEffect(() => {
    if (!isOpen) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isSnapped) {
        const newX = position.x + (e.clientX - dragStart.x);
        const newY = position.y + (e.clientY - dragStart.y);
        setPosition({ x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing && !isSnapped) {
        const newWidth = resizeStart.width + (e.clientX - resizeStart.x);
        const newHeight = resizeStart.height + (e.clientY - resizeStart.y);
        
        // Set minimum dimensions
        const width = Math.max(300, newWidth);
        const height = Math.max(200, newHeight);
        
        setSize({ width, height });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, position, resizeStart, isOpen, isSnapped]);
  
  // Handle window resize to adjust snapped position
  useEffect(() => {
    if (!isSnapped) return;
    
    const handleWindowResize = () => {
      updateSnappedPosition();
    };
    
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isSnapped]);
  
  // Update snapped position when snapped state changes
  useEffect(() => {
    if (isSnapped) {
      // Save current position and size before snapping
      setPreviousState({ position, size });
      updateSnappedPosition();
    } else if (previousState) {
      // Restore previous position and size when unsnapping
      setPosition(previousState.position);
      setSize(previousState.size);
    }
  }, [isSnapped]);
  
  const updateSnappedPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const snappedWidth = Math.min(450, windowWidth * 0.3);
    
    setPosition({ x: windowWidth - snappedWidth - 10, y: 20 });
    setSize({ width: snappedWidth, height: windowHeight - 40 });
  };
  
  const handleDragStart = (e: React.MouseEvent) => {
    if (isSnapped || 
        (e.target !== containerRef.current && 
        !(e.target as HTMLElement).classList.contains('floating-pdf-header'))) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };
  
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isSnapped) return;
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    e.preventDefault();
  };
  
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };
  
  const toggleSnap = () => {
    setIsSnapped(!isSnapped);
    if (minimized) setMinimized(false);
  };
  
  // Get the selected document URL
  const getSelectedDocumentUrl = (): string => {
    const selectedDoc = documentOptions.find(doc => doc.id === selectedDocumentId);
    return selectedDoc?.url || `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={containerRef}
      className={`fixed bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden z-50 ${isSnapped ? 'transition-all duration-300' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: minimized ? '300px' : `${size.width}px`,
        height: minimized ? '40px' : `${size.height}px`,
        transition: minimized ? 'height 0.3s, width 0.3s' : isSnapped ? 'all 0.3s' : 'none'
      }}
    >
      {/* Header with controls */}
      <div 
        className="floating-pdf-header bg-gray-100 py-2 px-3 flex justify-between items-center border-b border-gray-300"
        style={{ cursor: isSnapped ? 'default' : 'move' }}
        onMouseDown={handleDragStart}
      >
        <h3 className="text-sm font-semibold truncate flex-1">
          ເອກະສານຂອງຕອນດິນ: {parcelId}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={toggleSnap} 
            className={`text-gray-600 hover:text-gray-800 focus:outline-none ${isSnapped ? 'text-blue-600' : ''}`}
            title={isSnapped ? "ຍົກເລີກການຄາດໄວ້" : "ຄາດໄວ້ທາງຂວາ"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M18 9l-5-5m0 0L8 9m5-5v12" />
            </svg>
          </button>
          <button 
            onClick={toggleMinimize} 
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            title={minimized ? "ຂະຫຍາຍ" : "ຫຍໍ້"}
          >
            {minimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )}
          </button>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 focus:outline-none"
            title="ປິດ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      {!minimized && (
        <div className="relative flex flex-col h-[calc(100%-40px)]">
          {/* Document selector */}
          <div className="bg-gray-50 border-b border-gray-300 p-2">
            <select
              value={selectedDocumentId}
              onChange={(e) => setSelectedDocumentId(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {documentOptions.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* PDF viewer container */}
          <div className="flex-grow">
            <PdfViewer2 
              pdfUrl={getSelectedDocumentUrl()}
              height="100%"
              showControls={true}
            />
          </div>
          
          {/* Resize handle - only show when not snapped */}
          {!isSnapped && (
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
              onMouseDown={handleResizeStart}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400"
              >
                <polyline points="16 16 22 16 22 22"></polyline>
                <polyline points="8 16 2 16 2 22"></polyline>
                <polyline points="16 8 22 8 22 2"></polyline>
                <polyline points="8 8 2 8 2 2"></polyline>
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 