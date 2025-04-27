"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { fetchBusinessTypes, fetchTitles, fetchEntityTypes, fetchLandUseZones, fetchRightTypes, fetchMinistries, fetchLandUseTypes, fetchLandTitleHistory, fetchUrbanization, fetchRoadTypes } from "../redux/utils/queryUtils";
// Remove unused RTK query imports
// import { useGetLandUseZonesQuery, useGetEntityTypesQuery, useGetBusinessTypesQuery, useGetMinistriesQuery, useGetTitlesQuery } from "../redux/api/apiSlice";

export interface Owner {
  gid: string;
  ownertype: 'person' | 'entity';
  [key: string]: any;
}

export interface Entity extends Owner {
  name?: string;
  entitytype?: string;
  registrationno?: string;
  registrationdate?: string;
  businesstype?: string;
  nationality?: string;
  houseno?: string;
  road?: string;
  unit?: string;
  village?: string;
  district?: string;
  province?: string;
  title?: string;
  government_workplace?: string;
  isstate?: boolean;
  updated?: string;
  companyname?: string;
}

export interface Person extends Owner {
  title?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  nationality?: string;
  occupation?: string;
  idcardno?: string;
  idcarddate?: string;
  governmentplace?: string;
  familybookno?: string;
  fathername?: string;
  mothername?: string;
  spousename?: string;
  spousebirthdate?: string;
  spousefathername?: string;
  spousemothername?: string;
  spousenationality?: string;
  spouseoccupation?: string;
  province?: string;
  district?: string;
  village?: string;
  unit?: string;
  street?: string;
  houseno?: string;
}

export interface LandRight {
  gid: string;
  parcelid: string;
  ownerid: string;
  righttype?: number | string;
  landregisterbookno?: string;
  titlenumber?: string;
  titleeditionno?: string;
  landrightcategory?: number | string;
  landregistersheetno?: string;
  stateland?: boolean;
  barcode?: string;
  part?: string;
  history?: number | string;
  old_ownerid?: string;
  valid_from?: string;
  valid_till?: string;
  date_conclusion?: string;
  date_title_printed?: string;
  date_public_display?: string;
  date_title_send_to_ponre?: string;
  date_title_issued?: string;
  updated?: string;
  // Owner data
  owner: Owner;
  [key: string]: any;
}

// Define the shape of our form data
export interface FormData {
  // Land data
  parcelno: string;
  parcelno_old?: string;
  cadastremapno: string;
  cadastremapno_old?: string;
  landusetype?: string | number;
  landusezone?: string | number;
  urbanizationlevel?: string | number;
  landvaluezone_number?: string;
  roadtype?: number | string;
  isstate?: boolean;
  owner_check?: string;
  purpose?: string;
  status?: number | string;
  area?: number;
  additionalstatements?: string;
  // Address fields
  province?: string;
  district?: string;
  village?: string;
  villagecode?: string;
  unit?: string;
  road?: string;
  barcode?: string;
  gid?: string;
  // Land rights array
  landrights: Array<LandRight>;
  [key: string]: any;
}

// Define the context type
interface FormContextType {
  formData: FormData;
  isGovernmentLand: boolean;
  processParcelData: (parcelData: any) => Promise<void>;
  updateFormData: (newData: Partial<FormData>) => void;
  updateLandRight: (index: number, data: any) => void;
  addLandRight: (data?: any) => void;
  removeLandRight: (index: number) => void;
  setIsGovernmentLand: (value: boolean) => void;
}

// Create the context with a default value
const FormContext = createContext<FormContextType | undefined>(undefined);

export const emptyOwner: Owner = {
  gid: "",
  ownertype: "person",
  name: "",
  entitytype: "",
  registrationno: "",
  registrationdate: "",
  businesstype: "",
  nationality: "",
  houseno: "",
  road: "",
  unit: "",
  village: "",
  district: "",
  province: "",
  title: "",
  government_workplace: "",
  isstate: false,
  updated: "",
  companyname: ""
};

export const emptyLandRight: LandRight = {
  gid: "",
  parcelid: "",
  ownerid: "",
  righttype: "",
  landregisterbookno: "",
  titlenumber: "",
  titleeditionno: "",
  landrightcategory: "",
  landregistersheetno: "",
  stateland: false,
  barcode: "",
  part: "",
  history: "",
  old_ownerid: "",
  valid_from: "",
  valid_till: "",
  date_conclusion: "",
  date_title_printed: "",
  date_public_display: "",
  date_title_send_to_ponre: "",
  date_title_issued: "",
  updated: "",
  owner: emptyOwner
};

