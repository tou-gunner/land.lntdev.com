import { store } from '../store';
import { apiSlice } from '../api/apiSlice';

/**
 * Utility function to fetch provinces data imperatively
 * @returns Promise resolving to provinces data
 */
export const fetchProvinces  = async () => {
  try {
    // Dispatch the query and await the result using unwrap()
    const provinces = await store.dispatch(
      apiSlice.endpoints.getProvinces.initiate()
    ).unwrap();
    
    return provinces;
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
    throw error;
  }
};

/**
 * Utility function to fetch districts data imperatively
 * @param provinceCode - The province code to fetch districts for
 * @returns Promise resolving to districts data
 */
export const fetchDistricts = async (provinceCode: string) => {
  try {
    // Dispatch the query and await the result using unwrap()
    const districts = await store.dispatch(
      apiSlice.endpoints.getDistricts.initiate(provinceCode)
    ).unwrap();
    
    return districts;
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    throw error;
  }
};

/**
 * Utility function to fetch villages data imperatively
 * @param districtCode - The district code to fetch villages for
 * @returns Promise resolving to villages data
 */
export const fetchVillages = async (districtCode: string) => {
  try {
    const villages = await store.dispatch(
      apiSlice.endpoints.getVillages.initiate(districtCode)
    ).unwrap();
    
    return villages;
  } catch (error) {
    console.error('Failed to fetch villages:', error);
    throw error;
  }
};

export const fetchUrbanization = async () => {
  try {
    const urbanization = await store.dispatch(
      apiSlice.endpoints.getUrbanization.initiate()
    ).unwrap();

    return urbanization;
  } catch (error) {
    console.error('Failed to fetch urbanization:', error);
    throw error;
  }
};



export const fetchTitles = async () => {
  try {
    const titles = await store.dispatch(
      apiSlice.endpoints.getTitles.initiate()
    ).unwrap();

    return titles;
  } catch (error) {
    console.error('Failed to fetch titles:', error);
    throw error;
  }
};

export const fetchMinistries = async () => {
  try {
    const ministries = await store.dispatch(
      apiSlice.endpoints.getMinistries.initiate()
    ).unwrap();

    return ministries;  
  } catch (error) {
    console.error('Failed to fetch ministries:', error);
    throw error;
  }
  };

export const fetchLandUseZones = async () => {
  try {
    const landUseZones = await store.dispatch(
      apiSlice.endpoints.getLandUseZones.initiate()
    ).unwrap();

    return landUseZones;
  } catch (error) {
    console.error('Failed to fetch land use zones:', error);
    throw error;
  }
};

export const fetchRightTypes = async () => {
  try {
    const rightTypes = await store.dispatch(
      apiSlice.endpoints.getRightTypes.initiate()
    ).unwrap();

    return rightTypes;
  } catch (error) {
    console.error('Failed to fetch right types:', error);
    throw error;
  }
};

export const fetchEntityTypes = async () => {
  try {
    const entityTypes = await store.dispatch(
      apiSlice.endpoints.getEntityTypes.initiate()
    ).unwrap();

    return entityTypes;
  } catch (error) {
    console.error('Failed to fetch entity types:', error);
    throw error;
  }
};

export const fetchBusinessTypes = async () => {
  try {
    const businessTypes = await store.dispatch(
      apiSlice.endpoints.getBusinessTypes.initiate()
    ).unwrap();

    return businessTypes;
  } catch (error) {
    console.error('Failed to fetch business types:', error);
    throw error;
  }
};

export const fetchLandTitleHistory = async () => {
  try {
    const landTitleHistory = await store.dispatch(
      apiSlice.endpoints.getLandTitleHistory.initiate()
    ).unwrap();

    return landTitleHistory;
  } catch (error) {
    console.error('Failed to fetch land title history:', error);
    throw error;
  }
};

export const fetchLandUseTypes = async () => {
  try {
    const landUseTypes = await store.dispatch(
      apiSlice.endpoints.getLandUseTypes.initiate()
    ).unwrap();

    return landUseTypes;
  } catch (error) {
    console.error('Failed to fetch land use types:', error);
    throw error;
  }
};

export const fetchRoadTypes = async () => {
  try {
    const roadTypes = await store.dispatch(
      apiSlice.endpoints.getRoadTypes.initiate()
    ).unwrap();

    return roadTypes;
  } catch (error) {
    console.error('Failed to fetch road types:', error);
    throw error;
  }
};

export const fetchDisputeTypes = async () => {
  try {
    const disputeTypes = await store.dispatch(
      apiSlice.endpoints.getDisputeTypes.initiate()
    ).unwrap();

    return disputeTypes;
  } catch (error) {
    console.error('Failed to fetch dispute types:', error);
    throw error;
  }
};

/**
 * Generic function to fetch data from any endpoint imperatively
 * @param endpoint - The API endpoint to call
 * @param param - The parameter to pass to the endpoint
 * @returns Promise resolving to the transformed data
 */
export const fetchApiData = async <T, P>(
  endpoint: keyof typeof apiSlice.endpoints,
  param?: P
) => {
  try {
    const result = await store.dispatch(
      // @ts-expect-error - Dynamic endpoint access
      apiSlice.endpoints[endpoint].initiate(param)
    ).unwrap();
    
    return result as T;
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    throw error;
  }
}; 