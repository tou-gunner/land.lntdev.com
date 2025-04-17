"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Define the shape of our form data
interface FormData {
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
  landrights: Array<{
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
    owner: {
      gid: string;
      ownertype: 'person' | 'entity';
      title?: string;
      name?: string;
      // Person specific fields
      firstname?: string;
      lastname?: string;
      birthdate?: string;
      nationality?: string;
      occupation?: string;
      idcardno?: string;
      idcarddate?: string;
      familybookno?: string;
      fathername?: string;
      mothername?: string;
      spousename?: string;
      spousebirthdate?: string;
      spousefathername?: string;
      spousemothername?: string;
      spousenationality?: string;
      spouseoccupation?: string;
      // Entity specific fields
      entitytype?: string;
      registrationno?: string;
      registrationdate?: string;
      businesstype?: string;
      companyname?: string;
      // Common address fields
      province?: string;
      district?: string;
      village?: string;
      unit?: string;
      road?: string;
      houseno?: string;
      government_workplace?: string;
      isstate?: boolean;
      updated?: string;
    };
  }>;
  [key: string]: any;
}

// Define the context type
interface FormContextType {
  formData: FormData;
  isGovernmentLand: boolean;
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
        ownertype: 'person',
        title: "",
        name: "",
        province: "",
        district: "",
        village: "",
        unit: "",
        road: "",
        houseno: "",
        government_workplace: "",
        isstate: false,
        updated: ""
      }
    }]
  });

  const [isGovernmentLand, setIsGovernmentLandState] = useState(false);

  // Handler for updating a specific land right
  const updateLandRight = useCallback((index: number, landRightData: any) => {
    setFormData(prev => {
      const updatedLandRights = [...prev.landrights];
      
      // Create sanitized data with null values converted to appropriate defaults
      const sanitizedData: any = {};
      
      // Process each field in the new data
      Object.entries(landRightData).forEach(([key, value]) => {
        if (value === null) {
          // Handle null values based on field type
          const currentValue = updatedLandRights[index][key];
          if (typeof currentValue === 'number') {
            sanitizedData[key] = 0;
          } else if (typeof currentValue === 'boolean') {
            sanitizedData[key] = false;
          } else {
            sanitizedData[key] = '';
          }
        } else {
          sanitizedData[key] = value;
        }
      });
      
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
          ownertype: 'person',
          title: "",
          name: "",
          province: "",
          district: "",
          village: "",
          unit: "",
          road: "",
          houseno: "",
          government_workplace: "",
          isstate: false,
          updated: ""
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

  // Handler for updating form data
  const updateFormData = useCallback((newData: Partial<FormData>) => {
    setFormData(prev => {
      // Create sanitized data with null values converted to appropriate defaults
      const sanitizedData: Partial<FormData> = {};
      
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
          sanitizedData[key] = value;
        }
      });
      
      return {
        ...prev,
        ...sanitizedData
      };
    });
  }, []);

  // Create the context value
  const contextValue: FormContextType = {
    formData,
    isGovernmentLand,
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