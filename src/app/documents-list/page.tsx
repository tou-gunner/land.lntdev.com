"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { apiSlice } from "../redux/api/apiSlice";
import { ReduxProvider } from "../redux/provider";

interface Parcel {
  gid: string;
  parcelno: string;
  cadastremapno: string;
  barcode: string;
  village: string;
  district: string;
  province: string;
  villageCode?: string;
  districtCode?: string;
  provinceCode?: string;
}

interface Province {
  provincecode: string;
  province_english: string;
  province_lao: string;
  id: string;
  name: string;
}

interface District {
  districtcode: string;
  district_english: string;
  district_lao: string;
  id: string;
  name: string;
}

interface Village {
  provinceid: string;
  provincename: string;
  districtid: string;
  districtname: string;
  villageid: string;
  villagename: string;
  id: string;
  name: string;
}

function DocumentsListContent() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Search and filter states
  const [searchText, setSearchText] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  
  // Use RTK Query hooks from Redux
  const { data: provinces = [] } = apiSlice.useGetProvincesQuery();
  const { data: districts = [] } = apiSlice.useGetDistrictsQuery(selectedProvince, { 
    skip: !selectedProvince 
  });
  const { data: villages = [] } = apiSlice.useGetVillagesQuery(selectedDistrict, { 
    skip: !selectedDistrict 
  });

  useEffect(() => {
    fetchParcels();
  }, [currentPage, itemsPerPage, selectedProvince, selectedDistrict, selectedVillage]);

  // Helper function to find province name from code
  const getProvinceName = (provinceCode: string): string => {
    const province = provinces.find(p => p.id === provinceCode);
    return province?.name || `ແຂວງລະຫັດ ${provinceCode}`;
  };

  // Helper function to find district name from code
  const getDistrictName = (districtCode: string): string => {
    const district = districts.find(d => d.id === districtCode);
    return district?.name || `ເມືອງລະຫັດ ${districtCode}`;
  };

  // Helper function to find village name from code
  const getVillageName = (villageCode: string): string => {
    const village = villages.find(v => v.id === villageCode);
    return village?.name || `ບ້ານລະຫັດ ${villageCode}`;
  };

  const fetchParcels = async () => {
    try {
      setLoading(true);
      
      // Construct the query URL with filters
      let url = `${apiBaseUrl}/parcel/list_parcels_filter?page_no=${currentPage}&offset=${itemsPerPage}`;
      
      // Get the selected provinces/districts/villages full names
      const selectedProvinceName = provinces.find(p => p.id === selectedProvince)?.value || selectedProvince;
      const selectedDistrictName = districts.find(d => d.id === selectedDistrict)?.value || selectedDistrict;
      const selectedVillageName = villages.find(v => v.id === selectedVillage)?.value || selectedVillage;
      
      if (selectedProvince) url += `&province=${encodeURIComponent(selectedProvinceName)}`;
      if (selectedDistrict) url += `&district=${encodeURIComponent(selectedDistrictName)}`;
      if (selectedVillage) url += `&village=${encodeURIComponent(selectedVillageName)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch parcels");
      }
      
      const data = await response.json();
      
      // Log for debugging
      console.log('API Response:', data);

      // Define the type for the API response items
      interface ApiParcelItem {
        parcel: string;
        file_name: string;
        province_code: string;
        district_code: string;
        village_code: string;
        user_name: string | null;
        date_upload: string;
        province_lao: string | null;
        district_lao: string | null;
        village_lao: string | null;
        total_count: number;
        total_pages: number;
      }

      // Transform the data structure to match our interface
      const transformedParcels = data.data.map((item: ApiParcelItem) => {
        // Try to find the province name from our Redux state or from API response
        const provinceName = item.province_lao || getProvinceName(item.province_code);
        
        // Try to find the district name from our Redux state or from API response
        const districtName = item.district_lao || getDistrictName(item.district_code);
        
        // Try to find the village name from our Redux state or from API response
        const villageName = item.village_lao || getVillageName(item.village_code);
        
        return {
          gid: item.parcel,
          // Extract parcel number from the first part before underscore for parcelno
          parcelno: item.parcel.split('_')[0],
          // Use full parcel identifier as barcode for display
          barcode: item.parcel,
          // Use available data from Redux or API response
          village: villageName,
          district: districtName,
          province: provinceName,
          cadastremapno: item.file_name || 'N/A',
          // Store original codes for filtering
          villageCode: item.village_code,
          districtCode: item.district_code,
          provinceCode: item.province_code
        };
      });
      
      setParcels(transformedParcels);
      
      // Get the total count from the first item if available
      const totalCount = data.data.length > 0 ? data.data[0].total_count : 0;
      setTotalItems(totalCount);
      
      // Function to trigger loading of all location data needed for the display
      const loadAllLocations = async (data: any) => {
        // Extract unique province codes from the data
        const uniqueProvinceCodes = [...new Set(data.map((item: ApiParcelItem) => item.province_code))];
        
        // Load each province's districts if not already loaded
        for (const provinceCode of uniqueProvinceCodes) {
          if (provinceCode && !districts.some(d => d.id === provinceCode)) {
            try {
              // This will trigger the appropriate RTK Query to load the districts
              // Just note we're not awaiting as this is just to prime the cache
              apiSlice.endpoints.getDistricts.initiate(provinceCode as string);
            } catch (error) {
              console.error(`Error loading districts for province ${provinceCode}:`, error);
            }
          }
        }
        
        // Extract unique district codes from the data
        const uniqueDistrictCodes = [...new Set(data.map((item: ApiParcelItem) => item.district_code))];
        
        // Load each district's villages if not already loaded
        for (const districtCode of uniqueDistrictCodes) {
          if (districtCode && !villages.some(v => v.id === districtCode)) {
            try {
              // This will trigger the appropriate RTK Query to load the villages
              apiSlice.endpoints.getVillages.initiate(districtCode as string);
            } catch (error) {
              console.error(`Error loading villages for district ${districtCode}:`, error);
            }
          }
        }
      };
      
      loadAllLocations(data.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setError("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");
      setLoading(false);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict("");
    setSelectedVillage("");
    setCurrentPage(1);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedVillage("");
    setCurrentPage(1);
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVillage(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchParcels();
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const filteredParcels = parcels.filter(parcel => {
    if (!searchText) return true;
    
    const search = searchText.toLowerCase();
    return (
      parcel.parcelno.toLowerCase().includes(search) ||
      parcel.cadastremapno.toLowerCase().includes(search) ||
      parcel.barcode.toLowerCase().includes(search) ||
      parcel.village.toLowerCase().includes(search) ||
      parcel.district.toLowerCase().includes(search) ||
      parcel.province.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    
    return currentPage - 2 + i;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ລາຍການເອກະສານຕອນດິນ</h1>
        <div className="flex space-x-2 items-center">
          <label htmlFor="itemsPerPage" className="text-sm">ຈຳນວນຕໍ່ໜ້າ:</label>
          <select 
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="searchText" className="block text-sm font-medium mb-1">ຄົ້ນຫາ</label>
            <input
              type="text"
              id="searchText"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ຄົ້ນຫາຈາກທຸກຊ່ອງ..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="province" className="block text-sm font-medium mb-1">ແຂວງ</label>
            <select
              id="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">ທຸກແຂວງ</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-1">ເມືອງ</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">ທຸກເມືອງ</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="village" className="block text-sm font-medium mb-1">ບ້ານ</label>
            <select
              id="village"
              value={selectedVillage}
              onChange={handleVillageChange}
              disabled={!selectedDistrict}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">ທຸກບ້ານ</option>
              {villages.map(village => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ຄົ້ນຫາ
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              ຣີເຊັດ
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລະຫັດບາໂຄດ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ບ້ານ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ເມືອງ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ແຂວງ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredParcels.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      ບໍ່ພົບຂໍ້ມູນຕອນດິນ
                    </td>
                  </tr>
                ) : (
                  filteredParcels.map((parcel) => (
                    <tr key={parcel.gid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.barcode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.village}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.district}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.province}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link 
                            href={`/land-management?parcel=${parcel.barcode}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="ຈັດການເອກະສານຕອນດິນ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <Link 
                            href={`${apiBaseUrl}/parcel/pdf?parcel=${parcel.barcode}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="ເບິ່ງ PDF"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              ສະແດງ <span className="font-medium">{filteredParcels.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> ຫາ <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> ຈາກທັງໝົດ <span className="font-medium">{totalItems}</span> ລາຍການ
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ໜ້າທຳອິດ
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &larr;
              </button>
              
              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &rarr;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ໜ້າສຸດທ້າຍ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// The main component wrapped with ReduxProvider
export default function DocumentsList() {
  return (
    <ReduxProvider>
      <DocumentsListContent />
    </ReduxProvider>
  );
} 