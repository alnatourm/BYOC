import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { GateReview } from './gates/GateReview';

export const Gate5CloudDeployView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const runId = currentRun?.id || 'run_default';

  return (
    <GateReview
      gateId={`gate_${runId}_g5`}
      stageNo={5}
      stageTitle="Stage 05: Release & Deployment Gate"
      stageSubtitle="Release Agent • Hosting Connection Selection & Deployment Planning"
    />
  );
};
