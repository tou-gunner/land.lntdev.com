"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { apiSlice } from "../redux/api/apiSlice";
import { ReduxProvider } from "../redux/provider";
import { getCurrentUser } from "../lib/auth";
import { withAuth } from "../components/AuthProvider";
import { fetchParcels, fetchParcelsForForm, Parcel } from "../lib/api";

// Tab types for switching between view modes
type TabType = 'type' | 'form';

function DocumentsListContent() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Active tab state for switching between views
  const [activeTab, setActiveTab] = useState<TabType>('type');
  
  // State for parcels for each tab
  const [typeParcels, setTypeParcels] = useState<Parcel[]>([]);
  const [formParcels, setFormParcels] = useState<Parcel[]>([]);
  const [typeTotalItems, setTypeTotalItems] = useState<number>(0);
  const [formTotalItems, setFormTotalItems] = useState<number>(0);
  
  // Pagination states for each tab
  const [typeCurrentPage, setTypeCurrentPage] = useState<number>(1);
  const [formCurrentPage, setFormCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Search and filter states
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
  
  // Cache the current user with useMemo to avoid unnecessary retrieval on re-renders
  const currentUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    fetchAllParcelData(activeTab);
  }, [typeCurrentPage, formCurrentPage, itemsPerPage]);

  const fetchAllParcelData = async (tab: TabType) => {
    try {
      setLoading(true);
      
      // Fetch data for both tabs
      const typeResult = await fetchParcels({
        currentPage: typeCurrentPage,
        itemsPerPage,
        selectedProvince,
        selectedDistrict,
        selectedVillage,
        username: currentUser?.user_name,
      });
      
      const formResult = await fetchParcelsForForm({
        currentPage: formCurrentPage,
        itemsPerPage,
        selectedProvince,
        selectedDistrict,
        selectedVillage,
        username: currentUser?.user_name,
      });
      
      setTypeParcels(typeResult.parcels);
      setFormParcels(formResult.parcels);
      setTypeTotalItems(typeResult.totalItems);
      setFormTotalItems(formResult.totalItems);
      
      // Set the current display based on active tab
      if (tab === 'type') {
        setParcels(typeResult.parcels);
        setTotalItems(typeResult.totalItems);
      } else {
        setParcels(formResult.parcels);
        setTotalItems(formResult.totalItems);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setError("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
    fetchAllParcelData(tab);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict("");
    setSelectedVillage("");
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedVillage("");
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVillage(e.target.value);
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
    fetchAllParcelData(activeTab);
  };

  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
    fetchAllParcelData(activeTab);
  };

  const handleTypePageChange = (newPage: number) => {
    setTypeCurrentPage(newPage);
  };

  const handleFormPageChange = (newPage: number) => {
    setFormCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setTypeCurrentPage(1);
    setFormCurrentPage(1);
    fetchAllParcelData(activeTab);
  };

  // Calculate total pages for each tab
  const typeTotalPages = Math.ceil(typeTotalItems / itemsPerPage);
  const formTotalPages = Math.ceil(formTotalItems / itemsPerPage);
    
  // Calculate page numbers for each tab
  const typePageNumbers = Array.from({ length: Math.min(5, typeTotalPages) }, (_, i) => {
    if (typeTotalPages <= 5) return i + 1;
    
    if (typeCurrentPage <= 3) return i + 1;
    if (typeCurrentPage >= typeTotalPages - 2) return typeTotalPages - 4 + i;
    
    return typeCurrentPage - 2 + i;
  });
  
  const formPageNumbers = Array.from({ length: Math.min(5, formTotalPages) }, (_, i) => {
    if (formTotalPages <= 5) return i + 1;
    
    if (formCurrentPage <= 3) return i + 1;
    if (formCurrentPage >= formTotalPages - 2) return formTotalPages - 4 + i;
    
    return formCurrentPage - 2 + i;
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('type')}
              className={`${
                activeTab === 'type'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              ຈັດກຸ່ມເອກະສານ
            </button>
            <button
              onClick={() => handleTabChange('form')}
              className={`${
                activeTab === 'form'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              ປ້ອນຂໍ້ມູນ
            </button>
          </nav>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          {/* Type Tab Content */}
          <div className={`${activeTab === 'type' ? 'block' : 'hidden'}`}>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລະຫັດບາໂຄດ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ບ້ານ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ເມືອງ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ແຂວງ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ຜູ້ໃຊ້</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {typeParcels.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        ບໍ່ພົບຂໍ້ມູນຕອນດິນສຳລັບຈັດກຸ່ມເອກະສານ
                      </td>
                    </tr>
                  ) : (
                    typeParcels.map((parcel) => (
                      <tr key={parcel.gid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.barcode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.village}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.province}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.userName || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/document-types?parcel=${parcel.barcode}`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="ຈັດການເອກະສານຕອນດິນ"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
            
            {/* Type Tab Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                ສະແດງ <span className="font-medium">
                  {typeParcels.length > 0 ? (typeCurrentPage - 1) * itemsPerPage + 1 : 0}
                </span> ຫາ <span className="font-medium">
                  {Math.min(typeCurrentPage * itemsPerPage, typeTotalItems)}
                </span> ຈາກທັງໝົດ <span className="font-medium">
                  {typeTotalItems}
                </span> ລາຍການ
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleTypePageChange(1)}
                  disabled={typeCurrentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ໜ້າທຳອິດ
                </button>
                <button
                  onClick={() => handleTypePageChange(typeCurrentPage - 1)}
                  disabled={typeCurrentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr;
                </button>
                
                {typePageNumbers.map(page => (
                  <button
                    key={page}
                    onClick={() => handleTypePageChange(page)}
                    className={`px-3 py-1 rounded border text-sm font-medium ${
                      typeCurrentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handleTypePageChange(typeCurrentPage + 1)}
                  disabled={typeCurrentPage === typeTotalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &rarr;
                </button>
                <button
                  onClick={() => handleTypePageChange(typeTotalPages)}
                  disabled={typeCurrentPage === typeTotalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ໜ້າສຸດທ້າຍ
                </button>
              </div>
            </div>
          </div>

          {/* Form Tab Content */}
          <div className={`${activeTab === 'form' ? 'block' : 'hidden'}`}>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ລະຫັດບາໂຄດ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ບ້ານ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ເມືອງ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ແຂວງ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ຜູ້ໃຊ້</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {formParcels.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        ບໍ່ພົບຂໍ້ມູນຕອນດິນສຳລັບປ້ອນຂໍ້ມູນ
                      </td>
                    </tr>
                  ) : (
                    formParcels.map((parcel) => (
                      <tr key={parcel.gid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.barcode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.village}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.province}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.userName || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/document-forms?parcel=${parcel.barcode}`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="ປ້ອນຂໍ້ມູນຕອນດິນ"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
            
            {/* Form Tab Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                ສະແດງ <span className="font-medium">
                  {formParcels.length > 0 ? (formCurrentPage - 1) * itemsPerPage + 1 : 0}
                </span> ຫາ <span className="font-medium">
                  {Math.min(formCurrentPage * itemsPerPage, formTotalItems)}
                </span> ຈາກທັງໝົດ <span className="font-medium">
                  {formTotalItems}
                </span> ລາຍການ
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleFormPageChange(1)}
                  disabled={formCurrentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ໜ້າທຳອິດ
                </button>
                <button
                  onClick={() => handleFormPageChange(formCurrentPage - 1)}
                  disabled={formCurrentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr;
                </button>
                
                {formPageNumbers.map(page => (
                  <button
                    key={page}
                    onClick={() => handleFormPageChange(page)}
                    className={`px-3 py-1 rounded border text-sm font-medium ${
                      formCurrentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handleFormPageChange(formCurrentPage + 1)}
                  disabled={formCurrentPage === formTotalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &rarr;
                </button>
                <button
                  onClick={() => handleFormPageChange(formTotalPages)}
                  disabled={formCurrentPage === formTotalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ໜ້າສຸດທ້າຍ
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Wrap the content component with withAuth
const ProtectedDocumentsListContent = withAuth(DocumentsListContent);

// The main component wrapped with ReduxProvider
export default function DocumentsList() {
  return (
    <ReduxProvider>
      <ProtectedDocumentsListContent />
    </ReduxProvider>
  );
} 