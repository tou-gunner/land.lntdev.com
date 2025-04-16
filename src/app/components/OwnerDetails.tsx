"use client";

import React from 'react';
import PersonForm from './PersonForm';
import EntityForm from './EntityForm';

interface OwnerDetailsProps {
  ownerId: string;
  ownerType: 'person' | 'entity';
  personData: any;
  entityData: any;
  onUpdateOwnerData: (id: string, data: any) => void;
}

export default function OwnerDetails({
  ownerId,
  ownerType,
  personData,
  entityData,
  onUpdateOwnerData
}: OwnerDetailsProps) {
  return (
    <div className="border-t border-gray-300 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        ຂໍ້ມູນເຈົ້າຂອງ
      </h3>
      
      {/* Show Person or Entity form based on owner type */}
      {ownerType === 'person' ? (
        <PersonForm 
          formData={personData} 
          onChange={(newData) => onUpdateOwnerData(ownerId, newData)} 
          onSubmit={() => {}} // Handle in the parent form
        />
      ) : (
        <EntityForm 
          formData={entityData} 
          onChange={(newData) => onUpdateOwnerData(ownerId, newData)}
          onSubmit={() => {}} // Handle in the parent form
        />
      )}
    </div>
  );
} 