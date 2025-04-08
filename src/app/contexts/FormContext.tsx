"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Define the shape of our form data
interface FormData {
  land: {
    parcelno: string;
    parcelno_old: string;
    cadastremapno: string;
    cadastremapno_old: string;
    landusetype: string;
    landusezone: string;
    urbanizationlevel: string;
    landvaluezone_number: string;
    roadtype: string;
    isstate: boolean;
    purpose: string;
    status: string;
    area: string;
    landOwnerName: string;
    additionalstatements: string;
    // Address fields
    province: string;
    district: string;
    village: string;
    unit: string;
    road: string;
    [key: string]: any;
  };
  owner: {
    ownerType: 'person' | 'entity';
    personData?: {
      title: string;
      firstname: string;
      lastname: string;
      birthdate: string;
      nationality: string;
      occupation: string;
      idcardno: string;
      idcarddate: string;
      governmentplace: string;
      familybookno: string;
      fathername: string;
      mothername: string;
      spousename: string;
      spousebirthdate: string;
      spousenationality: string;
      spouseoccupation: string;
      spousefathername: string;
      spousemothername: string;
      province: string;
      district: string;
      village: string;
      unit: string;
      street: string;
      houseno: string;
    };
    entityData?: {
      title: string;
      fullname: string;
      entitytype: string;
      regno: string;
      regdate: string;
      businesstype: string;
      nationality: string;
      governmentplace: string;
      companyname: string;
      province: string;
      district: string;
      village: string;
      unit: string;
      road: string;
      houseno: string;
    };
    [key: string]: any;
  };
  landright: {
    righttype: string;
    landtitleno: string;
    issueno: string;
    registerbookno: string;
    registerno: string;
    approvaltype: string;
    lthistory: string;
    portion: string;
    landtitledate: string;
    landtitledeliverydate: string;
    classificationdate: string;
    printdate: string;
    announcementdate: string;
    [key: string]: any;
  };
}

// Define the context type
interface FormContextType {
  formData: FormData;
  isGovernmentLand: boolean;
  updateLandForm: (data: any) => void;
  updateOwnerForm: (data: any) => void;
  updateLandRightForm: (data: any) => void;
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
  // Initialize form state
  const [formData, setFormData] = useState<FormData>({
    land: {
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
      purpose: "",
      status: "",
      area: "",
      landOwnerName: "",
      additionalstatements: "",
      province: "",
      district: "",
      village: "",
      unit: "",
      road: "",
    },
    owner: {
      ownerType: 'person',
    },
    landright: {
      righttype: "",
      landtitleno: "",
      issueno: "",
      registerbookno: "",
      registerno: "",
      approvaltype: "",
      lthistory: "",
      portion: "",
      landtitledate: "",
      landtitledeliverydate: "",
      classificationdate: "",
      printdate: "",
      announcementdate: "",
    }
  });

  const [isGovernmentLand, setIsGovernmentLandState] = useState(false);

  // Handler for land form updates
  const updateLandForm = useCallback((landData: any) => {
    setFormData(prev => ({
      ...prev,
      land: landData
    }));
    setIsGovernmentLandState(landData.isstate);
  }, []);

  // Handler for owner form updates
  const updateOwnerForm = useCallback((ownerData: any) => {
    setFormData(prev => ({
      ...prev,
      owner: ownerData
    }));
  }, []);

  // Handler for land right form updates
  const updateLandRightForm = useCallback((landRightData: any) => {
    setFormData(prev => ({
      ...prev,
      landright: landRightData
    }));
  }, []);

  // Create the context value
  const contextValue: FormContextType = {
    formData,
    isGovernmentLand,
    updateLandForm,
    updateOwnerForm,
    updateLandRightForm,
    setIsGovernmentLand: setIsGovernmentLandState
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
} 