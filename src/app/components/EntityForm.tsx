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

interface EntityFormProps {
  formData?: any;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function EntityForm({ formData: propFormData, onChange, onSubmit }: EntityFormProps) {
  const [formData, setFormData] = useState({
    prefix: "",
    fullName: "",
    entityType: "",
    registrationNumber: "",
    registrationDate: "",
    businessType: "",
    nationality: "",
    governmentWorkplace: "",
    companyName: "",
    // Address fields
    province: "",
    district: "",
    village: "",
    unit: "",
    road: "",
    houseNumber: "",
    ...(propFormData || {}) // Initialize with propFormData if provided
  });

  // Update local state when prop changes
  useEffect(() => {
    if (propFormData) {
      setFormData(propFormData);
    }
  }, [propFormData]);

  // Use RTK Query hooks for data fetching
  const { data: entityTypes = [], isLoading: loadingEntityTypes } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: loadingBusinessTypes } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: loadingMinistries } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: loadingTitles } = useGetTitlesQuery();
  
  // Use RTK Query hooks for location data
  const { data: provinces = [], isLoading: isLoadingProvinces } = useGetProvincesQuery();
  const { data: districts = [], isLoading: isLoadingDistricts } = useGetDistrictsQuery(formData.province, {
    skip: !formData.province
  });
  const { data: villages = [], isLoading: isLoadingVillages } = useGetVillagesQuery(formData.district, {
    skip: !formData.district
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let newFormData;
    
    // Reset dependent fields when parent field changes
    if (name === "province") {
      newFormData = {
        ...formData,
        province: value,
        district: "",
        village: ""
      };
    } else if (name === "district") {
      newFormData = {
        ...formData,
        district: value,
        village: ""
      };
    } else {
      newFormData = {
        ...formData,
        [name]: value,
      };
    }
    
    setFormData(newFormData);
    
    // Delay the onChange callback to the next tick to avoid simultaneous renders
    if (onChange) {
      setTimeout(() => {
        onChange(newFormData);
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຟອມຂໍ້ມູນນິຕິບຸກຄົນ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prefix */}
          <div className="form-group">
            <label htmlFor="prefix" className="block mb-2 font-semibold text-black dark:text-white">
              ຄຳນຳຫນ້ານາມ:
            </label>
            <select
              id="prefix"
              name="prefix"
              value={formData.prefix}
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
            <label htmlFor="fullName" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ ແລະ ນາມສະກຸນ:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Entity Type */}
          <div className="form-group">
            <label htmlFor="entityType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດນິຕິບຸກຄົນ:
            </label>
            <select
              id="entityType"
              name="entityType"
              value={formData.entityType}
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
            <label htmlFor="registrationNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທະບຽນ:
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Registration Date */}
          <div className="form-group">
            <label htmlFor="registrationDate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີຂຶ້ນທະບຽນ:
            </label>
            <input
              type="date"
              id="registrationDate"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Business Type */}
          <div className="form-group">
            <label htmlFor="businessType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດທຸລະກິດ:
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
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
            <label htmlFor="governmentWorkplace" className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານທີ່ເຮັດວຽກຂອງລັດ:
            </label>
            <select
              id="governmentWorkplace"
              name="governmentWorkplace"
              value={formData.governmentWorkplace}
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
            <label htmlFor="companyName" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ບໍລິສັດ:
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
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
                disabled={isLoadingProvinces}
              >
                <option value="">ເລືອກແຂວງ</option>
                {isLoadingProvinces ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  provinces.map((province) => (
                    <option key={province.provincecode} value={province.provincecode}>
                      {province.province_lao}
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
                disabled={isLoadingDistricts || !formData.province}
              >
                <option value="">ເລືອກເມືອງ</option>
                {isLoadingDistricts ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  districts.map((district) => (
                    <option key={district.districtcode} value={district.districtcode}>
                      {district.district_lao}
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
                disabled={isLoadingVillages || !formData.district}
              >
                <option value="">ເລືອກບ້ານ</option>
                {isLoadingVillages ? (
                  <option value="">ກຳລັງໂຫຼດ...</option>
                ) : (
                  villages.map((village) => (
                    <option key={village.villageid} value={village.villageid}>
                      {village.villagename}
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
              <label htmlFor="houseNumber" className="block mb-2 font-semibold text-black dark:text-white">
                ເຮືອນເລກທີ:
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
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