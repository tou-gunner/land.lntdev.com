"use client";

import { useState } from 'react';
import PdfViewer3 from '../components/PdfViewer3';
import FloatingPdfViewer from '../components/FloatingPdfViewer';
import SidebarPdfViewer from '../components/SidebarPdfViewer';
import SplitViewPdfViewer from '../components/SplitViewPdfViewer';

export default function PdfSnapDemo() {
  const [viewerType, setViewerType] = useState<'none' | 'floating' | 'sidebar' | 'split-view'>('none');
  const [splitLayout, setSplitLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const demoParcelId = "DEMO123456";
  const demoUrl = "/sample.pdf";

  return (
    <div className={`p-8 max-w-4xl mx-auto ${viewerType === 'sidebar' ? 'with-sidebar' : ''}`}>
      <h1 className="text-3xl font-bold mb-6">PDF Viewer Integration Demo</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">ຮູບແບບການເບິ່ງ PDF</h2>
        <p className="mb-4 text-gray-700">
          ລະບົບມີທາງເລືອກໃນການສະແດງ PDF ຫຼາຍຮູບແບບ ເຊິ່ງສາມາດເລືອກໃຊ້ໄດ້ຕາມຄວາມເໝາະສົມ:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setViewerType(viewerType === 'floating' ? 'none' : 'floating')}
            className={`px-4 py-3 rounded flex flex-col items-center text-center ${
              viewerType === 'floating' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span className="font-medium">PDF ແບບລອຍ</span>
            <span className="text-sm mt-1">
              ສາມາດຍ້າຍ ແລະ ປັບຂະໜາດໄດ້ຕາມຕ້ອງການ
            </span>
          </button>
          
          <button
            onClick={() => setViewerType(viewerType === 'sidebar' ? 'none' : 'sidebar')}
            className={`px-4 py-3 rounded flex flex-col items-center text-center ${
              viewerType === 'sidebar' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="font-medium">PDF ແບບຂ້າງໜ້າຈໍ</span>
            <span className="text-sm mt-1">
              ຄັດຕິດຢູ່ຂ້າງໜ້າຈໍ ສາມາດປັບຂະໜາດໄດ້
            </span>
          </button>
          
          <button
            onClick={() => setViewerType(viewerType === 'split-view' ? 'none' : 'split-view')}
            className={`px-4 py-3 rounded flex flex-col items-center text-center ${
              viewerType === 'split-view' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span className="font-medium">PDF ແບບສະແບ່ງໜ້າຈໍ</span>
            <span className="text-sm mt-1">
              ແບ່ງໜ້າຈໍເພື່ອເບິ່ງເອກະສານພ້ອມຂໍ້ມູນ
            </span>
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-md font-semibold text-blue-800 mb-2">ປຽບທຽບຄວາມແຕກຕ່າງ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div>
              <h4 className="font-medium mb-1">PDF ແບບລອຍ:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-blue-700">
                <li>ສາມາດຍ້າຍໄປຍັງຕຳແໜ່ງໃດກໍໄດ້</li>
                <li>ປັບຂະໜາດໄດ້ອິດສະຫຼະ</li>
                <li>ມີຕົວເລືອກ "ຄາດໄວ້ຂ້າງໜ້າຈໍ" ເພີ່ມເຕີມ</li>
                <li>ເໝາະສຳລັບການເບິ່ງເອກະສານໄລຍະສັ້ນ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">PDF ແບບຂ້າງໜ້າຈໍ:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-blue-700">
                <li>ເນື້ອຫາຫຼັກຈະຍ້າຍເພື່ອຮອງຮັບຕົວເບິ່ງ PDF</li>
                <li>ປັບຂະໜາດຕາມຄວາມກວ້າງໄດ້</li>
                <li>ກົດເຂົ້າໄດ້ຫຼາຍໜ້າຈໍ ແລະ ຕອບສະໜອງອຸປະກອນ</li>
                <li>ເໝາະສຳລັບການເບິ່ງເອກະສານເປັນເວລາດົນ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">PDF ແບບສະແບ່ງໜ້າຈໍ:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-blue-700">
                <li>ແບ່ງໜ້າຈໍເພື່ອສະແດງທັງ PDF ແລະ ຂໍ້ມູນອື່ນ</li>
                <li>ປັບອັດຕາສ່ວນດ້ວຍການລາກ</li>
                <li>ສາມາດປັບສະຫຼັບລະຫວ່າງແນວນອນແລະແນວຕັ້ງ</li>
                <li>ເໝາະສຳລັບການປ້ອນຂໍ້ມູນໂດຍອ້າງອີງເອກະສານ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">ການນຳໃຊ້</h2>
        
        <div className="border-l-4 border-gray-300 pl-4 py-2 mb-4">
          <p className="text-gray-700">
            ຜູ້ໃຊ້ສາມາດເລືອກຮູບແບບທີ່ເໝາະສົມກັບການໃຊ້ງານ. ໃນໜ້າຈັດການຂໍ້ມູນທີ່ດິນ 
            ທ່ານສາມາດສະຫຼັບລະຫວ່າງຮູບແບບຕ່າງໆໂດຍໃຊ້ປຸ່ມສະຫຼັບທີ່ຢູ່ດ້ານຂ້າງຂອງປຸ່ມ "ເປີດເອກະສານ".
          </p>
        </div>
      </div>
      
      {/* Floating PDF Viewer */}
      {viewerType === 'floating' && (
        <FloatingPdfViewer 
          parcelId={demoParcelId}
          isOpen={true}
          onClose={() => setViewerType('none')}
        />
      )}
      
      {/* Sidebar PDF Viewer */}
      {viewerType === 'sidebar' && (
        <SidebarPdfViewer
          pdfUrl={demoUrl}
          isOpen={true}
          onClose={() => setViewerType('none')}
        />
      )}
      
      {/* Split View PDF Viewer */}
      {viewerType === 'split-view' && (
        <div className="mt-8">
          <SplitViewPdfViewer
            pdfUrl={demoUrl}
            defaultLayout={splitLayout}
            height="700px"
          >
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-4">ຂໍ້ມູນທີ່ດິນ</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ເລກທີ່ດິນ</label>
                      <input type="text" value="23456-789" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ປະເພດທີ່ດິນ</label>
                      <input type="text" value="ທີ່ດິນປຸກສ້າງ" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ເນື້ອທີ່</label>
                      <input type="text" value="0.5 ເຮັກຕາ" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ເມືອງ</label>
                      <input type="text" value="ນະຄອນຫຼວງວຽງຈັນ" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-3">ຂໍ້ມູນເຈົ້າຂອງ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ຊື່</label>
                      <input type="text" value="ທ. ສົມສະຫວັນ" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ນາມສະກຸນ</label>
                      <input type="text" value="ພິລາວົງ" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ວັນເດືອນປີເກີດ</label>
                      <input type="text" value="15/05/1980" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ເລກບັດປະຊາຊົນ</label>
                      <input type="text" value="0123456789" readOnly className="w-full p-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-3">ໝາຍເຫດ</h4>
                  <textarea 
                    className="w-full p-2 bg-white border border-gray-300 rounded-md min-h-[80px]"
                    placeholder="ພິມໝາຍເຫດຢູ່ນີ້..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    ບັນທຶກຂໍ້ມູນ
                  </button>
                </div>
              </div>
            </div>
          </SplitViewPdfViewer>
        </div>
      )}
    </div>
  );
} 