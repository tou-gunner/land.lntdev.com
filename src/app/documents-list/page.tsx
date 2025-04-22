"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { apiSlice } from "../redux/api/apiSlice";
import { ReduxProvider } from "../redux/provider";
import { getCurrentUser } from "../lib/auth";
import { withAuth } from "../components/AuthProvider";
import { fetchParcels, Parcel } from "../lib/api";

function DocumentsListContent() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  
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
    fetchParcelData();
  }, [currentPage, itemsPerPage]);

  const fetchParcelData = async () => {
    try {
      setLoading(true);
      
      // Use the fetchParcels function from api.ts
      const result = await fetchParcels({
        currentPage,
        itemsPerPage,
        selectedProvince,
        selectedDistrict,
        selectedVillage
      });
      
      setParcels(result.parcels);
      setTotalItems(result.totalItems);
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
    fetchParcelData();
  };

  const handleReset = () => {
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
                {parcels.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      ບໍ່ພົບຂໍ້ມູນຕອນດິນ
                    </td>
                  </tr>
                ) : (
                  parcels.map((parcel) => (
                    <tr key={parcel.gid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.barcode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.village}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.district}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parcel.province}</td>
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              ສະແດງ <span className="font-medium">{parcels.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> ຫາ <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> ຈາກທັງໝົດ <span className="font-medium">{totalItems}</span> ລາຍການ
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