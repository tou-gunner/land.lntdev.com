'use client';

import { useState } from 'react';
import { useSearchLandParcelQuery } from '../redux/api/apiSlice';

export default function LandSearch() {
  const [cadastreMapNo, setCadastreMapNo] = useState('');
  const [parcelNo, setParcelNo] = useState('');
  const [skipSearch, setSkipSearch] = useState(true);
  
  // Use the query with skip option to control when it fires
  const { data, isLoading, isError, error } = useSearchLandParcelQuery(
    { cadastreMapNo, parcelNo },
    { skip: skipSearch }
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cadastreMapNo && parcelNo) {
      setSkipSearch(false); // This will trigger the query
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">ຄົ້ນຫາທີ່ດິນ</h2>
      
      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div>
          <label className="block mb-1">ເລກທີແຜນທີ່ຄາດັດສະເຕີ</label>
          <input
            type="text"
            value={cadastreMapNo}
            onChange={(e) => setCadastreMapNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">ເລກທີ່ດິນ</label>
          <input
            type="text"
            value={parcelNo}
            onChange={(e) => setParcelNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'ກຳລັງຄົ້ນຫາ...' : 'ຄົ້ນຫາ'}
        </button>
      </form>
      
      {/* Results section */}
      {!skipSearch && (
        <div className="mt-6">
          {isLoading && <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>}
          
          {isError && (
            <div className="text-red-500">
              <p>ເກີດຂໍ້ຜິດພາດ: {error?.toString()}</p>
            </div>
          )}
          
          {data && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              {data.success ? (
                <div>
                  <h3 className="font-medium text-lg mb-2">ຂໍ້ມູນທີ່ດິນ</h3>
                  {data.data ? (
                    <div>
                      <p>ເລກທີ່ດິນ: {data.data.parcel_no || '-'}</p>
                      <p>ເນື້ອທີ່: {data.data.area || '-'} ຕາແມັດ</p>
                      {/* Add more fields as needed based on your API response */}
                    </div>
                  ) : (
                    <p>ບໍ່ພົບຂໍ້ມູນທີ່ດິນ</p>
                  )}
                </div>
              ) : (
                <p className="text-yellow-600 dark:text-yellow-400">{data.message || 'ບໍ່ພົບຂໍ້ມູນທີ່ດິນ'}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 