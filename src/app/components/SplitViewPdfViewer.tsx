"use client";

import React, { useState, ReactNode, useRef, useImperativeHandle, forwardRef } from 'react';
import PdfViewer2, { PdfViewer2Ref } from './PdfViewer2';
import { useTheme } from './ThemeProvider';

interface SplitViewPdfViewerProps {
  pdfUrl: string;
  children: ReactNode;
  defaultLayout?: 'horizontal' | 'vertical';
  defaultRatio?: number;
  height?: string;
  initialPage?: number;
  initialRotation?: number;
  onPageChange?: (pageNumber: number) => void;
  onRotationChange?: (rotation: number) => void;
  onLoadSuccess?: (pdf: { numPages: number }) => void;
  useBuiltinPdfReader?: boolean;
}

export interface SplitViewPdfViewerRef {
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  setRotation: (angle: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const SplitViewPdfViewer = forwardRef<SplitViewPdfViewerRef, SplitViewPdfViewerProps>(({
  pdfUrl,
  children,
  defaultLayout = 'horizontal',
  defaultRatio = 0.5,
  height = '600px',
  initialPage = 1,
  initialRotation = 0,
  onPageChange,
  onRotationChange,
  onLoadSuccess,
  useBuiltinPdfReader = false
}, ref) => {
  const { theme } = useTheme();
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>(defaultLayout);
  const [ratio, setRatio] = useState(defaultRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const pdfViewerRef = useRef<PdfViewer2Ref>(null);

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    nextPage: () => {
      pdfViewerRef.current?.nextPage();
    },
    previousPage: () => {
      pdfViewerRef.current?.previousPage();
    },
    goToPage: (page: number) => {
      pdfViewerRef.current?.goToPage(page);
    },
    rotateClockwise: () => {
      pdfViewerRef.current?.rotateClockwise();
    },
    rotateCounterClockwise: () => {
      pdfViewerRef.current?.rotateCounterClockwise();
    },
    setRotation: (angle: number) => {
      pdfViewerRef.current?.setRotation(angle);
    },
    zoomIn: () => {
      pdfViewerRef.current?.zoomIn();
    },
    zoomOut: () => {
      pdfViewerRef.current?.zoomOut();
    },
    resetZoom: () => {
      pdfViewerRef.current?.resetZoom();
    }
  }));

  // Start dragging the divider
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos(layout === 'horizontal' ? e.clientX : e.clientY);
    e.preventDefault();
  };

  // Handle mouse movement while dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const currentPos = layout === 'horizontal' ? e.clientX : e.clientY;
    const containerSize = layout === 'horizontal' ? containerRect.width : containerRect.height;
    const containerStart = layout === 'horizontal' ? containerRect.left : containerRect.top;
    
    // Calculate new ratio based on mouse position
    const newRatio = (currentPos - containerStart) / containerSize;
    
    // Ensure the ratio stays within reasonable bounds (10% - 90%)
    setRatio(Math.min(0.9, Math.max(0.1, newRatio)));
  };

  // Stop dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Toggle between horizontal and vertical layouts
  const toggleLayout = () => {
    setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className="border overflow-hidden"
      style={{ 
        height,
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--border-color)',
        color: 'var(--card-foreground)'
      }}
    >
      {/* Toolbar */}
      {/* <div 
        className="flex items-center justify-between p-2 border-b"
        style={{ 
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h2 className="text-sm font-semibold">ເອກະສານ PDF</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleLayout}
            className="focus:outline-none p-1"
            style={{ 
              color: 'var(--foreground)',
              opacity: 0.8
            }}
            title={layout === 'horizontal' ? "ສະແດງແບບແນວຕັ້ງ" : "ສະແດງແບບແນວນອນ"}
            onMouseOver={e => e.currentTarget.style.opacity = '1'}
            onMouseOut={e => e.currentTarget.style.opacity = '0.8'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {layout === 'horizontal' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              )}
            </svg>
          </button>
          <button
            onClick={() => setRatio(0.5)}
            className="focus:outline-none p-1"
            style={{ 
              color: 'var(--foreground)',
              opacity: 0.8
            }}
            title="ຮູບແບບເທົ່າກັນ"
            onMouseOver={e => e.currentTarget.style.opacity = '1'}
            onMouseOut={e => e.currentTarget.style.opacity = '0.8'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v8m0 0h16m0 0V8m0 0H4" />
            </svg>
          </button>
        </div>
      </div> */}

      {/* Split container */}
      <div 
        className={`relative flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'} h-[calc(100%-40px)]`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        {/* PDF viewer */}
        <div 
          className="overflow-hidden transition-all duration-200"
          style={{ 
            [layout === 'horizontal' ? 'width' : 'height']: `${ratio * 100}%` 
          }}
        >
          {useBuiltinPdfReader ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Document"
            />
          ) : (
            <PdfViewer2
              ref={pdfViewerRef}
              pdfUrl={pdfUrl}
              height="100%"
              showControls={true}
              initialPage={initialPage}
              initialRotation={initialRotation}
              onPageChange={onPageChange}
              onRotationChange={onRotationChange}
              onLoadSuccess={onLoadSuccess}
            />
          )}
        </div>

        {/* Resizer handle */}
        <div 
          className={`
            ${layout === 'horizontal' ? 'cursor-col-resize w-1 h-full' : 'cursor-row-resize h-1 w-full'} 
            z-10 flex items-center justify-center transition-colors duration-200
          `}
          style={{ 
            backgroundColor: isDragging ? 'var(--accent-color)' : 'var(--border-color)',
          }}
          onMouseDown={handleDragStart}
          onMouseOver={e => {
            if (!isDragging) {
              e.currentTarget.style.backgroundColor = 'var(--accent-color-light)';
            }
          }}
          onMouseOut={e => {
            if (!isDragging) {
              e.currentTarget.style.backgroundColor = 'var(--border-color)';
            }
          }}
        >
          <div 
            className={`${layout === 'horizontal' ? 'h-8 w-1' : 'w-8 h-1'} rounded-full opacity-50 hover:opacity-100 pointer-events-none`}
            style={{ backgroundColor: 'var(--foreground)' }}
          ></div>
        </div>

        {/* Content area */}
        <div 
          className="flex-1 overflow-auto transition-all duration-200"
          style={{ 
            backgroundColor: 'var(--card-background)',
            color: 'var(--card-foreground)'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

SplitViewPdfViewer.displayName = 'SplitViewPdfViewer';

export default SplitViewPdfViewer; 