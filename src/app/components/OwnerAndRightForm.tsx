"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "../contexts/FormContext";
import PersonForm from "./PersonForm";
import EntityForm from "./EntityForm";
import LandRightForm from "./LandRightForm";

enum OwnerType {
  PERSON = "person",
  ENTITY = "entity",
}

export default function OwnerAndRightForm() {
  const { 
    formData, 
    updateLandRight, 
    addLandRight, 
    removeLandRight 
  } = useFormContext();
  
  const [activeRightTab, setActiveRightTab] = useState<number>(0);

  // Initialize active tab based on data
  useEffect(() => {
    if (formData?.landrights?.length > 0 && activeRightTab >= formData.landrights.length) {
      setActiveRightTab(0);
    }
  }, [formData, activeRightTab]);

  // const handleAddNewLandRight = () => {
  //   addLandRight();
  //   setActiveRightTab(formData.landrights.length); // Focus on the new tab
  // };

  // const handleRemoveLandRight = (index: number) => {
  //   removeLandRight(index);
    
  //   // Adjust active tab if needed
  //   if (activeRightTab >= formData.landrights.length - 1) {
  //     setActiveRightTab(Math.max(0, formData.landrights.length - 2));
  //   }
  // };

  if (!formData.gid || !formData?.landrights || formData.landrights.length === 0) {
    return <div className="p-4 text-center">Loading land rights data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Land Rights Section with Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-4">
          <h2 className="text-xl font-bold text-black dark:text-white">ສິດນຳໃຊ້ທີ່ດິນ ແລະ ເຈົ້າຂອງ</h2>
          <button
            onClick={handleAddNewLandRight}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md"
          >
            ເພີ່ມສິດນຳໃຊ້
          </button>
        </div> */}

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-300 dark:border-gray-700">
          {formData.landrights.map((right, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setActiveRightTab(index)}
                className={`py-2 px-4 ${
                  activeRightTab === index
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ສິດທີ {index + 1}
              </button>
              {/* {formData.landrights.length > 1 && (
                <button
                  onClick={() => handleRemoveLandRight(index)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ×
                </button>
              )} */}
            </div>
          ))}
        </div>

        {/* Active Land Right Content */}
        {formData.landrights.map((landright, index) => (
          <div
            key={index}
            style={{ display: activeRightTab === index ? "block" : "none" }}
            className="p-4"
          >

            {/* Owner Form */}
            <div className="mb-8">
              {landright.owner?.ownertype === OwnerType.PERSON ? (
                <></>
                // <PersonForm />
              ) : (
                <EntityForm owner={landright.owner} />
              )}
            </div>

            {/* Land Right Form */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-black dark:text-white">
                ຂໍ້ມູນສິດນຳໃຊ້ທີ່ດິນ
              </h2>
              <LandRightForm landRightData={landright} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
