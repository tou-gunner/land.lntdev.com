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
import { Entity } from "../contexts/FormContext";
import { useToast } from "../hooks/useToast";

// Import the useSaveEntityMutation hook
import { useSaveEntityMutation } from "../redux/api/apiSlice";

export default function EntityForm({ owner: initialOwner }: { owner: Entity }) {
  
  const [owner, setOwner] = useState<Entity>(initialOwner);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Create the saveEntity mutation hook
  const [saveEntity, { isLoading }] = useSaveEntityMutation();

  // Use RTK Query hooks for data fetching
  const { data: entityTypes = [], isLoading: loadingEntityTypes } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: loadingBusinessTypes } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: loadingMinistries } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: loadingTitles } = useGetTitlesQuery();
  
   // Location data
   const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();
   const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(owner.province, {
     skip: !owner.province
   });
   const { data: villages = [], isLoading: villagesLoading } = useGetVillagesQuery(owner.district, {
     skip: !owner.district
   });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const updatedOwner = { ...owner };
    
    // Handle cascading selection for location fields
    if (name === "province") {
      updatedOwner[name] = value;
      updatedOwner["district"] = "";
      updatedOwner["village"] = "";
    } else if (name === "district") {
      updatedOwner[name] = value;
      updatedOwner["village"] = "";
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updatedOwner[name] = checked;
    } else {
      updatedOwner[name] = value;
    }

    // Update the context
    setOwner(updatedOwner);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set submitting state
    setIsSubmitting(true);
    
    try {
      // Format the entity data according to the API requirements
      const entityData = {
        name: owner.name || null,
        entitytype: owner.entitytype ? `${owner.entitytype}` : null,
        registrationno: owner.registrationno || null,
        registrationdate: owner.registrationdate || null,
        businesstype: owner.businesstype ? `${owner.businesstype}` : null,
        nationality: owner.nationality || null,
        houseno: owner.houseno || null,
        road: owner.road || null,
        unit: owner.unit || null,
        village: owner.village || null,
        district: owner.district || null,
        province: owner.province || null,
        title: owner.title ? `${owner.title}` : null,
        gid: owner.gid || null,
        government_workplace: owner.government_workplace ? `${owner.government_workplace}` : null,
        isstate: owner.isstate === null ? null : `${owner.isstate}`,
        companyname: owner.companyname || null
      };
      
      // Submit the data to the API
      const response = await saveEntity(entityData).unwrap();
      
      // Show success notification
      showToast.success("ບັນທຶກຂໍ້ມູນນິຕິບຸກຄົນສຳເລັດ");
      
      // Optional: Reset form or redirect
      // setOwner(initialOwner); // Reset form
      
    } catch (error: any) {
      console.error('Failed to save entity:', error);
      showToast.error(error.data?.message || "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");
    } finally {
      setIsSubmitting(false);
    }
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
              value={owner.title}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingTitles || isSubmitting}
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
              value={owner.name}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
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
              value={owner.entitytype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingEntityTypes || isSubmitting}
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
            <label htmlFor="registrationno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທະບຽນ:
            </label>
            <input
              type="text"
              id="registrationno"
              name="registrationno"
              value={owner.registrationno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Registration Date */}
          <div className="form-group">
            <label htmlFor="registrationdate" className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທີຂຶ້ນທະບຽນ:
            </label>
            <input
              type="date"
              id="registrationdate"
              name="registrationdate"
              value={owner.registrationdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
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
              value={owner.businesstype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingBusinessTypes || isSubmitting}
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
              value={owner.nationality}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Government Workplace */}
          <div className="form-group">
            <label htmlFor="government_workplace" className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານທີ່ເຮັດວຽກຂອງລັດ:
            </label>
            <select
              id="government_workplace"
              name="government_workplace"
              value={owner.government_workplace}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingMinistries || isSubmitting}
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
              value={owner.companyname}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
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
                value={owner.province}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={provincesLoading || isSubmitting}
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
                value={owner.district}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={districtsLoading || !owner.province || isSubmitting}
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
                value={owner.village}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={villagesLoading || !owner.district || isSubmitting}
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
                value={owner.unit}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
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
                value={owner.road}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
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
                value={owner.houseno}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-md shadow-sm font-semibold"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </button>
        </div>
      </form>
    </div>
  );
} 