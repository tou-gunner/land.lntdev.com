"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import OwnerTab from "./OwnerTab";
import OwnerTypeSelector from "./OwnerTypeSelector";
import OwnerDetails from "./OwnerDetails";
import OwnerLandRightForm from "./OwnerLandRightForm";
import { 
  useGetRightTypesQuery, 
  useGetLandUseTypesQuery, 
  useGetLandTitleHistoryQuery 
} from "../redux/api/apiSlice";

interface LandRight {
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
  guid?: string; // Database unique identifier
}

interface Owner {
  id: string;
  ownerType: 'person' | 'entity';
  portion: number;
  personData?: any;
  entityData?: any;
  landright: LandRight; // Each owner has their own landright data
}

export default function OwnerAndRightForm() {
  const { formData: contextFormData, updateOwnerForm, updateLandRightForm, isGovernmentLand, setIsGovernmentLand } = useFormContext();
  
  // Initialize landright from context for first owner
  const initialLandRight: LandRight = {
    righttype: contextFormData.landright.righttype || "",
    landtitleno: contextFormData.landright.landtitleno || "",
    issueno: contextFormData.landright.issueno || "",
    registerbookno: contextFormData.landright.registerbookno || "",
    registerno: contextFormData.landright.registerno || "",
    approvaltype: contextFormData.landright.approvaltype || "",
    lthistory: contextFormData.landright.lthistory || "",
    portion: contextFormData.landright.portion || "",
    landtitledate: contextFormData.landright.landtitledate || "",
    landtitledeliverydate: contextFormData.landright.landtitledeliverydate || "",
    classificationdate: contextFormData.landright.classificationdate || "",
    printdate: contextFormData.landright.printdate || "",
    announcementdate: contextFormData.landright.announcementdate || "",
    guid: contextFormData.landright.guid || ""
  };
  
  // State for managing multiple owners
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: '1',
      ownerType: contextFormData.owner?.ownerType || (isGovernmentLand ? 'entity' : 'person'),
      portion: 100,
      personData: contextFormData.owner?.personData || {},
      entityData: contextFormData.owner?.entityData || {},
      landright: initialLandRight
    }
  ]);
  
  // State for the current active owner
  const [activeOwner, setActiveOwner] = useState<Owner>(owners[0]);
  
  // RTK Query hooks for data fetching
  const { data: rightTypes = [], isLoading: loadingRightTypes } = useGetRightTypesQuery();
  const { data: landUseTypes = [], isLoading: loadingLandUseTypes } = useGetLandUseTypesQuery();
  const { data: landTitleHistory = [], isLoading: loadingLandTitleHistory } = useGetLandTitleHistoryQuery();

  // Update owner type when isGovernmentLand changes
  useEffect(() => {
    if (isGovernmentLand) {
      // Update all owners to entity type if it's government land
      const updatedOwners = owners.map(owner => ({
        ...owner,
        ownerType: 'entity' as 'entity'
      }));
      setOwners(updatedOwners);
      
      // Update active owner
      if (activeOwner) {
        setActiveOwner({
          ...activeOwner,
          ownerType: 'entity' as 'entity'
        });
      }
      
      // Update context directly
      updateOwnerForm({
        ...contextFormData.owner,
        ownerType: 'entity' as 'entity'
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGovernmentLand]);
  
  // Functions for managing multiple owners
  const addOwner = () => {
    // Create empty landright for new owner
    const emptyLandRight: LandRight = {
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
      announcementdate: ""
    };
    
    const newOwner: Owner = {
      id: Date.now().toString(),
      ownerType: isGovernmentLand ? 'entity' : 'person',
      portion: 0,
      personData: {},
      entityData: {},
      landright: emptyLandRight
    };
    
    // Add new owner and set as active
    setOwners([...owners, newOwner]);
    setActiveOwner(newOwner);
  };
  
  const removeOwner = (id: string) => {
    if (owners.length <= 1) {
      alert("ຕ້ອງມີເຈົ້າຂອງຢ່າງໜ້ອຍ 1 ຄົນ");
      return;
    }
    
    const updatedOwners = owners.filter(owner => owner.id !== id);
    setOwners(updatedOwners);
    
    // If active owner was removed, set first owner as active
    if (activeOwner.id === id) {
      setActiveOwner(updatedOwners[0]);
    }
  };
  
  const selectOwner = (owner: Owner) => {
    setActiveOwner(owner);
  };
  
  const updateOwnerType = (id: string, type: 'person' | 'entity') => {
    if (isGovernmentLand && type === 'person') {
      // If it's government land, prevent changing to person
      return;
    }
    
    const updatedOwners = owners.map(owner => 
      owner.id === id ? { ...owner, ownerType: type as 'person' | 'entity' } : owner
    );
    setOwners(updatedOwners);
    
    // Update active owner if it's the one being changed
    if (activeOwner.id === id) {
      setActiveOwner({ ...activeOwner, ownerType: type as 'person' | 'entity' });
    }
    
    // Update context for backward compatibility
    if (id === owners[0].id) {
      updateOwnerForm({
        ...contextFormData.owner,
        ownerType: type
      });
    }
  };
  
  const updateOwnerPortion = (id: string, portion: number) => {
    const updatedOwners = owners.map(owner => 
      owner.id === id ? { ...owner, portion, landright: { ...owner.landright, portion: portion.toString() } } : owner
    );
    setOwners(updatedOwners);
    
    // Update active owner if it's the one being changed
    if (activeOwner.id === id) {
      setActiveOwner({ 
        ...activeOwner, 
        portion, 
        landright: { ...activeOwner.landright, portion: portion.toString() } 
      });
    }
    
    // Update context for backward compatibility (only for first owner)
    if (id === owners[0].id) {
      updateLandRightForm({
        ...contextFormData.landright,
        portion: portion.toString()
      });
    }
  };
  
  const updateOwnerData = (id: string, data: any) => {
    const updatedOwners = owners.map(owner => {
      if (owner.id === id) {
        return { 
          ...owner, 
          ...(owner.ownerType === 'person' 
            ? { personData: { ...owner.personData, ...data } }
            : { entityData: { ...owner.entityData, ...data } }
          )
        };
      }
      return owner;
    });
    
    setOwners(updatedOwners);
    
    // Update active owner if it's the one being changed
    if (activeOwner.id === id) {
      if (activeOwner.ownerType === 'person') {
        setActiveOwner({ 
          ...activeOwner, 
          personData: { ...activeOwner.personData, ...data } 
        });
      } else {
        setActiveOwner({ 
          ...activeOwner, 
          entityData: { ...activeOwner.entityData, ...data } 
        });
      }
    }
    
    // Update context for backward compatibility
    if (id === owners[0].id) {
      if (activeOwner.ownerType === 'person') {
        updateOwnerForm({
          ...contextFormData.owner,
          personData: { ...contextFormData.owner.personData, ...data }
        });
      } else {
        updateOwnerForm({
          ...contextFormData.owner,
          entityData: { ...contextFormData.owner.entityData, ...data }
        });
      }
    }
  };
  
  // Handle land right form changes - now for specific owner
  const handleLandRightChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update the landright for the specific owner
    const updatedOwners = owners.map(owner => {
      if (owner.id === id) {
        return {
          ...owner,
          landright: {
            ...owner.landright,
            [name]: value
          }
        };
      }
      return owner;
    });
    
    setOwners(updatedOwners);
    
    // Update active owner if it's the one being changed
    if (activeOwner.id === id) {
      setActiveOwner({
        ...activeOwner,
        landright: {
          ...activeOwner.landright,
          [name]: value
        }
      });
    }
    
    // Update context for backward compatibility (only for first owner)
    if (id === owners[0].id) {
      updateLandRightForm({
        ...contextFormData.landright,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if owner portions add up to 100%
    const totalPortion = owners.reduce((sum, owner) => sum + (owner.portion || 0), 0);
    if (totalPortion !== 100) {
      alert(`ສ່ວນແບ່ງຂອງເຈົ້າຂອງທັງໝົດຕ້ອງລວມກັນໄດ້ 100%. ປັດຈຸບັນແມ່ນ ${totalPortion}%`);
      return;
    }
    
    // Prepare data for API submission
    const ownersWithRights = owners.map(owner => ({
      ownerId: owner.id,
      ownerType: owner.ownerType,
      portion: owner.portion,
      personData: owner.ownerType === 'person' ? owner.personData : null,
      entityData: owner.ownerType === 'entity' ? owner.entityData : null,
      landright: owner.landright
    }));
    
    console.log("Owners with land rights:", ownersWithRights);
    alert("ຂໍ້ມູນຖືກບັນທຶກແລ້ວ");
  };
  
  return (
    <div className="space-y-8">
    
      {/* Owners Section with tabs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            ເຈົ້າຂອງທີ່ດິນ
          </h2>
          <button 
            onClick={addOwner}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            type="button"
          >
            ເພີ່ມເຈົ້າຂອງ
          </button>
        </div>
        
        {/* Owner tabs navigation */}
        <OwnerTab 
          owners={owners} 
          activeOwner={activeOwner} 
          onSelectOwner={selectOwner} 
        />
        
        {/* Active owner form */}
        {activeOwner && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-4">
                {/* Owner type selector component */}
                <OwnerTypeSelector 
                  ownerId={activeOwner.id}
                  ownerType={activeOwner.ownerType}
                  isGovernmentLand={isGovernmentLand}
                  onTypeChange={updateOwnerType}
                />
              </div>
              
              {owners.length > 1 && (
                <button 
                  onClick={() => removeOwner(activeOwner.id)}
                  className="text-red-600 hover:text-red-800"
                  type="button"
                >
                  ລຶບເຈົ້າຂອງນີ້
                </button>
              )}
            </div>
            
            {/* Owner Information Section */}
            <OwnerDetails 
              ownerId={activeOwner.id}
              ownerType={activeOwner.ownerType}
              personData={activeOwner.personData}
              entityData={activeOwner.entityData}
              onUpdateOwnerData={updateOwnerData}
            />
            
            {/* Land Rights Section for this owner */}
            <OwnerLandRightForm 
              ownerId={activeOwner.id}
              landright={activeOwner.landright}
              onChange={handleLandRightChange}
              onPortionChange={updateOwnerPortion}
            />
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          type="button"
        >
          ບັນທຶກຂໍ້ມູນ
        </button>
      </div>
    </div>
  );
} 