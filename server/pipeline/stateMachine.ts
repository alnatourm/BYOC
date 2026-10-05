import { logAuditEvent } from '../audit/chain';

export type StageState =
  | 'draft'
  | 'awaiting_start'
  | 'verifying'
  | 'blocked'
  | 'dispatched'
  | 'running'
  | 'output_received'
  | 'evidence_check'
  | 'awaiting_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'failed'
  | 'cancelled';

export type TransitionActor = 'user' | 'system' | 'agent_callback';

interface StateTransitionRule {
  from: StageState;
  to: StageState;
  allowedActors: TransitionActor[];
}

const ALLOWED_TRANSITIONS: StateTransitionRule[] = [
  { from: 'draft', to: 'awaiting_start', allowedActors: ['user', 'system'] },
  { from: 'awaiting_start', to: 'verifying', allowedActors: ['user'] },
  { from: 'verifying', to: 'blocked', allowedActors: ['system'] },
  { from: 'verifying', to: 'dispatched', allowedActors: ['system'] },
  { from: 'dispatched', to: 'running', allowedActors: ['system', 'agent_callback'] },
  { from: 'running', to: 'output_received', allowedActors: ['system', 'agent_callback'] },
  { from: 'running', to: 'failed', allowedActors: ['system'] },
  { from: 'output_received', to: 'evidence_check', allowedActors: ['system'] },
  { from: 'evidence_check', to: 'awaiting_review', allowedActors: ['system'] },
  { from: 'evidence_check', to: 'failed', allowedActors: ['system'] },
  { from: 'awaiting_review', to: 'approved', allowedActors: ['user'] },
  { from: 'awaiting_review', to: 'changes_requested', allowedActors: ['user'] },
  { from: 'awaiting_review', to: 'rejected', allowedActors: ['user'] },
  { from: 'blocked', to: 'awaiting_start', allowedActors: ['user', 'system'] },
  { from: 'failed', to: 'awaiting_start', allowedActors: ['user'] },
  { from: 'changes_requested', to: 'awaiting_start', allowedActors: ['user'] },
  { from: 'rejected', to: 'cancelled', allowedActors: ['user', 'system'] },
];

export function isTransitionAllowed(from: StageState, to: StageState, actor: TransitionActor): boolean {
  return ALLOWED_TRANSITIONS.some(
    (rule) => rule.from === from && rule.to === to && rule.allowedActors.includes(actor)
  );
}

export async function transitionStageState(
  tenantId: string,
  actorUserId: string | null,
  actorType: TransitionActor,
  stageRunId: string,
  currentState: StageState,
  targetState: StageState,
  contextData: Record<string, any> = {}
): Promise<StageState> {
  if (!isTransitionAllowed(currentState, targetState, actorType)) {
    throw new Error(
      `ILLEGAL_TRANSITION_409: Cannot transition stage_run ${stageRunId} from '${currentState}' to '${targetState}' via actor '${actorType}'.`
    );
  }

  await logAuditEvent(tenantId, actorUserId, 'stage_state_transition', 'stage_run', {
    stageRunId,
    fromState: currentState,
    toState: targetState,
    actorType,
    ...contextData,
  });

  return targetState;
}
