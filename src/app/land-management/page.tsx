"use client";

import { useState } from "react";
import LandForm from "../components/LandForm";
import LandRightForm from "../components/LandRightForm";
import OwnerForm from "../components/OwnerForm";
import { FormProvider, useFormContext } from "../contexts/FormContext";

// Component to demonstrate accessing form state from context
function FormLogger() {
  const { formData } = useFormContext();

  // Log form data when it changes
  const logFormData = () => {
    console.log('Current Form State:', formData);
  };

  return (
    <div className="mb-4 text-right">
      <button 
        onClick={logFormData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log Form State
      </button>
    </div>
  );
}

export default function LandManagementPage() {
  const [activeTab, setActiveTab] = useState<'land' | 'owner' | 'landright'>('land');
  
  // Add logging when tab changes to verify state persistence
  const handleTabChange = (tab: 'land' | 'owner' | 'landright') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  return (
    <FormProvider>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</h1>
          
          {/* Debug button */}
          <FormLogger />
          
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-6 flex-wrap">
            <button
              onClick={() => handleTabChange('land')}
              className={`py-2 px-4 font-medium text-lg ${
                activeTab === 'land'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ທີ່ດິນ
            </button>
            <button
              onClick={() => handleTabChange('owner')}
              className={`py-2 px-4 font-medium text-lg ${
                activeTab === 'owner'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ເຈົ້າຂອງ
            </button>
            <button
              onClick={() => handleTabChange('landright')}
              className={`py-2 px-4 font-medium text-lg ${
                activeTab === 'landright'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ສິດນຳໃຊ້ທີ່ດິນ
            </button>
          </div>
          
          {/* Tab Content - Using CSS to show/hide instead of conditional rendering */}
          <div className="tab-content">
            <div style={{ display: activeTab === 'land' ? 'block' : 'none' }}>
              <LandForm />
            </div>
            
            <div style={{ display: activeTab === 'owner' ? 'block' : 'none' }}>
              <OwnerForm />
            </div>
            
            <div style={{ display: activeTab === 'landright' ? 'block' : 'none' }}>
              <LandRightForm />
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
} 