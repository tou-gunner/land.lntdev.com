"use client";

import { useState, useEffect } from "react";
import { 
  useGetMinistriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useGetTitlesQuery
} from "../redux/api/apiSlice";

interface TransformedItem {
  id: number | string;
  name: string;
  englishName?: string;
}

interface PersonFormData {
  title: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  nationality: string;
  occupation: string;
  idcardno: string;
  idcarddate: string;
  governmentplace: string;
  familybookno: string;
  fathername: string;
  mothername: string;
  spousename: string;
  spousebirthdate: string;
  spousefathername: string;
  spousemothername: string;
  spousenationality: string;
  spouseoccupation: string;
  province: string;
  district: string;
  village: string;
  unit: string;
  street: string;
  houseno: string;
}

interface PersonFormProps {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  onCancel?: () => void;
  title?: string;
  formData?: any;
  onChange?: (data: any) => void;
}

export default function PersonForm({
  initialData = {},
  onSubmit,
  onCancel,
  title = "ແບບຟອມຂໍ້ມູນບຸກຄົນ",
  formData: propFormData,
  onChange
}: PersonFormProps) {
  const [formData, setFormData] = useState<PersonFormData>({
    title: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    nationality: "",
    occupation: "",
    idcardno: "",
    idcarddate: "",
    governmentplace: "",
    familybookno: "",
    fathername: "",
    mothername: "",
    spousename: "",
    spousebirthdate: "",
    spousefathername: "",
    spousemothername: "",
    spousenationality: "",
    spouseoccupation: "",
    province: "",
    district: "",
    village: "",
    unit: "",
    street: "",
    houseno: "",
    ...initialData,
    ...(propFormData || {}) // Initialize with propFormData if provided
  });

  // Update local state when prop changes
  useEffect(() => {
    if (propFormData) {
      setFormData(prev => ({
        ...prev,
        ...propFormData
      }));
    }
  }, [propFormData]);

  // Use RTK Query hooks for data fetching
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    
    setFormData(newFormData as PersonFormData);
    
    // Delay the onChange callback to the next tick to avoid simultaneous renders
    if (onChange) {
      setTimeout(() => {
        onChange(newFormData);
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="prefix" className="block mb-2 font-semibold text-black dark:text-white">
              ຄຳນຳຫນ້ານາມ:
            </label>
            <select
              id="prefix"
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
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
              value={formData.lastname}
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
              value={formData.birthdate}
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
              value={formData.nationality}
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
              value={formData.occupation}
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
              value={formData.idcardno}
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
              value={formData.idcarddate}
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
              value={formData.governmentplace}
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
              value={formData.familybookno}
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
              value={formData.fathername}
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
              value={formData.mothername}
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
              value={formData.spousename}
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
              value={formData.spousebirthdate}
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
              value={formData.spousefathername}
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
              value={formData.spousemothername}
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
              value={formData.spousenationality}
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
              value={formData.spouseoccupation}
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ເມືອງ
            </label>
            <select
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
          
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ບ້ານ
            </label>
            <select
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block mb-2 font-semibold text-black dark:text-white">
              ໜ່ວຍ
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
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
              value={formData.street}
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
              value={formData.houseno}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors"
            >
              ຍົກເລີກ
            </button>
          )}
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