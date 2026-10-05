import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { GateReview } from './gates/GateReview';

export const Gate4QCSecurityView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const runId = currentRun?.id || 'run_default';

  return (
    <GateReview
      gateId={`gate_${runId}_g4`}
      stageNo={4}
      stageTitle="Stage 04: QC & Security Gate"
      stageSubtitle="QC Agent • Static Diagnostic & Security Evidence Verification"
    />
  );
};
