"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import { 
  useGetRightTypesQuery, 
  useGetLandUseTypesQuery, 
  useGetLandTitleHistoryQuery 
} from "../redux/api/apiSlice";

interface ApiItem {
  id: number | string;
  name: string;
  englishName?: string;
}

export default function LandRightForm() {
  const { formData: contextFormData, updateLandRightForm } = useFormContext();
  
  // Use RTK Query hooks for data fetching
  const { data: rightTypes = [], isLoading: loadingRightTypes } = useGetRightTypesQuery();
  const { data: landUseTypes = [], isLoading: loadingLandUseTypes } = useGetLandUseTypesQuery();
  const { data: landTitleHistory = [], isLoading: loadingLandTitleHistory } = useGetLandTitleHistoryQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update context directly
    updateLandRightForm({
      ...contextFormData.landright,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(contextFormData.landright);
    // Submit the form data to your API
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຂໍ້ມູນສິດນຳໃຊ້ທີ່ດິນ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ownership Status */}
          <div className="form-group">
            <label htmlFor="ownershipStatus" className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານະການເປັນເຈົ້າຂອງສິດ:
            </label>
            <select
              id="ownershipStatus"
              name="ownershipStatus"
              value={contextFormData.landright.ownershipStatus}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingRightTypes}
            >
              <option value="">ເລືອກສະຖານະ</option>
              {loadingRightTypes ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                rightTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Land Certificate Number */}
          <div className="form-group">
            <label htmlFor="landCertificateNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບຕາດິນ:
            </label>
            <input
              type="text"
              id="landCertificateNumber"
              name="landCertificateNumber"
              value={contextFormData.landright.landCertificateNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Issue Number */}
          <div className="form-group">
            <label htmlFor="issueNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກຄັ້ງທີ:
            </label>
            <input
              type="number"
              id="issueNumber"
              name="issueNumber"
              value={contextFormData.landright.issueNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Registry Book Number */}
          <div className="form-group">
            <label htmlFor="landRegistryBookNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີປຶ້ມທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="landRegistryBookNumber"
              name="landRegistryBookNumber"
              value={contextFormData.landright.landRegistryBookNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Registry Number */}
          <div className="form-group">
            <label htmlFor="landRegistryNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="landRegistryNumber"
              name="landRegistryNumber"
              value={contextFormData.landright.landRegistryNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Use Type */}
          <div className="form-group">
            <label htmlFor="landUseType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດສິດນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landUseType"
              name="landUseType"
              value={contextFormData.landright.landUseType}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingLandUseTypes}
            >
              <option value="">ເລືອກປະເພດ</option>
              {loadingLandUseTypes ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                landUseTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Land Acquisition Method */}
          <div className="form-group">
            <label htmlFor="landAcquisitionMethod" className="block mb-2 font-semibold text-black dark:text-white">
              ການໄດ້ມາຂອງສິດນຳໃຊ້:
            </label>
            <select
              id="landAcquisitionMethod"
              name="landAcquisitionMethod"
              value={contextFormData.landright.landAcquisitionMethod}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingLandTitleHistory}
            >
              <option value="">ເລືອກການໄດ້ມາ</option>
              {loadingLandTitleHistory ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                landTitleHistory.map((method) => (
                  <option key={method.id} value={method.id.toString()}>
                    {method.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Portion */}
          <div className="form-group">
            <label htmlFor="portion" className="block mb-2 font-semibold text-black dark:text-white">
              ພູດສ່ວນ:
            </label>
            <input
              type="number"
              id="portion"
              name="portion"
              value={contextFormData.landright.portion}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Certificate Date */}
          <div className="form-group">
            <label htmlFor="landCertificateDate" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="landCertificateDate"
              name="landCertificateDate"
              value={contextFormData.landright.landCertificateDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Certificate Delivery Date */}
          <div className="form-group">
            <label htmlFor="landCertificateDeliveryDate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີສົ່ງໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="landCertificateDeliveryDate"
              name="landCertificateDeliveryDate"
              value={contextFormData.landright.landCertificateDeliveryDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Classification Date */}
          <div className="form-group">
            <label htmlFor="classificationDate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີຈັດປະເພດ:
            </label>
            <input
              type="date"
              id="classificationDate"
              name="classificationDate"
              value={contextFormData.landright.classificationDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Print Date */}
          <div className="form-group">
            <label htmlFor="printDate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີພິມ:
            </label>
            <input
              type="date"
              id="printDate"
              name="printDate"
              value={contextFormData.landright.printDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Announcement Date */}
          <div className="form-group">
            <label htmlFor="announcementDate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີປະກາດແຈ້ງການ:
            </label>
            <input
              type="date"
              id="announcementDate"
              name="announcementDate"
              value={contextFormData.landright.announcementDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors"
          >
            ບັນທຶກ
          </button>
        </div>
      </form>
    </div>
  );
} 