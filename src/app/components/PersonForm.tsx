"use client";

import { useState, useEffect } from "react";
import { 
  useGetMinistriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useGetTitlesQuery,
  useSavePersonMutation
} from "../redux/api/apiSlice";
import { Person } from "../contexts/FormContext";
import { useToast } from "../hooks/useToast";

export default function PersonForm({owner: initialOwner}: {owner: Person}) {

  const [owner, setOwner] = useState<Person>(initialOwner);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Create the saveEntity mutation hook
  const [savePerson, { isLoading }] = useSavePersonMutation();

  // Use RTK Query hooks for data fetching
  const { data: ministries = [], isLoading: loadingMinistries } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: loadingTitles } = useGetTitlesQuery();
  
  // Use RTK Query hooks for location data
  const { data: provinces = [], isLoading: isLoadingProvinces } = useGetProvincesQuery();
  const { data: districts = [], isLoading: isLoadingDistricts } = useGetDistrictsQuery(owner.province, {
    skip: !owner.province
  });
  const { data: villages = [], isLoading: isLoadingVillages } = useGetVillagesQuery(owner.district, {
    skip: !owner.district
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Set submitting state
    setIsSubmitting(true);
    
    try {
      // Format the entity data according to the API requirements
      const personData = {
        title: owner.title ? `${owner.title}` : null,
        firstname: owner.firstname,
        lastname: owner.lastname,
        birthdate: owner.birthdate,
        nationality: owner.nationality,
        occupation: owner.occupation,
        idcardno: owner.idcardno,
        idcarddate: owner.idcarddate,
        governmentplace: owner.governmentplace ? `${owner.governmentplace}` : null,
        familybookno: owner.familybookno,
        fathername: owner.fathername,
        mothername: owner.mothername,
        spousename: owner.spousename,
        spousebirthdate: owner.spousebirthdate,
        spousefathername: owner.spousefathername,
        spousemothername: owner.spousemothername,
        spousenationality: owner.spousenationality,
        spouseoccupation: owner.spouseoccupation,
        province: owner.province,
        district: owner.district,
        village: owner.village,
        unit: owner.unit,
        street: owner.street,
        houseno: owner.houseno,
      };
      
      // Submit the data to the API
      const response = await savePerson(personData).unwrap();
      
      // Show success notification
      showToast.success("ບັນທຶກຂໍ້ມູນນິຕິບຸກຄົນສຳເລັດ");
      
      // Optional: Reset form or redirect
      // setOwner(initialOwner); // Reset form
      
    } catch (error: any) {
      console.error('Failed to save person:', error);
      showToast.error(error.data?.message || "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຟອມຂໍ້ມູນບຸກຄົນ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="prefix" className="block mb-2 font-semibold text-black dark:text-white">
              ຄຳນຳຫນ້ານາມ:
            </label>
            <select
              id="prefix"
              name="title"
              value={owner.title}
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່
            </label>
            <input
              type="text"
              name="firstname"
              value={owner.firstname}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ນາມສະກຸນ
            </label>
            <input
              type="text"
              name="lastname"
              value={owner.lastname}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ວັນເດືອນປີເກີດ
            </label>
            <input
              type="date"
              name="birthdate"
              value={owner.birthdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ສັນຊາດ
            </label>
            <input
              type="text"
              name="nationality"
              value={owner.nationality}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ອາຊີບ
            </label>
            <input
              type="text"
              name="occupation"
              value={owner.occupation}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີບັດປະຈຳຕົວ
            </label>
            <input
              type="text"
              name="idcardno"
              value={owner.idcardno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ວັນທິບັດປະຈຳຕົວ
            </label>
            <input
              type="date"
              name="idcarddate"
              value={owner.idcarddate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ສະຖານທີ່ເຮັດວຽກຂອງລັດ
            </label>
            <select
              name="governmentplace"
              value={owner.governmentplace}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={loadingMinistries}
            >
              <option value="">ເລືອກສະຖານທີ່ເຮັດວຽກ</option>
              {loadingMinistries ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id.toString()}>
                    {ministry.name}
                  </option>
                ))
              )}
              <option value="ອື່ນໆ">ອື່ນໆ</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ປຶ້ມສຳມະໂນຄົວເລກທີ
            </label>
            <input
              type="text"
              name="familybookno"
              value={owner.familybookno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ພໍ່
            </label>
            <input
              type="text"
              name="fathername"
              value={owner.fathername}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ແມ່
            </label>
            <input
              type="text"
              name="mothername"
              value={owner.mothername}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-black dark:text-white">ຂໍ້ມູນຜົວຫລືເມຍ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ຜົວຫລືເມຍ
            </label>
            <input
              type="text"
              name="spousename"
              value={owner.spousename}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ວັນເດືອນປີເກີດຜົວຫລືເມຍ
            </label>
            <input
              type="date"
              name="spousebirthdate"
              value={owner.spousebirthdate}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ພໍ່ຜົວຫລືເມຍ
            </label>
            <input
              type="text"
              name="spousefathername"
              value={owner.spousefathername}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ແມ່ຜົວຫລືເມຍ
            </label>
            <input
              type="text"
              name="spousemothername"
              value={owner.spousemothername}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ສັນຊາດຜົວຫລືເມຍ
            </label>
            <input
              type="text"
              name="spousenationality"
              value={owner.spousenationality}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ອາຊີບຜົວຫລືເມຍ
            </label>
            <input
              type="text"
              name="spouseoccupation"
              value={owner.spouseoccupation}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-black dark:text-white">ທີ່ຢູ່</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ແຂວງ
            </label>
            <select
              name="province"
              value={owner.province}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isLoadingProvinces}
            >
              <option value="">ເລືອກແຂວງ</option>
              {isLoadingProvinces ? (
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ເມືອງ
            </label>
            <select
              name="district"
              value={owner.district}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isLoadingDistricts || !owner.province}
            >
              <option value="">ເລືອກເມືອງ</option>
              {isLoadingDistricts ? (
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ບ້ານ
            </label>
            <select
              name="village"
              value={owner.village}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={isLoadingVillages || !owner.district}
            >
              <option value="">ເລືອກບ້ານ</option>
              {isLoadingVillages ? (
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ໜ່ວຍ
            </label>
            <input
              type="text"
              name="unit"
              value={owner.unit}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຖະຫນົນ
            </label>
            <input
              type="text"
              name="street"
              value={owner.street}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ເຮືອນເລກທີ
            </label>
            <input
              type="text"
              name="houseno"
              value={owner.houseno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors"
          >
            {isSubmitting || isLoading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </button>
        </div>
      </form>
    </div>
  );
} 