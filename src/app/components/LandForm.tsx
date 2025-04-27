"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { emptyFormData, useFormContext } from "../contexts/FormContext";
import { 
  useGetLandUseZonesQuery, 
  useGetLandUseTypesQuery, 
  useGetRoadTypesQuery, 
  useGetDisputeTypesQuery,
  useSaveParcelMutation,
  useGetProvincesQuery,
  useGetEntityTypesQuery,
  useGetBusinessTypesQuery,
  useGetMinistriesQuery,
  useGetTitlesQuery,
  useGetRightTypesQuery,
  useGetLandTitleHistoryQuery,
  useGetUrbanizationQuery
} from "../redux/api/apiSlice";
import { useToast } from "../hooks/useToast";
import { fetchDistricts, fetchVillages } from "../redux/utils/queryUtils";
import { searchLandParcel } from "../lib/api";

const LandForm = forwardRef<{ formData?: any }, {}>((props, ref) => {
  const { formData, updateFormData, processParcelData } = useFormContext();
  const { showToast } = useToast();

  const [searchData, setSearchData] = useState({
    cadastremapno: "",
    parcelno: ""
  });

  const [isSearching, setIsSearching] = useState(false);
  
  // Add loading state for reference data
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);


  // Location data
  const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  
  // Use RTK Query hooks for data fetching
  const { data: landZones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  const { data: landUseTypes = [], isLoading: typesLoading } = useGetLandUseTypesQuery();
  const { data: roadTypes = [], isLoading: roadTypesLoading } = useGetRoadTypesQuery();
  const { data: rightTypes = [], isLoading: rightTypesLoading } = useGetRightTypesQuery();
  const { data: historyTypes = [], isLoading: historyTypesLoading } = useGetLandTitleHistoryQuery();
  const { data: disputeTypes = [], isLoading: disputeTypesLoading } = useGetDisputeTypesQuery();
  const { data: urbanization = [], isLoading: urbanizationLoading } = useGetUrbanizationQuery();
  
  // Add additional queries from FormContext
  const { data: entityTypes = [], isLoading: entityTypesLoading } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: businessTypesLoading } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: ministriesLoading } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: titlesLoading } = useGetTitlesQuery();
  
  // Add save parcel mutation
  const [saveParcel, { isLoading: isSaving }] = useSaveParcelMutation();

  useImperativeHandle(ref, () => ({
    formData
  }));

  // Extract and set location values from villagecode if available
  useEffect(() => {
    if (!formData.provincecode) {
      return;
    }
    new Promise(async (resolve, reject) => {
      setDistrictsLoading(true);
      setVillagesLoading(true);
      try { 
        let newDistricts: any[] = [];
        let newVillages: any[] = [];
        newDistricts = await fetchDistricts(formData.provincecode);
        if (formData.districtcode) {
          newVillages = await fetchVillages(formData.districtcode);
        }
        resolve({ newDistricts, newVillages });
      } catch (error) {
        reject(error);
      }
    }).then(({ newDistricts, newVillages }: any) => {
      setDistricts(newDistricts);
      setVillages(newVillages);
      setDistrictsLoading(false);
      setVillagesLoading(false);
    });
  }, [formData.villagecode, formData.provincecode, formData.districtcode, updateFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Create a new form data object by copying the current context data
    const updatedFormData = { ...formData };
    
    // Handle cascading selection for location fields
    if (name === "provincecode") {
      updatedFormData[name] = value;
      updatedFormData["districtcode"] = "";
      updatedFormData["villagecode"] = "";
    } else if (name === "districtcode") {
      updatedFormData[name] = value;
      updatedFormData["villagecode"] = "";
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updatedFormData[name] = checked;
    } else {
      updatedFormData[name] = value;
    }
    
    // Update the context
    updateFormData(updatedFormData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = () => {
    if (!searchData.cadastremapno || !searchData.parcelno) {
      showToast.error("ກະລຸນາປ້ອນເລກທີ່ຕອນດິນ ແລະ ເລກທີ່ແຜນທີ່ຕາດິນ");
      return;
    }
    
    setIsSearching(true);
    showToast.loading("ກຳລັງຄົ້ນຫາຂໍ້ມູນ...", "search-toast");
    new Promise(async (resolve, reject) => {
      try {
        const result = await searchLandParcel(searchData.cadastremapno, searchData.parcelno);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }).then((result: any) => {
      setIsSearching(false);
      if (result.success) {
        processParcelData(result.data[0]);
        showToast.success("ພົບຂໍ້ມູນແລ້ວ!", "search-toast");
      } else {
        updateFormData(emptyFormData);
        showToast.error(result.message || "ບໍ່ພົບຂໍ້ມູນຕອນດິນ", "search-toast");
      }
    }).catch((error: any) => {
      setIsSearching(false);
      showToast.error(error.message || "ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ", "search-toast");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format the data for submission
      const formattedData = {
        "parcelno": formData.parcelno,
        "cadastremapno": formData.cadastremapno,
        "landusetype": formData.landusetype ? `${formData.landusetype}` : null,
        "landusezone": formData.landusezone ? `${formData.landusezone}` : null,
        "unit": formData.unit || null,
        "village": villages.find(village => village.id == formData.village)?.name || null,
        "district": districts.find(district => district.id == formData.district)?.name || null,
        "province": provinces.find(province => province.id == formData.province)?.name || null,
        "purpose": formData.purpose || null,
        "additionalstatements": formData.additionalstatements || null,
        "status": formData.status || null,
        "area": formData.area || null,
        "villagecode": formData.villagecode || null,
        "isstate": formData.isstate === null ? null : `${formData.isstate}`,
        "owner_check": formData.owner_check || null,
        "cadastremapno_old": formData.cadastremapno_old || null,
        "gid": formData.gid,
        "urbanizationlevel": formData.urbanizationlevel ? `${formData.urbanizationlevel}` : null,
        "landvaluezone_number": formData.landvaluezone_number || null,
        "roadtype": formData.roadtype ? `${formData.roadtype}` : null,
        "road": formData.road || null,
        "parcelno_old": formData.parcelno_old || null,
        "barcode": formData.barcode || null,
        "exists_llr": formData.exists_llr,
        "snd_parcel2_llr": formData.snd_parcel2_llr,
        "concat_pages": formData.concat_pages
      };
      
      // Send data to API
      const result = await saveParcel(formattedData).unwrap();
      
      // Handle response
      if (result.success) {
        // Update the context with the latest data including any returned ID/barcode
        if (result.data?.gid) {
          updateFormData({
            ...formData,
            gid: result.data.gid,
            barcode: result.data.barcode
          });
          
          console.log('Land data saved with barcode:', result.data.barcode);
        }
        
        showToast.success("ບັນທຶກຂໍ້ມູນສຳເລັດ");
      } else {
        showToast.error(result.message || "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ");
      }
    } catch (error) {
      console.error("Error saving parcel:", error);
      showToast.error(error instanceof Error ? error.message : "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ");
    }
  };

  // For brevity, we'll just show the form structure and reference the first few fields
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຟອມຂໍ້ມູນຕອນດິນ</h2>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">ຄົ້ນຫາຂໍ້ມູນຕອນດິນ</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="parcelno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີຕອນດິນ:
            </label>
            <input
              type="text"
              id="parcelno"
              name="parcelno"
              value={searchData.parcelno}
              onChange={handleSearchChange}
              placeholder="ປ້ອນເລກຕອນດິນ"
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cadastremapno" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີແຜນທີ່ຕາດິນ:
            </label>
            <input
              type="text"
              id="cadastremapno"
              name="cadastremapno"
              value={searchData.cadastremapno}
              onChange={handleSearchChange}
              placeholder="ປ້ອນເລກແຜນທີ່"
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              type="button" 
              onClick={handleSearch}
              disabled={isSearching || isReferenceDataLoading}
              className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded shadow-sm w-full h-10"
            >
              {isSearching ? "ກຳລັງຄົ້ນຫາ..." : 
               isReferenceDataLoading ? "ກຳລັງໂຫຼດຂໍ້ມູນ..." : "ຄົ້ນຫາ"}
            </button>
          </div>
        </div>
      </div>
      
      {formData.gid && <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="parcelno_old" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີຕອນດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="parcelno_old"
              name="parcelno_old"
              value={formData.parcelno_old}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cadastremapno_old" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີແຜນທີ່ຕາດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="cadastremapno_old"
              name="cadastremapno_old"
              value={formData.cadastremapno_old}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="landusetype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດການນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landusetype"
              name="landusetype"
              value={formData.landusetype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={typesLoading}
            >
              <option value="">ເລືອກປະເພດ</option>
              {typesLoading ? (
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
          
          <div className="form-group">
            <label htmlFor="landusezone" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດທີ່ດິນ:
            </label>
            <select
              id="landusezone"
              name="landusezone"
              value={formData.landusezone}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={zonesLoading}
            >
              <option value="">ເລືອກເຂດ</option>
              {zonesLoading ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                landZones.map((zone) => (
                  <option key={zone.id} value={zone.id.toString()}>
                    {zone.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="urbanizationlevel" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດຕາມຜັງເມືອງ:
            </label>
            <select
              id="urbanizationlevel"
              name="urbanizationlevel"
              value={formData.urbanizationlevel}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={urbanizationLoading}
            >
              <option value="">ເລືອກເຂດ</option>
              {urbanizationLoading ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                urbanization.map((level) => (
                  <option key={level.id} value={level.id.toString()}>
                    {level.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="landvaluezone_number" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດປະເມີນລາຄາ:
            </label>
            <input
              type="number"
              id="landvaluezone_number"
              name="landvaluezone_number"
              value={formData.landvaluezone_number}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="roadtype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຖະໜົນ:
            </label>
            <select
              id="roadtype"
              name="roadtype"
              value={formData.roadtype}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={roadTypesLoading}
            >
              <option value="">ເລືອກປະເພດ</option>
              {roadTypesLoading ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                roadTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isstate"
                name="isstate"
                checked={formData.isstate || false}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 dark:bg-gray-700"
              />
              <label htmlFor="isstate" className="ml-2 font-semibold text-black dark:text-white">
                ດິນລັດ
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="purpose" className="block mb-2 font-semibold text-black dark:text-white">
              ເປົ້າໝາຍ:
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຂໍ້ຂົດແຍ່ງ:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              disabled={disputeTypesLoading}
            >
              <option value="">ເລືອກປະເພດ</option>
              {disputeTypesLoading ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
              ) : (
                disputeTypes.map((type) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="area" className="block mb-2 font-semibold text-black dark:text-white">
              ເນື້ອທີ່:
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="owner_check" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ເຈົ້າຂອງຕອນດິນ:
            </label>
            <input
              type="text"
              id="owner_check"
              name="owner_check"
              value={formData.owner_check}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="additionalstatements" className="block mb-2 font-semibold text-black dark:text-white">
            ຄຳຊີ້ແຈງເພີ່ມເຕີມ:
          </label>
          <textarea
            id="additionalstatements"
            name="additionalstatements"
            value={formData.additionalstatements}
            onChange={handleChange}
            rows={4}
            className="form-textarea w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">ທີ່ຢູ່:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label htmlFor="provincecode" className="block mb-2 font-semibold text-black dark:text-white">
                ແຂວງ:
              </label>
              <select
                id="provincecode"
                name="provincecode"
                value={formData.provincecode}
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
            
            <div className="form-group">
              <label htmlFor="districtcode" className="block mb-2 font-semibold text-black dark:text-white">
                ເມືອງ:
              </label>
              <select
                id="districtcode"
                name="districtcode"
                value={formData.districtcode}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={districtsLoading || !formData.provincecode}
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
            
            <div className="form-group">
              <label htmlFor="villagecode" className="block mb-2 font-semibold text-black dark:text-white">
                ບ້ານ:
              </label>
              <select
                id="villagecode"
                name="villagecode"
                value={formData.villagecode}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={villagesLoading || !formData.districtcode}
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
            
            <div className="form-group">
              <label htmlFor="unit" className="block mb-2 font-semibold text-black dark:text-white">
                ໜ່ວຍ:
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
            
            <div className="form-group">
              <label htmlFor="road" className="block mb-2 font-semibold text-black dark:text-white">
                ຖະໜົນ:
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
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded shadow-sm transition-colors"
            disabled={isSaving}
          >
            {isSaving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </button>
        </div>
      </form>}
    </div>
  );
});

// Add display name for better debugging
LandForm.displayName = "LandForm";

export default LandForm; 