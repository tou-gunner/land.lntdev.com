"use client";

import { useState, useEffect } from "react";
import { 
  useGetRightTypesQuery, 
  useGetLandUseTypesQuery, 
  useGetLandTitleHistoryQuery 
} from "../redux/api/apiSlice";

interface LandRightProps {
  formData?: any;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function LandRightForm({ formData = {}, onChange, onSubmit }: LandRightProps) {
  // Use RTK Query hooks for data fetching
  const { data: rightTypes = [], isLoading: loadingRightTypes } = useGetRightTypesQuery();
  const { data: landUseTypes = [], isLoading: loadingLandUseTypes } = useGetLandUseTypesQuery();
  const { data: landTitleHistory = [], isLoading: loadingLandTitleHistory } = useGetLandTitleHistoryQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Create updated data
    const updatedData = {
      ...formData,
      [name]: value,
    };
    
    // Call onChange if provided
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Form data:", formData);
    }
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
              value={formData.righttype || ""}
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
            <label htmlFor="titlenumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບຕາດິນ:
            </label>
            <input
              type="text"
              id="titlenumber"
              name="titlenumber"
              value={formData.titlenumber || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Issue Number */}
          <div className="form-group">
            <label htmlFor="titleeditionno" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກຄັ້ງທີ:
            </label>
            <input
              type="text"
              id="titleeditionno"
              name="titleeditionno"
              value={formData.titleeditionno || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Register Book Number */}
          <div className="form-group">
            <label htmlFor="landregisterbookno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີປຶ້ມທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="landregisterbookno"
              name="landregisterbookno"
              value={formData.landregisterbookno || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Register Number */}
          <div className="form-group">
            <label htmlFor="landregistersheetno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີໃບທະບຽນທີ່ດິນ:
            </label>
            <input
              type="text"
              id="landregistersheetno"
              name="landregistersheetno"
              value={formData.landregistersheetno || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Approval Type */}
          <div className="form-group">
            <label htmlFor="landrightcategory" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດສິດນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landrightcategory"
              name="landrightcategory"
              value={formData.landrightcategory || ""}
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
            <label htmlFor="history" className="block mb-2 font-semibold text-black dark:text-white">
              ການໄດ້ມາຂອງສິດນຳໃຊ້:
            </label>
            <select
              id="history"
              name="history"
              value={formData.history || ""}
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
            <label htmlFor="part" className="block mb-2 font-semibold text-black dark:text-white">
              ພູດສ່ວນ:
            </label>
            <input
              type="text"
              id="part"
              name="part"
              value={formData.part || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Date fields */}
          <div className="form-group">
            <label htmlFor="date_title_issued" className="block mb-2 font-semibold text-black dark:text-white">
              ອອກໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="date_title_issued"
              name="date_title_issued"
              value={formData.date_title_issued ? formData.date_title_issued.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Title Delivery Date */}
          <div className="form-group">
            <label htmlFor="date_title_send_to_ponre" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີສົ່ງໃບຕາດິນ:
            </label>
            <input
              type="date"
              id="date_title_send_to_ponre"
              name="date_title_send_to_ponre"
              value={formData.date_title_send_to_ponre ? formData.date_title_send_to_ponre.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Conclusion Date */}
          <div className="form-group">
            <label htmlFor="date_conclusion" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີເຊັນສັນຍາ:
            </label>
            <input
              type="date"
              id="date_conclusion"
              name="date_conclusion"
              value={formData.date_conclusion ? formData.date_conclusion.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Print Date */}
          <div className="form-group">
            <label htmlFor="date_title_printed" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີພິມ:
            </label>
            <input
              type="date"
              id="date_title_printed"
              name="date_title_printed"
              value={formData.date_title_printed ? formData.date_title_printed.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Display Date */}
          <div className="form-group">
            <label htmlFor="date_public_display" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີປະກາດແຈ້ງການ:
            </label>
            <input
              type="date"
              id="date_public_display"
              name="date_public_display"
              value={formData.date_public_display ? formData.date_public_display.split('T')[0] : ""}
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