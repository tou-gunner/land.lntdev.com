// Note: These functions are now also available as Redux hooks in the Redux apiSlice.
// For new components, prefer using the Redux hooks (useGetLandUseZonesQuery, etc.)
// from src/app/redux/api/apiSlice.ts instead of these direct API calls.

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiItem {
  id: number | string;
  description_lao: string;
  description_english: string;
  [key: string]: any; // For any other properties
}

interface TransformedItem {
  id: number | string;
  name: string;
  englishName?: string;
}

export interface DocTypeRequest {
  parcel: string;
  page: number;
  doctype: string;
  rotate: number;
  user_name: string;
}

export interface ApiParcelItem {
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

export interface Parcel {
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
  userName?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to transform API items to the format needed by dropdowns
function transformApiItems(items: ApiItem[]): TransformedItem[] {
  return items.map(item => ({
    id: item.id,
    name: item.description_lao || item.name || '',
    englishName: item.description_english || ''
  }));
}

// Fetch parcels with filtering
export async function fetchParcels(params: {
  currentPage: number;
  itemsPerPage: number;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedVillage?: string;
  username?: string;
  useInputEndpoint?: boolean;
}): Promise<{ parcels: Parcel[], totalItems: number }> {
  try {
    const { 
      currentPage, 
      itemsPerPage, 
      selectedProvince, 
      selectedDistrict, 
      selectedVillage,
    } = params;
    
    // Choose the endpoint based on the useInputEndpoint flag
    const endpoint = "/parcel/list_parcels_filter";
    
    // Construct the query URL with filters
    let url = `${API_BASE_URL}${endpoint}?page_no=${currentPage}&offset=${itemsPerPage}`;
    
    if (selectedProvince) url += `&province=${selectedProvince}`;
    if (selectedDistrict) url += `&district=${selectedDistrict}`;
    if (selectedVillage) url += `&village=${selectedVillage}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch parcels");
    }
    
    const data = await response.json();

    // Transform the data structure to match our interface
    const transformedParcels = data.data.map((item: ApiParcelItem) => {
      const provinceName = item.province_code;
      const districtName = item.district_code;
      const villageName = item.village_code;
      
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
        provinceCode: item.province_code,
        // Add userName from the API response
        userName: item.user_name || ''
      };
    });
    
    // Return the parsed data and total items count
    return {
      parcels: transformedParcels,
      totalItems: data.data?.[0]?.total_count || 0
    };
  } catch (error) {
    console.error('Error fetching parcels:', error);
    throw error;
  }
}

// Fetch parcels with filtering
export async function fetchParcelsForForm(params: {
  currentPage: number;
  itemsPerPage: number;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedVillage?: string;
  username?: string;
  useInputEndpoint?: boolean;
}): Promise<{ parcels: Parcel[], totalItems: number }> {
  try {
    const { 
      currentPage, 
      itemsPerPage, 
      selectedProvince, 
      selectedDistrict, 
      selectedVillage,
      username,
      useInputEndpoint
    } = params;
    
    // Choose the endpoint based on the useInputEndpoint flag
    const endpoint = "/parcel/list_parcels_filter_input";
    
    // Construct the query URL with filters
    let url = `${API_BASE_URL}${endpoint}?page_no=${currentPage}&offset=${itemsPerPage}`;
    
    if (selectedProvince) url += `&province=${selectedProvince}`;
    if (selectedDistrict) url += `&district=${selectedDistrict}`;
    if (selectedVillage) url += `&village=${selectedVillage}`;
    
    if (username) {
      url += `&user_name=${username}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch parcels");
    }
    
    const data = await response.json();

    // Transform the data structure to match our interface
    const transformedParcels = data.data.map((item: ApiParcelItem) => {
      const provinceName = item.province_code;
      const districtName = item.district_code;
      const villageName = item.village_code;
      
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
        provinceCode: item.province_code,
        // Add userName from the API response
        userName: item.user_name || ''
      };
    });
    
    // Return the parsed data and total items count
    return {
      parcels: transformedParcels,
      totalItems: data.data?.[0]?.total_count || 0
    };
  } catch (error) {
    console.error('Error fetching parcels:', error);
    throw error;
  }
}

// ----------------------
// Document and PDF Management Functions
// ----------------------

// Document type management functions
export async function updateDocumentTypes(docTypes: DocTypeRequest[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/parcel/pdf/update_document_type`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(docTypes),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update document types");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating document types:', error);
    throw error;
  }
}

// Function to check if PDF exists for a parcel
export async function fetchPdfInfo(parcelId: string) {
  try {
    const apiBaseUrl = API_BASE_URL || '';
    const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
    
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error("ບໍ່ສາມາດຊອກຫາເອກະສານ PDF ສຳລັບຕອນດິນນີ້");
    }
    
    return { pdfUrl };
  } catch (error) {
    console.error("Error fetching PDF info:", error);
    throw error;
  }
}

// Function to lock a parcel record for a user
export async function lockParcelRecord(username: string, parcelId: string) {
  try {
    const url = `${API_BASE_URL}/parcel/user_lock_record`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_name: username,
        parcel: parcelId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to lock the parcel record');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to lock the parcel record');
    }
    
    return result;
  } catch (error) {
    console.error('Error locking parcel record:', error);
    throw error;
  }
}

// ----------------------
// Utility and Reference Data Functions
// ----------------------

export async function fetchLandUseZones() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/landusezone`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching land use zones:', error);
    return [];
  }
}

export async function fetchLandUseTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/landuse`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching land use types:', error);
    return [];
  }
}

export async function fetchRoadTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/streetcategories`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching road types:', error);
    return [];
  }
}

export async function fetchDisputeTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/ltstatus`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching dispute types:', error);
    return [];
  }
}

export async function fetchEntityTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/entitytypes`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching entity types:', error);
    return [];
  }
}

export async function fetchBusinessTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/businesstypes`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching business types:', error);
    return [];
  }
}

export async function fetchMinistries() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/ministries`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return [];
  }
}

export async function fetchRightTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/righttypes`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching right types:', error);
    return [];
  }
}

export async function fetchLandTitleHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/lthistory`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const result = await response.json();
    
    if (result?.success && Array.isArray(result.data)) {
      return transformApiItems(result.data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching land title history:', error);
    return [];
  }
}

// New function to search for land parcels
export async function searchLandParcel(cadastreMapNo: string, parcelNo: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/parcel/find?parcelno=${parcelNo}&cadastremapno=${cadastreMapNo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error searching land parcel:', error);
    throw error;
  }
} 