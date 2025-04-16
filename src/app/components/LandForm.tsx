"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import { 
  useGetLandUseZonesQuery, 
  useGetLandUseTypesQuery, 
  useGetRoadTypesQuery, 
  useGetDisputeTypesQuery,
  useSearchLandParcelQuery,
  useSaveParcelMutation,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery
} from "../redux/api/apiSlice";

interface ZoneItem {
  id: string | number;
  name: string;
  englishName?: string;
}

const LandForm = forwardRef<{ formData?: any }, {}>((props, ref) => {
  const { formData: contextFormData, updateLandForm } = useFormContext();
  
  // Instead of duplicating state, let's reference context data directly
  // and only manage local state for search functionality
  
  // Expose formData via ref
  useImperativeHandle(ref, () => ({
    formData: contextFormData.land
  }));

  const [searchData, setSearchData] = useState({
    cadastremapno: "",
    parcelno: ""
  });

  const [searchTrigger, setSearchTrigger] = useState(false);
  
  // Add state for save status
  const [saveStatus, setSaveStatus] = useState<{success?: boolean; message?: string} | null>(null);
  
  // Use RTK Query hooks for data fetching
  const { data: landZones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  const { data: landUseTypes = [], isLoading: typesLoading } = useGetLandUseTypesQuery();
  const { data: roadTypes = [], isLoading: roadTypesLoading } = useGetRoadTypesQuery();
  const { data: disputeTypes = [], isLoading: disputeTypesLoading } = useGetDisputeTypesQuery();
  
  // Add save parcel mutation
  const [saveParcel, { isLoading: isSaving }] = useSaveParcelMutation();
  
  // Location data
  const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();
  const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(contextFormData.land.province, {
    skip: !contextFormData.land.province
  });
  const { data: villages = [], isLoading: villagesLoading } = useGetVillagesQuery(contextFormData.land.district, {
    skip: !contextFormData.land.district
  });
  
  // Only run the search query when triggered
  const { 
    data: searchResult,
    isFetching: searching,
    error: searchError
  } = useSearchLandParcelQuery(
    { cadastreMapNo: searchData.cadastremapno, parcelNo: searchData.parcelno },
    { skip: !searchTrigger }
  );

  // Update form data when search results arrive
  const hasSearchResults = searchResult?.success && Array.isArray(searchResult.data) && searchResult.data.length > 0;
  
  // Move the search results update to useEffect instead of doing it directly in the render phase
  useEffect(() => {
    // Update form with search results when available
    if (hasSearchResults && searchTrigger) {
      const parcelData = searchResult.data[0];
      
      // Create a new formData object with field names matching API parameters
      const newFormData = {
        ...contextFormData.land,
        parcelno: parcelData.parcelno || "",
        cadastremapno: parcelData.cadastremapno || "",
        parcelno_old: parcelData.parcelno_old || "",
        cadastremapno_old: parcelData.cadastremapno_old || "",
        landusetype: parcelData.landusetype?.toString() || "",
        landusezone: parcelData.landusezone?.toString() || "",
        urbanizationlevel: parcelData.urbanizationlevel || "",
        landvaluezone_number: parcelData.landvaluezone_number || "",
        roadtype: parcelData.roadtype?.toString() || "",
        isstate: parcelData.isstate || false,
        purpose: parcelData.purpose || "",
        status: parcelData.status || "",
        area: parcelData.area?.toString() || "",
        additionalstatements: parcelData.additionalstatements || "",
        // Address fields
        province: parcelData.province || "",
        district: parcelData.district || "",
        village: parcelData.villagecode || "",
        unit: parcelData.unit || "",
        road: parcelData.road || ""
      };
      
      // Update the context directly
      updateLandForm(newFormData);
      
      // Reset search trigger
      setTimeout(() => {
        setSearchTrigger(false);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSearchResults, searchTrigger, searchResult?.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Create a new form data object by copying the current context data
    const updatedFormData = { ...contextFormData.land };
    
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
    updateLandForm(updatedFormData);
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
      return;
    }
    
    // Trigger the search query
    setSearchTrigger(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset save status
    setSaveStatus(null);
    
    try {
      // Create API compatible data object - now field names already match
      const apiData = {
        // Required fields
        parcelno: contextFormData.land.parcelno,
        cadastremapno: contextFormData.land.cadastremapno,
        isstate: contextFormData.land.isstate,
        
        // Optional fields - Field names already match API parameters
        parcelno_old: contextFormData.land.parcelno_old || null,
        cadastremapno_old: contextFormData.land.cadastremapno_old || null,
        landusetype: contextFormData.land.landusetype ? parseInt(contextFormData.land.landusetype) : null,
        landusezone: contextFormData.land.landusezone || null,
        urbanizationlevel: contextFormData.land.urbanizationlevel || null,
        landvaluezone_number: contextFormData.land.landvaluezone_number ? parseInt(contextFormData.land.landvaluezone_number) : null,
        roadtype: contextFormData.land.roadtype ? parseInt(contextFormData.land.roadtype) : null,
        purpose: contextFormData.land.purpose || null,
        status: contextFormData.land.status ? parseInt(contextFormData.land.status) : null,
        area: contextFormData.land.area ? parseFloat(contextFormData.land.area) : null,
        additionalstatements: contextFormData.land.additionalstatements || null,
        
        // Address fields
        province: contextFormData.land.province || null,
        district: contextFormData.land.district || null,
        village: contextFormData.land.village || null,
        unit: contextFormData.land.unit || null,
        road: contextFormData.land.road || null
      };
      
      // Send data to API
      const result = await saveParcel(apiData).unwrap();
      
      // Handle response
      if (result.success) {
        setSaveStatus({ success: true, message: "ບັນທຶກຂໍ້ມູນສຳເລັດ" });
      } else {
        setSaveStatus({ success: false, message: result.message || "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ" });
      }
    } catch (error) {
      console.error("Error saving parcel:", error);
      setSaveStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ" 
      });
    }
  };

  // Fallback options for dropdowns in case API fails
  const cityPlanningZones = ["ເຂດພັດທະນາ", "ເຂດອະນຸລັກ", "ເຂດສີຂຽວ"];

  // For brevity, we'll just show the form structure and reference the first few fields
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">ຟອມຂໍ້ມູນຕອນດິນ</h2>
      
      {/* Search Section */}
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
              disabled={searching}
              className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded shadow-sm w-full h-10"
            >
              {searching ? "ກຳລັງຄົ້ນຫາ..." : "ຄົ້ນຫາ"}
            </button>
          </div>
        </div>
        
        {searchError && (
          <div className="mt-2 text-red-500">{searchError.toString()}</div>
        )}
        
        {searchResult && searchResult.success && (
          <div className="mt-2 text-green-500">ພົບຂໍ້ມູນແລ້ວ!</div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Land Parcel Number */}
          <div className="form-group">
            <label htmlFor="parcelno_old" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີຕອນດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="parcelno_old"
              name="parcelno_old"
              value={contextFormData.land.parcelno_old || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Old Land Map Number */}
          <div className="form-group">
            <label htmlFor="cadastremapno_old" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີແຜນທີ່ຕາດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="cadastremapno_old"
              name="cadastremapno_old"
              value={contextFormData.land.cadastremapno_old || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Use Type */}
          <div className="form-group">
            <label htmlFor="landusetype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດການນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landusetype"
              name="landusetype"
              value={contextFormData.land.landusetype}
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
          
          {/* Land Zone */}
          <div className="form-group">
            <label htmlFor="landusezone" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດທີ່ດິນ:
            </label>
            <select
              id="landusezone"
              name="landusezone"
              value={contextFormData.land.landusezone}
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
          
          {/* City Planning Zone */}
          <div className="form-group">
            <label htmlFor="urbanizationlevel" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດຕາມຜັງເມືອງ:
            </label>
            <select
              id="urbanizationlevel"
              name="urbanizationlevel"
              value={contextFormData.land.urbanizationlevel}
              onChange={handleChange}
              className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="">ເລືອກເຂດ</option>
              {cityPlanningZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          
          {/* Valuation Zone */}
          <div className="form-group">
            <label htmlFor="landvaluezone_number" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດປະເມີນລາຄາ:
            </label>
            <input
              type="text"
              id="landvaluezone_number"
              name="landvaluezone_number"
              value={contextFormData.land.landvaluezone_number || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Road Type */}
          <div className="form-group">
            <label htmlFor="roadtype" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຖະໜົນ:
            </label>
            <select
              id="roadtype"
              name="roadtype"
              value={contextFormData.land.roadtype}
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
          
          {/* Government Land */}
          <div className="form-group">
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isstate"
                name="isstate"
                checked={contextFormData.land.isstate || false}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 dark:bg-gray-700"
              />
              <label htmlFor="isstate" className="ml-2 font-semibold text-black dark:text-white">
                ດິນລັດ
              </label>
            </div>
          </div>
          
          {/* Purpose */}
          <div className="form-group">
            <label htmlFor="purpose" className="block mb-2 font-semibold text-black dark:text-white">
              ເປົ້າໝາຍ:
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={contextFormData.land.purpose || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Status (Dispute Type) */}
          <div className="form-group">
            <label htmlFor="status" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຂໍ້ຂົດແຍ່ງ:
            </label>
            <select
              id="status"
              name="status"
              value={contextFormData.land.status || ""}
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
          
          {/* Area */}
          <div className="form-group">
            <label htmlFor="area" className="block mb-2 font-semibold text-black dark:text-white">
              ເນື້ອທີ່:
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={contextFormData.land.area || "0"}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Owner Name */}
          <div className="form-group">
            <label htmlFor="landOwnerName" className="block mb-2 font-semibold text-black dark:text-white">
              ຊື່ເຈົ້າຂອງຕອນດິນ:
            </label>
            <input
              type="text"
              id="landOwnerName"
              name="landOwnerName"
              value={contextFormData.land.landOwnerName || ""}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Additional Notes */}
        <div className="form-group">
          <label htmlFor="additionalstatements" className="block mb-2 font-semibold text-black dark:text-white">
            ຄຳຊີ້ແຈງເພີ່ມເຕີມ:
          </label>
          <textarea
            id="additionalstatements"
            name="additionalstatements"
            value={contextFormData.land.additionalstatements || ""}
            onChange={handleChange}
            rows={4}
            className="form-textarea w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          ></textarea>
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
                value={contextFormData.land.province || ""}
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
                value={contextFormData.land.district || ""}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={districtsLoading || !contextFormData.land.province}
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
                value={contextFormData.land.village || ""}
                onChange={handleChange}
                className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                disabled={villagesLoading || !contextFormData.land.district}
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
                ໜ່ວຍ:
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={contextFormData.land.unit || ""}
                onChange={handleChange}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Road */}
            <div className="form-group">
              <label htmlFor="road" className="block mb-2 font-semibold text-black dark:text-white">
                ຖະໜົນ:
              </label>
              <input
                type="text"
                id="road"
                name="road"
                value={contextFormData.land.road || ""}
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
        
        {saveStatus && (
          <div className={`mt-4 p-3 rounded-md ${saveStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveStatus.message}
          </div>
        )}
      </form>
    </div>
  );
});

// Add display name for better debugging
LandForm.displayName = "LandForm";

export default LandForm; 