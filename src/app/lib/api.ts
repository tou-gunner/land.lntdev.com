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
  doctype: number;
  rotate: number;
  user_name: string;
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