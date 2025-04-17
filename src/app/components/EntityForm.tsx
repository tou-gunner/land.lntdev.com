"use client";

import { useState, useEffect } from "react";
import { 
  useGetEntityTypesQuery, 
  useGetBusinessTypesQuery, 
  useGetMinistriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useGetTitlesQuery
} from "../redux/api/apiSlice";
import { useFormContext } from "../contexts/FormContext";

interface ApiItem {
  id: number | string;
  name: string;
  englishName?: string;
}

interface Province {
  provincecode: string;
  province_english: string;
  province_lao: string;
}

interface District {
  districtcode: string;
  district_english: string;
  district_lao: string;
}

interface Village {
  provinceid: string;
  provincename: string;
  districtid: string;
  districtname: string;
  villageid: string;
  villagename: string;
}

export default function EntityForm() {
  const { formData, updateFormData } = useFormContext();
  // Use RTK Query hooks for data fetching
  const { data: entityTypes = [], isLoading: loadingEntityTypes } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: loadingBusinessTypes } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: loadingMinistries } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: loadingTitles } = useGetTitlesQuery();
  
   // Location data
   const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();
   const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(formData.province, {
     skip: !formData.province
   });
   const { data: villages = [], isLoading: villagesLoading } = useGetVillagesQuery(formData.district, {
     skip: !formData.district
   });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const updatedFormData = { ...formData };
    
    // Handle cascading selection for location fields
    if (name === "province") {
      updatedFormData[name] = value;
      updatedFormData["district"] = "";
      updatedFormData["village"] = "";
    } else if (name === "district") {
      updatedFormData[name] = value;
      updatedFormData["village"] = "";
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updatedFormData[name] = checked;
    } else {
      updatedFormData[name] = value;
    }
    
    // Update the context
    updateFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //TODO: Submit form data
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຟອມຂໍ້ມູນນິຕິບຸກຄົນ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prefix */}
          <div className="form-group">
            <label htmlFor="title" className="block mb-2 font-semibold text-black dark:text-white">
              ຄຳນຳຫນ້ານາມ:
            </label>
            <select
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingTitles}
            >
              <option value="">ເລືອກຄຳນຳຫນ້ານາມ</option>
              {loadingTitles ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                titles.map((prefix) => (
                  <option key={prefix.id} value={prefix.id.toString()}>
                    {prefix.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ ແລະ ນາມສະກຸນ:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Entity Type */}
          <div className="form-group">
            <label htmlFor="entitytype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດນິຕິບຸກຄົນ:
            </label>
            <select
              id="entitytype"
              name="entitytype"
              value={formData.entitytype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingEntityTypes}
            >
              <option value="">ເລືອກປະເພດ</option>
              {loadingEntityTypes ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                entityTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Registration Number */}
          <div className="form-group">
            <label htmlFor="regno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທະບຽນ:
            </label>
            <input
              type="text"
              id="regno"
              name="regno"
              value={formData.regno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Registration Date */}
          <div className="form-group">
            <label htmlFor="regdate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີຂຶ້ນທະບຽນ:
            </label>
            <input
              type="date"
              id="regdate"
              name="regdate"
              value={formData.regdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Business Type */}
          <div className="form-group">
            <label htmlFor="businesstype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດທຸລະກິດ:
            </label>
            <select
              id="businesstype"
              name="businesstype"
              value={formData.businesstype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingBusinessTypes}
            >
              <option value="">ເລືອກປະເພດ</option>
              {loadingBusinessTypes ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                businessTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Nationality */}
          <div className="form-group">
            <label htmlFor="nationality" className="block mb-2 font-semibold text-black dark:text-white">
              ສັນຊາດ:
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Government Workplace */}
          <div className="form-group">
            <label htmlFor="governmentplace" className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານທີ່ເຮັດວຽກຂອງລັດ:
            </label>
            <select
              id="governmentplace"
              name="governmentplace"
              value={formData.governmentplace}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingMinistries}
            >
              <option value="">ເລືອກສະຖານທີ່</option>
              {loadingMinistries ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id.toString()}>
                    {ministry.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="companyname" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ບໍລິສັດ:
            </label>
            <input
              type="text"
              id="companyname"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Address Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">ທີ່ຢູ່:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province */}
            <div className="form-group">
              <label htmlFor="province" className="block mb-2 font-semibold text-black dark:text-white">
                ແຂວງ:
              </label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={provincesLoading}
              >
                <option value="">ເລືອກແຂວງ</option>
                {provincesLoading ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* District */}
            <div className="form-group">
              <label htmlFor="district" className="block mb-2 font-semibold text-black dark:text-white">
                ເມືອງ:
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={districtsLoading || !formData.province}
              >
                <option value="">ເລືອກເມືອງ</option>
                {districtsLoading ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Village */}
            <div className="form-group">
              <label htmlFor="village" className="block mb-2 font-semibold text-black dark:text-white">
                ບ້ານ:
              </label>
              <select
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={villagesLoading || !formData.district}
              >
                <option value="">ເລືອກບ້ານ</option>
                {villagesLoading ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Unit */}
            <div className="form-group">
              <label htmlFor="unit" className="block mb-2 font-semibold text-black dark:text-white">
                ຫນ່ວຍ:
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Road */}
            <div className="form-group">
              <label htmlFor="road" className="block mb-2 font-semibold text-black dark:text-white">
                ຖະຫນົນ:
              </label>
              <input
                type="text"
                id="road"
                name="road"
                value={formData.road}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* House Number */}
            <div className="form-group">
              <label htmlFor="houseno" className="block mb-2 font-semibold text-black dark:text-white">
                ເຮືອນເລກທີ:
              </label>
              <input
                type="text"
                id="houseno"
                name="houseno"
                value={formData.houseno}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-md shadow-sm font-semibold"
          >
            ບັນທຶກ
          </button>
        </div>
      </form>
    </div>
  );
} 