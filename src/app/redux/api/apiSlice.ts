import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define interface types for consistent data handling
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiItem {
  id: number | string;
  description_lao: string;
  description_english: string;
  [key: string]: any;
}

interface TransformedItem {
  id: number | string;
  name: string;
  englishName?: string;
}

interface Province {
  provincecode: string;
  province_english: string;
  province_lao: string;
}

interface District {
  districtcode: string;
  district_english: string;
  district_lao: string;
}

interface Village {
  provinceid: string;
  provincename: string;
  districtid: string;
  districtname: string;
  villageid: string;
  villagename: string;
}

interface DocumentType {
  doc_type: number;
  description_lao: string;
  group_id: number;
  group_name: string;
  object_name: string;
}

export interface DocTypeOption {
  value: number;
  label: string;
  group?: string;
  objectName?: string;
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api' 
  }),
  tagTypes: ['Land', 'Person', 'Entity', 'LandRight'],
  endpoints: (builder) => ({
    // Provinces
    getProvinces: builder.query<{ id: string, name: string, value: string }[], void>({
      query: () => '/utility/provinces',
      transformResponse: (response: ApiResponse<Province[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(province => ({
            id: province.provincecode,
            name: province.province_lao || province.province_english,
            value: province.province_lao || province.province_english
          }));
        }
        return [];
      }
    }),

    // Get Document Types
    getDocumentTypes: builder.query<DocTypeOption[], void>({
      query: () => '/utility/documenttypes',
      transformResponse: (response: ApiResponse<DocumentType[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            value: item.doc_type,
            label: item.description_lao,
            group: item.group_name,
            objectName: item.object_name
          }));
        }
        return [];
      }
    }),

    // Districts by Province
    getDistricts: builder.query<{ id: string, name: string, value: string }[], string | undefined>({
      query: (provinceCode) => `/utility/districts?province=${provinceCode}`,
      transformResponse: (response: ApiResponse<District[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(district => ({
            id: district.districtcode,
            name: district.district_lao || district.district_english,
            value: district.district_lao || district.district_english
          }));
        }
        return [];
      }
    }),

    // Villages by District
    getVillages: builder.query<{ id: string, name: string, value: string }[], string | undefined>({
      query: (districtCode) => `/utility/villages?district=${districtCode}`,
      transformResponse: (response: ApiResponse<Village[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(village => ({
            id: village.villageid,
            name: village.villagename,
            value: village.villagename
          }));
        }
        return [];
      }
    }),

    // Land Use Zones
    getLandUseZones: builder.query<TransformedItem[], void>({
      query: () => '/utility/landusezone',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Land Use Types
    getLandUseTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/landuse',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Road Types
    getRoadTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/streetcategories',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Dispute Types
    getDisputeTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/ltstatus',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Entity Types
    getEntityTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/entitytypes',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Business Types
    getBusinessTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/businesstypes',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Ministries
    getMinistries: builder.query<TransformedItem[], void>({
      query: () => '/utility/ministries',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Right Types
    getRightTypes: builder.query<TransformedItem[], void>({
      query: () => '/utility/righttypes',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Land Title History
    getLandTitleHistory: builder.query<TransformedItem[], void>({
      query: () => '/utility/lthistory',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Titles (Prefixes)
    getTitles: builder.query<TransformedItem[], void>({
      query: () => '/utility/titles',
      transformResponse: (response: ApiResponse<ApiItem[]>) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data.map(item => ({
            id: item.id,
            name: item.description_lao || item.name || '',
            englishName: item.description_english || ''
          }));
        }
        return [];
      }
    }),

    // Save Entity
    saveEntity: builder.mutation<any, any>({
      query: (entityData) => ({
        url: '/owner/save_entity',
        method: 'POST',
        body: entityData,
      }),
      invalidatesTags: ['Entity']
    }),

    // Save Land Rights
    saveLandRights: builder.mutation<any, any>({
      query: (landRightData) => ({
        url: '/owner/save_landrights',
        method: 'POST',
        body: landRightData,
      }),
      invalidatesTags: ['LandRight']
    }),

    // Search Land Parcel
    searchLandParcel: builder.query<any, { cadastreMapNo: string, parcelNo: string }>({
      query: ({ cadastreMapNo, parcelNo }) => 
        `/parcel/find?parcelno=${parcelNo}&cadastremapno=${cadastreMapNo}`
    }),

    // Save Land Parcel
    saveParcel: builder.mutation<any, any>({
      query: (parcelData) => ({
        url: '/parcel/save',
        method: 'POST',
        body: parcelData,
      }),
    }),
    
    // Get Parcel Info with Land Rights
    getParcelInfo: builder.query<any, { parcelno: string, mapno: string }>({
      query: ({ parcelno, mapno }) => 
        `/parcel/parcel_info?parcelno=${parcelno}&mapno=${mapno}`
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useGetLandUseZonesQuery,
  useGetLandUseTypesQuery,
  useGetRoadTypesQuery,
  useGetDisputeTypesQuery,
  useGetEntityTypesQuery,
  useGetBusinessTypesQuery,
  useGetMinistriesQuery,
  useGetRightTypesQuery,
  useGetLandTitleHistoryQuery,
  useGetTitlesQuery,
  useSearchLandParcelQuery,
  useSaveParcelMutation,
  useSaveEntityMutation,
  useSaveLandRightsMutation,
  useGetParcelInfoQuery,
  useGetDocumentTypesQuery
} = apiSlice; 