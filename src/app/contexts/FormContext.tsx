"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useGetLandUseZonesQuery, useGetEntityTypesQuery, useGetBusinessTypesQuery, useGetMinistriesQuery, useGetTitlesQuery } from "../redux/api/apiSlice";

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
  isstate: boolean;
  updated?: string;
  companyname?: string;
}

export interface LandRight {
  gid: string;
  parcelid: string;
  ownerid: string;
  righttype?: string;
  landregisterbookno?: string;
  titlenumber?: string;
  titleeditionno?: string;
  landrightcategory?: string;
  landregistersheetno?: string;
  stateland?: boolean;
  barcode?: string;
  part?: string;
  history?: string;
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
  landusetype?: string;
  landusezone?: string;
  urbanizationlevel?: string;
  landvaluezone_number?: string;
  roadtype?: number;
  isstate?: boolean;
  owner_check?: string;
  purpose?: string;
  status?: number;
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
  parcelToFormData: (newData: FormData) => Promise<boolean>;
  updateFormData: (newData: Partial<FormData>) => void;
  updateLandRight: (index: number, data: any) => void;
  addLandRight: (data?: any) => void;
  removeLandRight: (index: number) => void;
  setIsGovernmentLand: (value: boolean) => void;
}

// Create the context with a default value
const FormContext = createContext<FormContextType | undefined>(undefined);

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
  const [formData, setFormData] = useState<FormData>({
    parcelno: "",
    parcelno_old: "",
    cadastremapno: "",
    cadastremapno_old: "",
    landusetype: "",
    landusezone: "",
    urbanizationlevel: "",
    landvaluezone_number: "",
    roadtype: -1,
    isstate: false,
    owner_check: "",
    purpose: "",
    status: -1,
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
    landrights: [{
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
      valid_from: "",
      valid_till: "",
      date_conclusion: "",
      date_title_printed: "",
      date_public_display: "",
      date_title_send_to_ponre: "",
      date_title_issued: "",
      updated: "",
      owner: {
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
      }
    }]
  });

  const [isGovernmentLand, setIsGovernmentLandState] = useState(false);
  const { data: landusezones = [], isLoading: zonesLoading } = useGetLandUseZonesQuery();
  const { data: entitytypes = [], isLoading: typesLoading } = useGetEntityTypesQuery();
  const { data: businessTypes = [], isLoading: businessTypesLoading } = useGetBusinessTypesQuery();
  const { data: ministries = [], isLoading: ministriesLoading } = useGetMinistriesQuery();
  const { data: titles = [], isLoading: titlesLoading } = useGetTitlesQuery();

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
        valid_from: "",
        valid_till: "",
        date_conclusion: "",
        date_title_printed: "",
        date_public_display: "",
        date_title_send_to_ponre: "",
        date_title_issued: "",
        updated: "",
        owner: {
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
        },
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

  const parcelToFormData = useCallback(async (newData: FormData): Promise<boolean> => {
    // If any data is still loading, return false to indicate processing wasn't completed
    if (zonesLoading || typesLoading || businessTypesLoading || ministriesLoading || titlesLoading) {
      return false;
    }

    setFormData(prev => {
      // Create sanitized data with null values converted to appropriate defaults
      let sanitizedData: Partial<FormData> = {};
      // Process each field in the new data
      Object.entries(newData).forEach(([key, value]) => {
        if (value === null) {
          // Handle null values based on field type
          if (typeof prev[key] === 'number') {
            sanitizedData[key] = 0;
          } else if (typeof prev[key] === 'boolean') {
            sanitizedData[key] = false;
          } else {
            sanitizedData[key] = '';
          }
        } else {
          if (key === 'landusezone') {
            sanitizedData[key] = landusezones.find(zone => zone.id === value)?.name || "";
          } else {
            sanitizedData[key] = value;
          }
        }

        if (key === 'landrights') {
          let sanitizedLandRights: Array<LandRight> = [];
          for (const [index, landRight] of (value as Array<LandRight>).entries()) {
            const sanitizedLandRightData: Partial<LandRight> = {};
            // Process each field in the new data
            Object.entries(landRight).forEach(([landRightKey, landRightValue]) => {
              if (landRightValue === null) {
                // Handle null values based on field type
                if (typeof value[landRightKey] === 'number') {
                  sanitizedLandRightData[landRightKey] = 0;
                } else if (typeof value[landRightKey] === 'boolean') {
                  sanitizedLandRightData[landRightKey] = false;
                } else {
                  sanitizedLandRightData[landRightKey] = '';
                }
              } else {
                if (landRightKey === 'entitytype') {

                } else {
                  sanitizedLandRightData[landRightKey] = landRightValue;
                }
              }

              if (landRightKey === 'owner') {
                let sanitizedOwnerData: Partial<Owner> = {};
                // Process each field in the new data
                Object.entries(landRightValue).forEach(([ownerKey, ownerValue]) => {
                  if (ownerValue === null) {
                    // Handle null values based on field type
                    if (typeof landRightValue[ownerKey] === 'number') {
                      sanitizedOwnerData[ownerKey] = 0;
                    } else if (typeof landRightValue[ownerKey] === 'boolean') {
                      sanitizedOwnerData[ownerKey] = false;
                    } else {
                      sanitizedOwnerData[ownerKey] = '';
                    }
                  } else {
                    if (ownerKey === 'entitytype') {
                      sanitizedOwnerData[ownerKey] = entitytypes.find(type => type.id === ownerValue)?.name || "";
                    } else if (ownerKey === 'title') {
                      sanitizedOwnerData[ownerKey] = titles.find(title => title.id === ownerValue)?.name || "";
                    } else if (ownerKey === 'registrationdate') {
                      sanitizedOwnerData[ownerKey] = new Date(ownerValue as string).toISOString().split('T')[0];
                    } else if (ownerKey === 'businesstype') {
                      sanitizedOwnerData[ownerKey] = businessTypes.find(type => type.id === ownerValue)?.name || "";
                    } else if (ownerKey === 'government_workplace') {
                      sanitizedOwnerData[ownerKey] = ministries.find(ministry => ministry.id === ownerValue)?.name || "";
                    } else {
                      sanitizedOwnerData[ownerKey] = ownerValue;
                    }
                    console.log(sanitizedOwnerData);
                  }
                  sanitizedLandRightData[landRightKey] = {...landRightValue, ...sanitizedOwnerData};
                });
              }

            });
            sanitizedLandRights[index] = {...value[index], ...sanitizedLandRightData};
          }
          sanitizedData = {...sanitizedData, landrights: sanitizedLandRights};
        }

      });
      
      return {
        ...prev,
        ...sanitizedData
      };
    });
    
    return true;
  }, [landusezones, entitytypes, businessTypes, ministries, titles, zonesLoading, typesLoading, businessTypesLoading, ministriesLoading, titlesLoading]);

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
    parcelToFormData,
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