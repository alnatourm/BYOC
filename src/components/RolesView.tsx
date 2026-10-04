import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Gate1SpecReviewView } from './Gate1SpecReviewView';
import { Gate2DesignReviewView } from './Gate2DesignReviewView';
import { Gate3CodeReviewView } from './Gate3CodeReviewView';
import { Gate4QCSecurityView } from './Gate4QCSecurityView';
import { Gate5CloudDeployView } from './Gate5CloudDeployView';

export const RolesView: React.FC = () => {
  const { currentGateStep, selectedArtifact } = useBYOK();

  if (currentGateStep === 'gate1') {
    return <Gate1SpecReviewView />;
  }

  if (currentGateStep === 'gate2') {
    return <Gate2DesignReviewView />;
  }

  if (currentGateStep === 'gate3') {
    return <Gate3CodeReviewView />;
  }

  if (currentGateStep === 'gate4') {
    return <Gate4QCSecurityView />;
  }

  if (currentGateStep === ('gate5' as any)) {
    return <Gate5CloudDeployView />;
  }

  // If completed, show live preview
  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#18181b]">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                🚀 Live Application Active
              </span>
              <span className="text-xs text-[#887364] font-bold font-mono">ALL 5 GATES PASSED ✓</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-[#18181b] mt-1">
              {selectedArtifact?.title || 'VaultSign OS'}
            </h1>
          </div>
        </div>

        <div className="w-full bg-stone-50 p-4 rounded-2xl border border-stone-200 min-h-[500px]">
          <Gate5CloudDeployView />
        </div>
      </div>
    </div>
  );
};
