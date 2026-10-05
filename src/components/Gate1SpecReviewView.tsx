import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { GateReview } from './gates/GateReview';

export const Gate1SpecReviewView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const runId = currentRun?.id || 'run_default';

  return (
    <GateReview
      gateId={`gate_${runId}_g1`}
      stageNo={1}
      stageTitle="Stage 01: Product & Spec Gate"
      stageSubtitle="Product & Spec Agent • PRD, Epics, & Database Schema Verification"
    />
  );
};
