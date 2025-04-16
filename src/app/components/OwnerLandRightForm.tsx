"use client";

import React from 'react';
import { useGetRightTypesQuery, useGetLandUseTypesQuery, useGetLandTitleHistoryQuery } from "../redux/api/apiSlice";

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
  guid?: string;
}

interface OwnerLandRightFormProps {
  ownerId: string;
  landright: LandRight;
  onChange: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPortionChange: (id: string, portion: number) => void;
}

export default function OwnerLandRightForm({ 
  ownerId, 
  landright, 
  onChange, 
  onPortionChange 
}: OwnerLandRightFormProps) {
  // RTK Query hooks for data fetching
  const { data: rightTypes = [], isLoading: loadingRightTypes } = useGetRightTypesQuery();
  const { data: landUseTypes = [], isLoading: loadingLandUseTypes } = useGetLandUseTypesQuery();
  const { data: landTitleHistory = [], isLoading: loadingLandTitleHistory } = useGetLandTitleHistoryQuery();

  return (
    <div className="border-t border-gray-300 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        ຂໍ້ມູນສິດນຳໃຊ້ທີ່ດິນຂອງເຈົ້າຂອງນີ້
      </h3>
      
      <div className="mb-6">
        <div className="form-group">
          <label htmlFor={`portion-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ສ່ວນແບ່ງ (%):
          </label>
          <input
            type="number"
            id={`portion-${ownerId}`}
            value={parseInt(landright.portion) || 0}
            onChange={(e) => onPortionChange(ownerId, Number(e.target.value))}
            className="form-input w-40 rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            min="0"
            max="100"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Type */}
        <div className="form-group">
          <label htmlFor={`righttype-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ສະຖານະການເປັນເຈົ້າຂອງສິດ:
          </label>
          <select
            id={`righttype-${ownerId}`}
            name="righttype"
            value={landright.righttype}
            onChange={(e) => onChange(ownerId, e)}
            className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            disabled={loadingRightTypes}
          >
            <option value="">ເລືອກສະຖານະ</option>
            {loadingRightTypes ? (
              <option value="">ກຳລັງໂຫຼດ...</option>
            ) : (
              rightTypes.map((type) => (
                <option key={type.id} value={type.id.toString()}>
                  {type.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Land Title Number */}
        <div className="form-group">
          <label htmlFor={`landtitleno-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ເລກທີໃບຕາດິນ:
          </label>
          <input
            type="text"
            id={`landtitleno-${ownerId}`}
            name="landtitleno"
            value={landright.landtitleno}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Issue Number */}
        <div className="form-group">
          <label htmlFor={`issueno-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ອອກຄັ້ງທີ:
          </label>
          <input
            type="number"
            id={`issueno-${ownerId}`}
            name="issueno"
            value={landright.issueno}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Register Book Number */}
        <div className="form-group">
          <label htmlFor={`registerbookno-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ເລກທີປຶ້ມທະບຽນທີ່ດິນ:
          </label>
          <input
            type="text"
            id={`registerbookno-${ownerId}`}
            name="registerbookno"
            value={landright.registerbookno}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Register Number */}
        <div className="form-group">
          <label htmlFor={`registerno-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ເລກທີໃບທະບຽນທີ່ດິນ:
          </label>
          <input
            type="text"
            id={`registerno-${ownerId}`}
            name="registerno"
            value={landright.registerno}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Approval Type */}
        <div className="form-group">
          <label htmlFor={`approvaltype-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ປະເພດສິດນຳໃຊ້ທີ່ດິນ:
          </label>
          <select
            id={`approvaltype-${ownerId}`}
            name="approvaltype"
            value={landright.approvaltype}
            onChange={(e) => onChange(ownerId, e)}
            className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            disabled={loadingLandUseTypes}
          >
            <option value="">ເລືອກປະເພດ</option>
            {loadingLandUseTypes ? (
              <option value="">ກຳລັງໂຫຼດ...</option>
            ) : (
              landUseTypes.map((type) => (
                <option key={type.id} value={type.id.toString()}>
                  {type.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Land Title History */}
        <div className="form-group">
          <label htmlFor={`lthistory-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ການໄດ້ມາຂອງສິດນຳໃຊ້:
          </label>
          <select
            id={`lthistory-${ownerId}`}
            name="lthistory"
            value={landright.lthistory}
            onChange={(e) => onChange(ownerId, e)}
            className="form-select w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
            disabled={loadingLandTitleHistory}
          >
            <option value="">ເລືອກການໄດ້ມາ</option>
            {loadingLandTitleHistory ? (
              <option value="">ກຳລັງໂຫຼດ...</option>
            ) : (
              landTitleHistory.map((method) => (
                <option key={method.id} value={method.id.toString()}>
                  {method.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Land Title Dates */}
        <div className="form-group">
          <label htmlFor={`landtitledate-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ອອກໃບຕາດິນ:
          </label>
          <input
            type="date"
            id={`landtitledate-${ownerId}`}
            name="landtitledate"
            value={landright.landtitledate}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`landtitledeliverydate-${ownerId}`} className="block mb-2 font-semibold text-black dark:text-white">
            ວັນທີສົ່ງໃບຕາດິນ:
          </label>
          <input
            type="date"
            id={`landtitledeliverydate-${ownerId}`}
            name="landtitledeliverydate"
            value={landright.landtitledeliverydate}
            onChange={(e) => onChange(ownerId, e)}
            className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
} 