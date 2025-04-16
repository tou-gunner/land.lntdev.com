"use client";

import React from 'react';

interface Owner {
  id: string;
  ownerType: 'person' | 'entity';
  portion: number;
  personData?: any;
  entityData?: any;
  landright: any;
}

interface OwnerTabProps {
  owners: Owner[];
  activeOwner: Owner;
  onSelectOwner: (owner: Owner) => void;
}

export default function OwnerTab({ owners, activeOwner, onSelectOwner }: OwnerTabProps) {
  if (owners.length <= 1) {
    return null;
  }
  
  return (
    <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
      {owners.map((owner, index) => (
        <button
          key={owner.id}
          onClick={() => onSelectOwner(owner)}
          className={`py-2 px-4 font-medium ${
            activeOwner.id === owner.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          type="button"
        >
          ເຈົ້າຂອງ {index + 1} ({owner.portion}%)
        </button>
      ))}
    </div>
  );
} 