import React from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const AddRoleModal: React.FC = () => {
  const { isAddRoleOpen, setIsAddRoleOpen } = useBYOK();

  if (!isAddRoleOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-bold text-base text-[#1f242e]">Role Slot Information</h3>
          <button onClick={() => setIsAddRoleOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>
        <p className="text-xs text-stone-600">
          Roles are seeded from versioned instruction templates in the database (`instruction_versions`).
        </p>
        <button
          onClick={() => setIsAddRoleOpen(false)}
          className="w-full py-2 rounded-xl bg-[#d97706] text-white font-bold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
