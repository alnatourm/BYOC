import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate2DesignReviewView: React.FC = () => {
  const { setCurrentGateStep } = useBYOK();

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-stone-100">
        <div>
          <h2 className="font-bold text-lg text-[#1f242e]">Stage 02: Google Stitch UI/UX Designer</h2>
          <p className="text-xs text-stone-500">Visual layout, palette, and component hierarchy.</p>
        </div>
        <button
          onClick={() => setCurrentGateStep('gate3')}
          className="px-4 py-2 bg-[#d97706] text-white rounded-xl font-bold text-xs"
        >
          Approve Design & Proceed to Gate 3 →
        </button>
      </div>

      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
        <p className="font-bold text-stone-800">Stage Artifact Rendering (Sandboxed Preview)</p>
        <iframe
          srcDoc="<div style='padding:20px;font-family:sans-serif;background:#fff;color:#d97706;'><h2>Sameer Saloon Gold & White Preview</h2><p>Haircut & Grooming Menu Wireframe</p></div>"
          sandbox=""
          className="w-full h-40 border border-stone-300 rounded-lg mt-2 bg-white"
          title="Design Preview"
        />
      </div>
    </div>
  );
};
