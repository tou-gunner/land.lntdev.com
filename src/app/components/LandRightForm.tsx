"use client";

import { useState, useEffect } from "react";
import { 
  useGetRightTypesQuery, 
  useGetLandUseTypesQuery, 
  useGetLandTitleHistoryQuery,
  useSaveLandRightsMutation
} from "../redux/api/apiSlice";
import { useToast } from "../hooks/useToast";

export default function LandRightForm({ landRightData: initialLandRightData }: { landRightData: any }) {
  const [landRightData, setLandRightData] = useState(initialLandRightData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  // Use RTK Query hooks for data fetching
  const { data: rightTypes = [], isLoading: loadingRightTypes } = useGetRightTypesQuery();
  const { data: landUseTypes = [], isLoading: loadingLandUseTypes } = useGetLandUseTypesQuery();
  const { data: landTitleHistory = [], isLoading: loadingLandTitleHistory } = useGetLandTitleHistoryQuery();
  
  // Use the save mutation
  const [saveLandRights, { isLoading: isSaving }] = useSaveLandRightsMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const updateLandRightData = { ...landRightData };
    
    // Handle cascading selection for location fields
    if (name === "province") {
      updateLandRightData[name] = value;
      updateLandRightData["district"] = "";
      updateLandRightData["village"] = "";
    } else if (name === "district") {
      updateLandRightData[name] = value;
      updateLandRightData["village"] = "";
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updateLandRightData[name] = checked;
    } else {
      updateLandRightData[name] = value;
    }

    setLandRightData(updateLandRightData);
    
    // Clear error for the field that was changed
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Check required fields based on schema
    if (!landRightData.parcelid) {
      newErrors.parcelid = "ກະລຸນາລະບຸລະຫັດຕອນດິນ";
    }
    
    if (!landRightData.ownerid) {
      newErrors.ownerid = "ກະລຸນາລະບຸລະຫັດເຈົ້າຂອງ";
    }
    
    // Additional validations can be added here
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error("ກະລຸນາແກ້ໄຂຂໍ້ມູນທີ່ບໍ່ຖືກຕ້ອງ");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format dates if needed
      const dataToSubmit = {
        "old_ownerid": landRightData.old_ownerid || null,
        "part": landRightData.part || null,
        "history": landRightData.history ? `${landRightData.history}` : null,
        "righttype": landRightData.righttype ? `${landRightData.righttype}` : null,
        "landregisterbookno": landRightData.landregisterbookno || null,
        "titlenumber": landRightData.titlenumber || null,
        "titleeditionno": landRightData.titleeditionno || null,
        "landrightcategory": landRightData.landrightcategory ? `${landRightData.landrightcategory}` : null,
        "landregistersheetno": landRightData.landregistersheetno || null,
        "stateland": landRightData.stateland === null ? null : `${landRightData.stateland}`,
        "gid": landRightData.gid || null,
        "parcelid": landRightData.parcelid || null,
        "ownerid": landRightData.ownerid || null,
        "barcode": landRightData.barcode || null,
        "valid_from": landRightData.valid_from || null,
        "valid_till": landRightData.valid_till || null,
        "date_conclusion": landRightData.date_conclusion || null,
        "date_title_printed": landRightData.date_title_printed || null,
        "date_public_display": landRightData.date_public_display || null,
        "date_title_send_to_ponre": landRightData.date_title_send_to_ponre || null,
        "date_title_issued": landRightData.date_title_issued || null
      };
      
      // Send data to server
      const response = await saveLandRights(dataToSubmit).unwrap();
      
      if (response.success) {
        showToast.success("ບັນທຶກຂໍ້ມູນສຳເລັດ");
        // You can add redirection or additional logic here
      } else {
        showToast.error(response.message || "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
      }
    } catch (error: any) {
      console.error("Error saving land right data:", error);
      showToast.error(error.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ");
    } finally {
      setIsSubmitting(false);
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
              value={landRightData.righttype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingRightTypes || isSubmitting}
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
            {errors.righttype && (
              <p className="text-red-500 mt-1 text-sm">{errors.righttype}</p>
            )}
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
              value={landRightData.titlenumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.titlenumber && (
              <p className="text-red-500 mt-1 text-sm">{errors.titlenumber}</p>
            )}
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
              value={landRightData.titleeditionno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.titleeditionno && (
              <p className="text-red-500 mt-1 text-sm">{errors.titleeditionno}</p>
            )}
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
              value={landRightData.landregisterbookno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.landregisterbookno && (
              <p className="text-red-500 mt-1 text-sm">{errors.landregisterbookno}</p>
            )}
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
              value={landRightData.landregistersheetno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.landregistersheetno && (
              <p className="text-red-500 mt-1 text-sm">{errors.landregistersheetno}</p>
            )}
          </div>
          
          {/* Approval Type */}
          <div className="form-group">
            <label htmlFor="landrightcategory" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດສິດນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landrightcategory"
              name="landrightcategory"
              value={landRightData.landrightcategory}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingLandUseTypes || isSubmitting}
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
            {errors.landrightcategory && (
              <p className="text-red-500 mt-1 text-sm">{errors.landrightcategory}</p>
            )}
          </div>
          
          {/* Land Title History */}
          <div className="form-group">
            <label htmlFor="history" className="block mb-2 font-semibold text-black dark:text-white">
              ການໄດ້ມາຂອງສິດນຳໃຊ້:
            </label>
            <select
              id="history"
              name="history"
              value={landRightData.history}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingLandTitleHistory || isSubmitting}
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
            {errors.history && (
              <p className="text-red-500 mt-1 text-sm">{errors.history}</p>
            )}
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
              value={landRightData.part}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.part && (
              <p className="text-red-500 mt-1 text-sm">{errors.part}</p>
            )}
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
              value={landRightData.date_title_issued ? landRightData.date_title_issued.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.date_title_issued && (
              <p className="text-red-500 mt-1 text-sm">{errors.date_title_issued}</p>
            )}
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
              value={landRightData.date_title_send_to_ponre ? landRightData.date_title_send_to_ponre.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.date_title_send_to_ponre && (
              <p className="text-red-500 mt-1 text-sm">{errors.date_title_send_to_ponre}</p>
            )}
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
              value={landRightData.date_conclusion ? landRightData.date_conclusion.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.date_conclusion && (
              <p className="text-red-500 mt-1 text-sm">{errors.date_conclusion}</p>
            )}
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
              value={landRightData.date_title_printed ? landRightData.date_title_printed.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.date_title_printed && (
              <p className="text-red-500 mt-1 text-sm">{errors.date_title_printed}</p>
            )}
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
              value={landRightData.date_public_display ? landRightData.date_public_display.split('T')[0] : ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
            {errors.date_public_display && (
              <p className="text-red-500 mt-1 text-sm">{errors.date_public_display}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </button>
        </div>
      </form>
    </div>
  );
} 