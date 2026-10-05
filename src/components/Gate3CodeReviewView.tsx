import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate3CodeReviewView: React.FC = () => {
  const { setCurrentGateStep } = useBYOK();

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-stone-100">
        <div>
          <h2 className="font-bold text-lg text-[#1f242e]">Stage 03: Full-Stack React 19 Developer</h2>
          <p className="text-xs text-stone-500">TypeScript component structure and state handlers.</p>
        </div>
        <button
          onClick={() => setCurrentGateStep('gate4')}
          className="px-4 py-2 bg-[#d97706] text-white rounded-xl font-bold text-xs"
        >
          Approve Code & Proceed to Gate 4 →
        </button>
      </div>

      <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto max-h-48">
        <pre><code>{`// Generated TSX React 19 Component Output
export function SameerSaloonApp() {
  return <div className="p-4 bg-amber-50 text-amber-900">Sameer Saloon App</div>;
}`}</code></pre>
      </div>
    </div>
  );
};
