"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import PersonForm from "./PersonForm";
import EntityForm from "./EntityForm";

export default function OwnerForm() {
  const { formData: contextFormData, updateOwnerForm, isGovernmentLand, setIsGovernmentLand } = useFormContext();
  
  // We only need to track which form is visible, not duplicate the entire data structure
  const [ownerType, setOwnerType] = useState<'person' | 'entity'>(
    contextFormData.owner?.ownerType || (isGovernmentLand ? 'entity' : 'person')
  );

  // Update owner type when context data changes
  useEffect(() => {
    if (contextFormData.owner?.ownerType) {
      setOwnerType(contextFormData.owner.ownerType);
    }
  }, [contextFormData.owner]);

  // Update owner type when isGovernmentLand changes
  useEffect(() => {
    if (isGovernmentLand) {
      setOwnerType('entity');
      
      // Update context directly
      updateOwnerForm({
        ...contextFormData.owner,
        ownerType: 'entity' as 'entity'
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGovernmentLand]);

  // Handle owner type selection
  const handleOwnerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGovernmentLand && e.target.value === 'person') {
      // If it's government land, prevent changing to person
      return;
    }
    const newOwnerType = e.target.value as 'person' | 'entity';
    setOwnerType(newOwnerType);
    
    // Update context directly
    updateOwnerForm({
      ...contextFormData.owner,
      ownerType: newOwnerType
    });
  };

  const handlePersonSubmit = (data: any) => {
    console.log(data);
    alert("ຂໍ້ມູນຖືກບັນທຶກແລ້ວ");
  };

  const handleEntitySubmit = (data: any) => {
    console.log(data);
    alert("ຂໍ້ມູນຖືກບັນທຶກແລ້ວ");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
          ປະເພດເຈົ້າຂອງ
        </h3>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="person-type"
              name="owner-type"
              value="person"
              checked={ownerType === 'person'}
              onChange={handleOwnerTypeChange}
              disabled={isGovernmentLand}
              className="h-5 w-5 text-blue-600"
            />
            <label 
              htmlFor="person-type" 
              className={`ml-2 font-medium ${isGovernmentLand ? 'text-gray-400' : 'text-black dark:text-white'}`}
            >
              ບຸກຄົນ
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="entity-type"
              name="owner-type"
              value="entity"
              checked={ownerType === 'entity'}
              onChange={handleOwnerTypeChange}
              className="h-5 w-5 text-blue-600"
            />
            <label 
              htmlFor="entity-type" 
              className="ml-2 font-medium text-black dark:text-white"
            >
              ນິຕິບຸກຄົນ
            </label>
          </div>
        </div>
        
        {isGovernmentLand && (
          <p className="mt-2 text-sm text-red-500">
            ດິນລັດ
          </p>
        )}
      </div>
      
      {/* Show both forms but toggle visibility with CSS */}
      <div style={{ display: ownerType === 'person' ? 'block' : 'none' }}>
        <PersonForm 
          formData={contextFormData.owner?.personData} 
          onChange={(newData) => {
            // Update context directly
            updateOwnerForm({
              ...contextFormData.owner,
              personData: newData
            });
          }}
          onSubmit={handlePersonSubmit} 
        />
      </div>

      <div style={{ display: ownerType === 'entity' ? 'block' : 'none' }}>
        <EntityForm 
          formData={contextFormData.owner?.entityData} 
          onChange={(newData) => {
            // Update context directly
            updateOwnerForm({
              ...contextFormData.owner,
              entityData: newData
            });
          }}
          onSubmit={handleEntitySubmit} 
        />
      </div>
    </div>
  );
} 