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
          {/* Right Type (formerly Ownership Status) */}
          <div className="form-group">
            <label htmlFor="righttype" className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານະການເປັນເຈົ້າຂອງສິດ:
            </label>
            <select
              id="righttype"
              name="righttype"
              value={contextFormData.landright.righttype}
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
          
          {/* Land Title Number */}
          <div className="form-group">
            <label htmlFor="landtitleno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບຕາດິນ:
            </label>
            <input
              type="text"
              id="landtitleno"
              name="landtitleno"
              value={contextFormData.landright.landtitleno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Issue Number */}
          <div className="form-group">
            <label htmlFor="issueno" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກຄັ້ງທີ:
            </label>
            <input
              type="number"
              id="issueno"
              name="issueno"
              value={contextFormData.landright.issueno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Register Book Number */}
          <div className="form-group">
            <label htmlFor="registerbookno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີປຶ້ມທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="registerbookno"
              name="registerbookno"
              value={contextFormData.landright.registerbookno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Register Number */}
          <div className="form-group">
            <label htmlFor="registerno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="registerno"
              name="registerno"
              value={contextFormData.landright.registerno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Approval Type */}
          <div className="form-group">
            <label htmlFor="approvaltype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດສິດນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="approvaltype"
              name="approvaltype"
              value={contextFormData.landright.approvaltype}
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
          
          {/* Land Title History */}
          <div className="form-group">
            <label htmlFor="lthistory" className="block mb-2 font-semibold text-black dark:text-white">
              ການໄດ້ມາຂອງສິດນຳໃຊ້:
            </label>
            <select
              id="lthistory"
              name="lthistory"
              value={contextFormData.landright.lthistory}
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
          
          {/* Land Title Date */}
          <div className="form-group">
            <label htmlFor="landtitledate" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="landtitledate"
              name="landtitledate"
              value={contextFormData.landright.landtitledate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Title Delivery Date */}
          <div className="form-group">
            <label htmlFor="landtitledeliverydate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີສົ່ງໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="landtitledeliverydate"
              name="landtitledeliverydate"
              value={contextFormData.landright.landtitledeliverydate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Classification Date */}
          <div className="form-group">
            <label htmlFor="classificationdate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີຈັດປະເພດ:
            </label>
            <input
              type="date"
              id="classificationdate"
              name="classificationdate"
              value={contextFormData.landright.classificationdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Print Date */}
          <div className="form-group">
            <label htmlFor="printdate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີພິມ:
            </label>
            <input
              type="date"
              id="printdate"
              name="printdate"
              value={contextFormData.landright.printdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Announcement Date */}
          <div className="form-group">
            <label htmlFor="announcementdate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີປະກາດແຈ້ງການ:
            </label>
            <input
              type="date"
              id="announcementdate"
              name="announcementdate"
              value={contextFormData.landright.announcementdate}
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