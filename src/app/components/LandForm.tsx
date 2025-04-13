"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import { 
  useGetLandUseZonesQuery, 
  useGetLandUseTypesQuery, 
  useGetRoadTypesQuery, 
  useGetDisputeTypesQuery,
  useSearchLandParcelQuery
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
  
  // Use RTK Query hooks for data fetching
  const { data: landZones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  const { data: landUseTypes = [], isLoading: typesLoading } = useGetLandUseTypesQuery();
  const { data: roadTypes = [], isLoading: roadTypesLoading } = useGetRoadTypesQuery();
  const { data: disputeTypes = [], isLoading: disputeTypesLoading } = useGetDisputeTypesQuery();
  
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
      
      // Create a new formData object
      const newFormData = {
        ...contextFormData.land,
        landParcelNumber: parcelData.parcelno || "",
        landMapNumber: parcelData.cadastremapno || "",
        oldLandParcelNumber: parcelData.parcelno_old || "",
        oldLandMapNumber: parcelData.cadastremapno_old || "",
        landUseType: parcelData.landusetype?.toString() || "",
        landZone: parcelData.landusezone?.toString() || "",
        roadType: parcelData.roadtype?.toString() || "",
        isGovernmentLand: parcelData.isstate || false,
        area: parcelData.area?.toString() || "",
        additionalNotes: parcelData.additionalstatements || ""
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
    
    if (type === "checkbox") {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(contextFormData.land);
    // Submit the form data to your API
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
            <label htmlFor="oldLandParcelNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີຕອນດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="oldLandParcelNumber"
              name="oldLandParcelNumber"
              value={contextFormData.land.oldLandParcelNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Old Land Map Number */}
          <div className="form-group">
            <label htmlFor="oldLandMapNumber" className="block mb-2 font-semibold text-black dark:text-white">
              ເລກທີແຜນທີ່ຕາດິນເກົ່າ:
            </label>
            <input
              type="text"
              id="oldLandMapNumber"
              name="oldLandMapNumber"
              value={contextFormData.land.oldLandMapNumber}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Land Use Type */}
          <div className="form-group">
            <label htmlFor="landUseType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດການນຳໃຊ້ທີ່ດິນ:
            </label>
            <select
              id="landUseType"
              name="landUseType"
              value={contextFormData.land.landUseType}
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
            <label htmlFor="landZone" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດທີ່ດິນ:
            </label>
            <select
              id="landZone"
              name="landZone"
              value={contextFormData.land.landZone}
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
            <label htmlFor="cityPlanningZone" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດຕາມຜັງເມືອງ:
            </label>
            <select
              id="cityPlanningZone"
              name="cityPlanningZone"
              value={contextFormData.land.cityPlanningZone}
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
            <label htmlFor="valuationZone" className="block mb-2 font-semibold text-black dark:text-white">
              ເຂດປະເມີນລາຄາ:
            </label>
            <input
              type="text"
              id="valuationZone"
              name="valuationZone"
              value={contextFormData.land.valuationZone}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Road Type */}
          <div className="form-group">
            <label htmlFor="roadType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຖະໜົນ:
            </label>
            <select
              id="roadType"
              name="roadType"
              value={contextFormData.land.roadType}
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
                id="isGovernmentLand"
                name="isGovernmentLand"
                checked={contextFormData.land.isGovernmentLand}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 dark:bg-gray-700"
              />
              <label htmlFor="isGovernmentLand" className="ml-2 font-semibold text-black dark:text-white">
                ດິນລັດ
              </label>
            </div>
          </div>
          
          {/* Owner */}
          <div className="form-group">
            <label htmlFor="owner" className="block mb-2 font-semibold text-black dark:text-white">
              ເປົ້ານາຍ:
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={contextFormData.land.owner}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Dispute Type */}
          <div className="form-group">
            <label htmlFor="disputeType" className="block mb-2 font-semibold text-black dark:text-white">
              ປະເພດຂໍ້ຂົດແຍ່ງ:
            </label>
            <select
              id="disputeType"
              name="disputeType"
              value={contextFormData.land.disputeType}
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
              value={contextFormData.land.area}
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
              value={contextFormData.land.landOwnerName}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Additional Notes */}
        <div className="form-group">
          <label htmlFor="additionalNotes" className="block mb-2 font-semibold text-black dark:text-white">
            ຄຳຊີ້ແຈງເພີ່ມເຕີມ:
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={contextFormData.land.additionalNotes}
            onChange={handleChange}
            rows={4}
            className="form-textarea w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          ></textarea>
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
});

// Add display name for better debugging
LandForm.displayName = "LandForm";

export default LandForm; 