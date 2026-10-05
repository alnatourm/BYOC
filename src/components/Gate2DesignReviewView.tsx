import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { GateReview } from './gates/GateReview';

export const Gate2DesignReviewView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const runId = currentRun?.id || 'run_default';

  return (
    <GateReview
      gateId={`gate_${runId}_g2`}
      stageNo={2}
      stageTitle="Stage 02: Design Gate"
      stageSubtitle="Designer Agent • Google Stitch Export & UI Component Verification"
    />
  );
};
