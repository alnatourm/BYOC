import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const ArtifactInspectorModal: React.FC = () => {
  const { selectedArtifact, setSelectedArtifact } = useBYOK();

  if (!selectedArtifact) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-bold text-base text-[#1f242e]">{selectedArtifact.title || 'Stage Artifact'}</h3>
          <button onClick={() => setSelectedArtifact(null)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl font-mono text-xs overflow-x-auto max-h-60">
          <pre>{JSON.stringify(selectedArtifact, null, 2)}</pre>
        </div>
        <button
          onClick={() => setSelectedArtifact(null)}
          className="w-full py-2 rounded-xl bg-[#d97706] text-white font-bold text-xs"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
