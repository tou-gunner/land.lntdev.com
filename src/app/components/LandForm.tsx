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
  useGetVillagesQuery,
  useGetParcelInfoQuery,
  useGetEntityTypesQuery,
  useGetBusinessTypesQuery,
  useGetMinistriesQuery,
  useGetTitlesQuery,
  useGetRightTypesQuery,
  useGetLandTitleHistoryQuery
} from "../redux/api/apiSlice";
import { toast } from "react-hot-toast";
import { useToast } from "../hooks/useToast";

interface ZoneItem {
  id: string | number;
  name: string;
  englishName?: string;
}

const LandForm = forwardRef<{ formData?: any }, {}>((props, ref) => {
  const { formData, updateFormData } = useFormContext();
  const { showToast } = useToast();

  const [searchData, setSearchData] = useState({
    cadastremapno: "",
    parcelno: ""
  });

  const [searchTrigger, setSearchTrigger] = useState(false);
  
  // Add loading state for reference data
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(false);
  
  // Use RTK Query hooks for data fetching
  const { data: landZones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  const { data: landUseTypes = [], isLoading: typesLoading } = useGetLandUseTypesQuery();
  const { data: roadTypes = [], isLoading: roadTypesLoading } = useGetRoadTypesQuery();
  const { data: rightTypes = [], isLoading: rightTypesLoading } = useGetRightTypesQuery();
  const { data: historyTypes = [], isLoading: historyTypesLoading } = useGetLandTitleHistoryQuery();
  const { data: disputeTypes = [], isLoading: disputeTypesLoading } = useGetDisputeTypesQuery();
  
  // Add additional queries from FormContext
  const { data: entityTypes = [], isLoading: entityTypesLoading } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: businessTypesLoading } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: ministriesLoading } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: titlesLoading } = useGetTitlesQuery();
  
  // Add save parcel mutation
  const [saveParcel, { isLoading: isSaving }] = useSaveParcelMutation();
  
  // Location data
  const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();
  const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(formData.provincecode, {
    skip: !formData.provincecode
  });
  const { data: villages = [], isLoading: villagesLoading } = useGetVillagesQuery(formData.districtcode, {
    skip: !formData.districtcode
  });
  
  // Only run the search query when triggered
  const { 
    data: parcelInfoResult,
    isFetching: fetchingParcelInfo,
    error: parcelInfoError
  } = useGetParcelInfoQuery(
    { parcelno: searchData.parcelno, mapno: searchData.cadastremapno },
    { skip: !searchTrigger }
  );

  // Update form data when parcel info results arrive
  const hasParcelInfo = parcelInfoResult?.success && Array.isArray(parcelInfoResult.data) && parcelInfoResult.data.length > 0;
  
  // Process parcel data with direct access to all required data
  const processParcelData = (parcelData: any) => {
    // Create sanitized data with null values converted to appropriate defaults
    let sanitizedData: any = {};
    
    // Process each field in the new data
    Object.entries(parcelData).forEach(([key, value]) => {
      if (value === null) {
        // Handle null values based on field type
        if (typeof value === 'number') {
          sanitizedData[key] = 0;
        } else if (typeof value === 'boolean') {
          sanitizedData[key] = false;
        } else {
          sanitizedData[key] = '';
        }
      } else {
        if (key === 'landusezone') {
          sanitizedData[key] = landZones.find(zone => zone.id === value)?.name || "";
        } else {
          sanitizedData[key] = value;
        }
      }

      // Process land rights
      if (key === 'landrights') {
        let sanitizedLandRights: Array<any> = [];
        
        if (Array.isArray(value)) {
          for (const [index, landRight] of (value as Array<any>).entries()) {
            const sanitizedLandRightData: any = {};
            
            // Process each field in the land right
            Object.entries(landRight).forEach(([landRightKey, landRightValue]) => {
              if (landRightValue === null) {
                // Handle null values based on field type
                if (typeof landRightValue === 'number') {
                  sanitizedLandRightData[landRightKey] = 0;
                } else if (typeof landRightValue === 'boolean') {
                  sanitizedLandRightData[landRightKey] = false;
                } else {
                  sanitizedLandRightData[landRightKey] = '';
                }
              } else if (landRightKey === 'righttype' ) {
                sanitizedLandRightData[landRightKey] = rightTypes.find(type => type.name === landRightValue)?.id || "";
              } else if (landRightKey === 'landrightcategory') {
                sanitizedLandRightData[landRightKey] = landUseTypes.find(type => type.name === landRightValue)?.id || "";
              } else if (landRightKey === 'history') {
                sanitizedLandRightData[landRightKey] = historyTypes.find(type => type.name === landRightValue)?.id || "";
              } else if (landRightKey === 'date_title_issued') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'date_title_send_to_ponre') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'date_conclusion') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'date_title_printed') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'date_public_display') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'valid_from') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else if (landRightKey === 'valid_till') {
                sanitizedLandRightData[landRightKey] = new Date(landRightValue as string).toISOString().split('T')[0];
              } else {
                sanitizedLandRightData[landRightKey] = landRightValue;
              }

              // Process owner data if present
              if (landRightKey === 'owner' && landRightValue) {
                let sanitizedOwnerData: any = {};
                
                // Process each field in the owner data
                Object.entries(landRightValue).forEach(([ownerKey, ownerValue]) => {
                  if (ownerValue === null) {
                    // Handle null values based on field type
                    if (typeof ownerValue === 'number') {
                      sanitizedOwnerData[ownerKey] = 0;
                    } else if (typeof ownerValue === 'boolean') {
                      sanitizedOwnerData[ownerKey] = false;
                    } else {
                      sanitizedOwnerData[ownerKey] = '';
                    }
                  } else {
                    if (ownerKey === 'entitytype') {
                      sanitizedOwnerData[ownerKey] = entityTypes.find(type => type.name === ownerValue)?.id || "";
                    } else if (ownerKey === 'title') {
                      sanitizedOwnerData[ownerKey] = titles.find(title => title.name === ownerValue)?.id || "";
                    } else if (ownerKey === 'registrationdate') {
                      sanitizedOwnerData[ownerKey] = new Date(ownerValue as string).toISOString().split('T')[0];
                    } else if (ownerKey === 'businesstype') {
                      sanitizedOwnerData[ownerKey] = businessTypes.find(type => type.name === ownerValue)?.id || "";
                    } else if (ownerKey === 'government_workplace') {
                      sanitizedOwnerData[ownerKey] = ministries.find(ministry => ministry.name === ownerValue)?.id || "";
                    } else {
                      sanitizedOwnerData[ownerKey] = ownerValue;
                    }
                  }
                });
                
                // Update the land right with the processed owner data
                sanitizedLandRightData[landRightKey] = {...landRightValue, ...sanitizedOwnerData};
              }
            });
            
            // Add the processed land right to the array
            sanitizedLandRights[index] = {...landRight, ...sanitizedLandRightData};
          }
        }
        
        // Update the sanitized data with the processed land rights
        sanitizedData = {...sanitizedData, landrights: sanitizedLandRights};
      }
    });
    
    if (parcelData.villagecode && parcelData.villagecode.length === 7) {
      const villagecode = parcelData.villagecode;
      const provincecode = parcelData.villagecode.substring(0, 2);
      const districtcode = parcelData.villagecode.substring(0, 4);
      sanitizedData = {...sanitizedData, provincecode, districtcode, villagecode};
    }
    console.log(sanitizedData);

    // Update the form data with the processed data
    updateFormData({...sanitizedData});
    
    return true;
  };

  // Update useEffect to handle data loading before processing
  useEffect(() => {
    // Update form with parcel info results when available
    if (hasParcelInfo && searchTrigger) {
      const parcelData = parcelInfoResult.data[0];

      // Check if all required reference data is loaded
      const isLoading = zonesLoading || entityTypesLoading || businessTypesLoading || 
          ministriesLoading || titlesLoading;
      
      setIsReferenceDataLoading(isLoading);

      if (!isLoading) {
        // Process the data directly
        processParcelData(parcelData);
        console.log('Loaded land data with barcode:', parcelData.barcode);
      } else {
        // Data is still loading, set a timeout to retry
        console.log('Waiting for reference data to load...');
        
        // Set a retry mechanism with setTimeout
        const timer = setTimeout(() => {
          // This will re-trigger the effect when the timeout completes
          // as long as the search is still active
          if (searchTrigger) {
            console.log('Retrying data load...');
            // Re-render to check if data is ready now
            setIsReferenceDataLoading(zonesLoading || entityTypesLoading || 
                businessTypesLoading || ministriesLoading || titlesLoading);
          }
        }, 1000);
        
        // Clear the timeout if the component unmounts or the effect re-runs
        return () => clearTimeout(timer);
      }
      
      // Reset search trigger if done loading
      if (!isLoading) {
        setTimeout(() => {
          setSearchTrigger(false);
        }, 0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasParcelInfo, 
    searchTrigger, 
    parcelInfoResult?.data,
    zonesLoading,
    entityTypesLoading,
    businessTypesLoading,
    ministriesLoading,
    titlesLoading,
    isReferenceDataLoading
  ]);

  useImperativeHandle(ref, () => ({
    formData
  }));

  // Extract and set location values from villagecode if available
  useEffect(() => {
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
    
    // Trigger the search query
    setSearchTrigger(true);
    showToast.loading("ກຳລັງຄົ້ນຫາຂໍ້ມູນ...", "search-toast");
  };

  // Add useEffect to show toast for search results
  useEffect(() => {
    if (searchTrigger && !fetchingParcelInfo) {
      if (parcelInfoError) {
        showToast.error(parcelInfoError.toString(), "search-toast");
      } else if (isReferenceDataLoading) {
        showToast.loading("ກຳລັງໂຫຼດຂໍ້ມູນອ້າງອີງ...", "search-toast");
      } else if (hasParcelInfo) {
        showToast.success("ພົບຂໍ້ມູນແລ້ວ!", "search-toast");
      } else if (parcelInfoResult && !parcelInfoResult.success) {
        showToast.error("ບໍ່ພົບຂໍ້ມູນຕອນດິນ", "search-toast");
      }
    }
  }, [searchTrigger, fetchingParcelInfo, parcelInfoError, isReferenceDataLoading, hasParcelInfo, parcelInfoResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format the data for submission
      const formattedData = {
        "parcelno": formData.parcelno,
        "cadastremapno": formData.cadastremapno,
        "landusetype": formData.landusetype ? parseInt(formData.landusetype) : null,
        "landusezone": landZones.find(zone => zone.id == formData.landusezone)?.name || null,
        "road": roadTypes.find(type => type.id == formData.roadtype)?.name || null,
        "unit": formData.unit || null,
        "village": villages.find(village => village.id == formData.village)?.name || null,
        "district": districts.find(district => district.id == formData.district)?.name || null,
        "province": provinces.find(province => province.id == formData.province)?.name || null,
        "purpose": formData.purpose || null,
        "additionalstatements": formData.additionalstatements || null,
        "status": formData.status || null,
        "area": formData.area || null,
        "villagecode": formData.villagecode || null,
        "isstate": formData.isstate || false,
        "owner_check": formData.owner_check || null,
        "cadastremapno_old": formData.cadastremapno_old || null,
        "gid": formData.gid,
        "urbanizationlevel": formData.urbanizationlevel || null,
        "landvaluezone_number": formData.landvaluezone_number || null,
        "roadtype": formData.roadtype || null,
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
              disabled={fetchingParcelInfo || isReferenceDataLoading}
              className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded shadow-sm w-full h-10"
            >
              {fetchingParcelInfo ? "ກຳລັງຄົ້ນຫາ..." : 
               isReferenceDataLoading ? "ກຳລັງໂຫຼດຂໍ້ມູນ..." : "ຄົ້ນຫາ"}
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <input
              type="text"
              id="urbanizationlevel"
              name="urbanizationlevel"
              value={formData.urbanizationlevel}
              onChange={handleChange}
              className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            />
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
      </form>
    </div>
  );
});

// Add display name for better debugging
LandForm.displayName = "LandForm";

export default LandForm; 