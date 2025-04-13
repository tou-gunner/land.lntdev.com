"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Define the shape of our form data
interface FormData {
  land: {
    landParcelNumber: string;
    oldLandParcelNumber: string;
    landMapNumber: string;
    oldLandMapNumber: string;
    landUseType: string;
    landZone: string;
    cityPlanningZone: string;
    valuationZone: string;
    roadType: string;
    isGovernmentLand: boolean;
    owner: string;
    disputeType: string;
    area: string;
    landOwnerName: string;
    additionalNotes: string;
    [key: string]: any;
  };
  owner: {
    ownerType: 'person' | 'entity';
    personData?: any;
    entityData?: any;
    [key: string]: any;
  };
  landright: {
    ownershipStatus: string;
    landCertificateNumber: string;
    issueNumber: string;
    landRegistryBookNumber: string;
    landRegistryNumber: string;
    landUseType: string;
    landAcquisitionMethod: string;
    portion: string;
    landCertificateDate: string;
    landCertificateDeliveryDate: string;
    classificationDate: string;
    printDate: string;
    announcementDate: string;
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
      landParcelNumber: "",
      oldLandParcelNumber: "",
      landMapNumber: "",
      oldLandMapNumber: "",
      landUseType: "",
      landZone: "",
      cityPlanningZone: "",
      valuationZone: "",
      roadType: "",
      isGovernmentLand: false,
      owner: "",
      disputeType: "",
      area: "",
      landOwnerName: "",
      additionalNotes: "",
    },
    owner: {
      ownerType: 'person',
    },
    landright: {
      ownershipStatus: "",
      landCertificateNumber: "",
      issueNumber: "",
      landRegistryBookNumber: "",
      landRegistryNumber: "",
      landUseType: "",
      landAcquisitionMethod: "",
      portion: "",
      landCertificateDate: "",
      landCertificateDeliveryDate: "",
      classificationDate: "",
      printDate: "",
      announcementDate: "",
    }
  });

  const [isGovernmentLand, setIsGovernmentLandState] = useState(false);

  // Handler for land form updates
  const updateLandForm = useCallback((landData: any) => {
    setFormData(prev => ({
      ...prev,
      land: landData
    }));
    setIsGovernmentLandState(landData.isGovernmentLand);
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