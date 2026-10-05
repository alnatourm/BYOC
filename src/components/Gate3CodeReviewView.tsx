import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { GateReview } from './gates/GateReview';

export const Gate3CodeReviewView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const runId = currentRun?.id || 'run_default';

  return (
    <GateReview
      gateId={`gate_${runId}_g3`}
      stageNo={3}
      stageTitle="Stage 03: Developer Code Review Gate"
      stageSubtitle="Developer Agent • TSX Output, Import Resolution & Build Verification"
    />
  );
};