export const emptyFormData: FormData = {
  parcelno: "",
  parcelno_old: "",
  cadastremapno: "",
  cadastremapno_old: "",
  landusetype: "",
  landusezone: "",
  urbanizationlevel: "",
  landvaluezone_number: "",
  roadtype: "",
  isstate: false,
  owner_check: "",
  purpose: "",
  status: "",
  area: 0,
  additionalstatements: "",
  province: "",
  district: "",
  village: "",
  villagecode: "",
  unit: "",
  road: "",
  barcode: "",
  gid: "",
  landrights: [emptyLandRight]
};

// Hook to use the form context
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  // Initialize form state with default empty values
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const [isGovernmentLand, setIsGovernmentLandState] = useState(false);
  
  // Remove these queries as they're now handled directly in the LandForm component
  // const { data: landusezones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  // const { data: entitytypes = [], isLoading: typesLoading } = useGetEntityTypesQuery();
  // const { data: businessTypes = [], isLoading: businessTypesLoading } = useGetBusinessTypesQuery();
  // const { data: ministries = [], isLoading: ministriesLoading } = useGetMinistriesQuery();
  // const { data: titles = [], isLoading: titlesLoading } = useGetTitlesQuery();
  
  // Process parcel data with direct access to all required data
  const processParcelData = async (parcelData: any) => {
    const landZones = await fetchLandUseZones();
    const rightTypes = await fetchRightTypes();
    const landUseTypes = await fetchLandUseTypes();
    const roadType = await fetchRoadTypes();
    const historyTypes = await fetchLandTitleHistory();
    const entityTypes = await fetchEntityTypes();
    const businessTypes = await fetchBusinessTypes();
    const ministries = await fetchMinistries();
    const titles = await fetchTitles();
    const urbanization = await fetchUrbanization();
    // Create sanitized data with null values converted to appropriate defaults
    const sanitizedData: FormData = {
      parcelno: parcelData.parcelno,
      parcelno_old: parcelData.parcelno_old || "",
      cadastremapno: parcelData.cadastremapno,
      cadastremapno_old: parcelData.cadastremapno_old || "",
      landusetype: landUseTypes.find(type => type.id == parcelData.landusetype)?.id ||
        landUseTypes.find(type => type.name == parcelData.landusetype)?.id || "",
      landusezone: landZones.find(zone => zone.id == parcelData.landusezone)?.id ||
        landZones.find(zone => zone.name == parcelData.landusezone)?.id || "",
      urbanizationlevel: urbanization.find(level => level.id == parcelData.urbanizationlevel)?.id ||
        urbanization.find(level => level.name == parcelData.urbanizationlevel)?.id || "",
      landvaluezone_number: parcelData.landvaluezone_number || "",
      roadtype: roadType.find(type => type.id == parcelData.roadtype)?.id ||
        roadType.find(type => type.name == parcelData.roadtype)?.id || "",
      isstate: parcelData.isstate || false,
      owner_check: parcelData.owner_check || "",
      purpose: parcelData.purpose || "",
      status: parcelData.status || "",
      area: parcelData.area || 0,
      additionalstatements: parcelData.additionalstatements || "",
      province: parcelData.province || "",
      district: parcelData.district || "",
      village: parcelData.village || "",
      villagecode: parcelData.villagecode || "",
      districtcode: parcelData.villagecode ? parcelData.villagecode.substring(0, 4) : "",
      provincecode: parcelData.villagecode ? parcelData.villagecode.substring(0, 2) : "",
      unit: parcelData.unit || "",
      road: parcelData.road || "",
      barcode: parcelData.barcode || "",
      gid: parcelData.gid,
      landrights: []
    };

    if (parcelData.landrights) {
      for (const landRight of parcelData.landrights) {
        const sanitizedLandRightData: LandRight = {
          gid: landRight.gid,
          parcelid: landRight.parcelid,
          ownerid: landRight.ownerid,
          righttype: rightTypes.find(type => type.id == landRight.righttype)?.id ||
            rightTypes.find(type => type.name == landRight.righttype)?.id || "",
          landregisterbookno: landRight.landregisterbookno || "",
          titlenumber: landRight.titlenumber || "",
          titleeditionno: landRight.titleeditionno || "",
          landrightcategory: landUseTypes.find(type => type.id == landRight.landrightcategory)?.id ||
            landUseTypes.find(type => type.name == landRight.landrightcategory)?.id || "",
          landregistersheetno: landRight.landregistersheetno || "",
          stateland: landRight.stateland || false,
          barcode: landRight.barcode || "",
          part: landRight.part || "",
          history: historyTypes.find(type => type.id == landRight.history)?.id ||
            historyTypes.find(type => type.name == landRight.history)?.id || "",
          old_ownerid: landRight.old_ownerid || "",
          valid_from: landRight.valid_from ? new Date(landRight.valid_from).toISOString().split('T')[0] : "",
          valid_till: landRight.valid_till ? new Date(landRight.valid_till).toISOString().split('T')[0] : "",
          date_conclusion: landRight.date_conclusion ? new Date(landRight.date_conclusion).toISOString().split('T')[0] : "",
          date_title_printed: landRight.date_title_printed ? new Date(landRight.date_title_printed).toISOString().split('T')[0] : "",
          date_public_display: landRight.date_public_display ? new Date(landRight.date_public_display).toISOString().split('T')[0] : "",
          date_title_send_to_ponre: landRight.date_title_send_to_ponre ? new Date(landRight.date_title_send_to_ponre).toISOString().split('T')[0] : "",
          date_title_issued: landRight.date_title_issued ? new Date(landRight.date_title_issued).toISOString().split('T')[0] : "",
          updated: landRight.updated || "",
          owner: {
            gid: landRight.owner.gid,
            ownertype: landRight.owner.ownertype,
            name: landRight.owner.name,
            entitytype: entityTypes.find(type => type.id == landRight.owner.entitytype)?.id ||
              entityTypes.find(type => type.name == landRight.owner.entitytype)?.id || "",
            registrationno: landRight.owner.registrationno || "",
            registrationdate: landRight.owner.registrationdate ? new Date(landRight.owner.registrationdate).toISOString().split('T')[0] : "",
            businesstype: businessTypes.find(type => type.id == landRight.owner.businesstype)?.id ||
              businessTypes.find(type => type.name == landRight.owner.businesstype)?.id || "",
            nationality: landRight.owner.nationality || "",
            houseno: landRight.owner.houseno || "",
            road: landRight.owner.road || "",
            unit: landRight.owner.unit || "",
            village: landRight.owner.village || "",
            district: landRight.owner.villagecode ? landRight.owner.villagecode.substring(0, 4) : "",
            province: landRight.owner.villagecode ? landRight.owner.villagecode.substring(0, 2) : "",
            title: titles.find(title => title.id == landRight.owner.title)?.id ||
              titles.find(title => title.name == landRight.owner.title)?.id || "",
            government_workplace: ministries.find(ministry => ministry.id == landRight.owner.government_workplace)?.id ||
              ministries.find(ministry => ministry.name == landRight.owner.government_workplace)?.id || "",
            isstate: false,
            updated: landRight.owner.updated || "",
            companyname: landRight.owner.companyname || ""
          }
        };
        sanitizedData.landrights.push(sanitizedLandRightData);
      }
    }

    // Update the form data with the processed data
    updateFormData({...emptyFormData, ...sanitizedData});
  };

  // Handler for updating a specific land right
  const updateLandRight = useCallback((index: number, landRightData: LandRight) => {
    setFormData(prev => {
      const updatedLandRights = [...prev.landrights];
      
      // Create sanitized data with null values converted to appropriate defaults
      const sanitizedData: any = {};
      
      // Process each field in the new data
      for (const key in landRightData) {
        if (Object.prototype.hasOwnProperty.call(landRightData, key)) {
          // Ensure the key is actually a key of LandRight
          if (key in updatedLandRights[index]) {
            const currentKey = key as keyof LandRight;
            const currentValue = updatedLandRights[index][currentKey];
      
            if (typeof currentValue === 'number') {
              sanitizedData[currentKey] = 0;
            } else if (typeof currentValue === 'boolean') {
              sanitizedData[currentKey] = false;
            } else {
              sanitizedData[currentKey] = '';
            }
          }
        } else {
          // Handle unknown keys if needed
          sanitizedData[key as keyof LandRight] = landRightData[key as keyof LandRight];
        }
      }
      
      updatedLandRights[index] = {
        ...updatedLandRights[index],
        ...sanitizedData
      };
      
      return {
        ...prev,
        landrights: updatedLandRights
      };
    });
  }, []);

  // Handler for adding a new land right
  const addLandRight = useCallback((data: any = {}) => {
    setFormData(prev => {
      const newLandRight = {
        ...emptyLandRight,
        ...data
      };
      
      return {
        ...prev,
        landrights: [...prev.landrights, newLandRight]
      };
    });
  }, []);

  // Handler for removing a land right
  const removeLandRight = useCallback((index: number) => {
    setFormData(prev => {
      const updatedLandRights = [...prev.landrights];
      
      // Ensure we always have at least one land right
      if (updatedLandRights.length > 1) {
        updatedLandRights.splice(index, 1);
      }
      
      return {
        ...prev,
        landrights: updatedLandRights
      };
    });
  }, []);

  // Handler for updating form data
  const updateFormData = useCallback((newData: Partial<FormData>) => {
    setFormData(prev => {
      return {...prev, ...newData};
    });
  }, []);

  // Create the context value
  const contextValue: FormContextType = {
    formData,
    isGovernmentLand,
    processParcelData,
    updateFormData,
    updateLandRight,
    addLandRight,
    removeLandRight,
    setIsGovernmentLand: setIsGovernmentLandState
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
} 