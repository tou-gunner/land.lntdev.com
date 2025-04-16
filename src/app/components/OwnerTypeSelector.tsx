"use client";

import React from 'react';

interface OwnerTypeSelectorProps {
  ownerId: string;
  ownerType: 'person' | 'entity';
  isGovernmentLand: boolean;
  onTypeChange: (id: string, type: 'person' | 'entity') => void;
}

export default function OwnerTypeSelector({ 
  ownerId, 
  ownerType, 
  isGovernmentLand, 
  onTypeChange 
}: OwnerTypeSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
        ປະເພດເຈົ້າຂອງ
      </h3>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            type="radio"
            id={`person-type-${ownerId}`}
            name={`owner-type-${ownerId}`}
            value="person"
            checked={ownerType === 'person'}
            onChange={() => onTypeChange(ownerId, 'person')}
            disabled={isGovernmentLand}
            className="h-5 w-5 text-blue-600"
          />
          <label 
            htmlFor={`person-type-${ownerId}`}
            className={`ml-2 font-medium ${isGovernmentLand ? 'text-gray-400' : 'text-black dark:text-white'}`}
          >
            ບຸກຄົນ
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="radio"
            id={`entity-type-${ownerId}`}
            name={`owner-type-${ownerId}`}
            value="entity"
            checked={ownerType === 'entity'}
            onChange={() => onTypeChange(ownerId, 'entity')}
            className="h-5 w-5 text-blue-600"
          />
          <label 
            htmlFor={`entity-type-${ownerId}`}
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
  );
} 