import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Gate1SpecReviewView } from './Gate1SpecReviewView';
import { Gate2DesignReviewView } from './Gate2DesignReviewView';
import { Gate3CodeReviewView } from './Gate3CodeReviewView';
import { Gate4QCSecurityView } from './Gate4QCSecurityView';
import { Gate5CloudDeployView } from './Gate5CloudDeployView';

export const BuildSuiteView: React.FC = () => {
  const { currentGateStep, setCurrentGateStep, setIsCreateProjectOpen } = useBYOK();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#1f242e]">Governed 5-Role Software Assembly Pipeline</h2>
          <p className="text-xs text-stone-500 mt-1">Human-in-the-loop approval gate on every stage before downstream dispatch.</p>
        </div>
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Software Run</span>
        </button>
      </div>

      {/* Stepper Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-stone-200 gap-2 overflow-x-auto text-xs font-bold shadow-xs">
        {[
          { id: 'gate1', label: '01. Spec Review' },
          { id: 'gate2', label: '02. UI/UX Design' },
          { id: 'gate3', label: '03. Code Review' },
          { id: 'gate4', label: '04. QC Audit' },
          { id: 'gate5', label: '05. Release Deploy' },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setCurrentGateStep(g.id as any)}
            className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              currentGateStep === g.id ? 'bg-[#d97706] text-white shadow-xs' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Render Active Gate View */}
      {currentGateStep === 'gate1' && <Gate1SpecReviewView />}
      {currentGateStep === 'gate2' && <Gate2DesignReviewView />}
      {currentGateStep === 'gate3' && <Gate3CodeReviewView />}
      {currentGateStep === 'gate4' && <Gate4QCSecurityView />}
      {currentGateStep === 'gate5' && <Gate5CloudDeployView />}
    </div>
  );
};
