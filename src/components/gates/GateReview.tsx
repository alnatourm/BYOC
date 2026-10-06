import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api';
import { useBYOK } from '../../context/BYOKContext';

function FormattedSpecView({ content }: { content: string }) {
  let parsed: any = null;
  try {
    parsed = typeof content === 'string' ? JSON.parse(content) : content;
  } catch {
    return <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap">{content}</pre>;
  }

  if (typeof parsed !== 'object' || !parsed) {
    return <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap">{content}</pre>;
  }

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Product Title & PRD Summary */}
      <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm text-[#1f242e]">
          <span className="material-symbols-outlined text-[#ea580c]">description</span>
          <span>{parsed.productName || 'Product Specification & PRD'}</span>
        </div>
        <p className="text-stone-700 leading-relaxed font-sans text-xs">
          {parsed.prdSummary || 'No summary provided.'}
        </p>
      </div>

      {/* Business Goals if present */}
      {Array.isArray(parsed.businessGoals) && parsed.businessGoals.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-1.5">
          <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-700">target</span>
            <span>Key Business Goals & Objectives</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 text-stone-700 font-sans text-xs">
            {parsed.businessGoals.map((goal: string, idx: number) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Feature Epics */}
      {Array.isArray(parsed.epics) && parsed.epics.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-bold text-xs text-[#1f242e] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ea580c]">checklist</span>
            <span>Feature Epics & Requirements</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {parsed.epics.map((epic: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1">
                <div className="font-bold text-[#1f242e] flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
                  <span>{epic.epicTitle || `Epic ${idx + 1}`}</span>
                </div>
                <div className="text-stone-600 leading-relaxed text-xs">{epic.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PostgreSQL Database Schema */}
      {Array.isArray(parsed.postgresSchema) && parsed.postgresSchema.length > 0 && (
        <div className="space-y-2 pt-2">
          <h5 className="font-bold text-xs text-[#1f242e] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#0d9488]">dataset</span>
            <span>PostgreSQL Database Schema</span>
          </h5>
          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700">
                <tr>
                  <th className="p-2.5">Table Name</th>
                  <th className="p-2.5">Columns & Data Types</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {parsed.postgresSchema.map((tbl: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-stone-900">{tbl.tableName}</td>
                    <td className="p-2.5 text-stone-600">{tbl.columns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface GateReviewProps {
  gateId: string;
  stageNo: number;
  stageTitle: string;
  stageSubtitle: string;
  lang?: 'en' | 'ar';
}

export const GateReview: React.FC<GateReviewProps> = ({
  gateId,
  stageNo,
  stageTitle,
  stageSubtitle,
  lang = 'en',
}) => {
  const { setCurrentGateStep, refreshData } = useBYOK();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Preflight & Start State
  const [preflightData, setPreflightData] = useState<any>(null);
  const [preflightLoading, setPreflightLoading] = useState<boolean>(false);
  const [starting, setStarting] = useState<boolean>(false);

  // Gate Decision State
  const [decision, setDecision] = useState<'approved' | 'changes_requested' | 'rejected'>('approved');
  const [comment, setComment] = useState<string>('');
  const [submittingDecision, setSubmittingDecision] = useState<boolean>(false);

  // Manual Upload State (Stage 2 Design)
  const [manualContent, setManualContent] = useState<string>('');
  const [manualMime, setManualMime] = useState<'text/html' | 'image/png' | 'application/pdf'>('text/html');
  const [uploading, setUploading] = useState<boolean>(false);

  // View Mode
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Refinement Chat State
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Stage 0${stageNo} AI Assistant. You can chat with me here to request any additions, changes, or adjustments to the generated document before approving.`,
      time: 'Just now',
    },
  ]);

  const handleDownloadArtifact = (art: any) => {
    const filename = `${art.kind || 'specification'}_v${art.version || 1}.md`;
    let fileContent = art.content;
    try {
      const parsed = JSON.parse(art.content);
      if (parsed.prdSummary) {
        fileContent = `# ${parsed.productName || 'Product Specification'}\n\n## PRD Summary\n${parsed.prdSummary}\n\n## Feature Epics\n${(parsed.epics || []).map((e: any) => `- **${e.epicTitle}**: ${e.description}`).join('\n')}\n\n## Database Schema\n${(parsed.postgresSchema || []).map((t: any) => `- Table **${t.tableName}**: ${t.columns}`).join('\n')}`;
      }
    } catch {}

    const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefineDocument = async (customPrompt?: string) => {
    const promptToSubmit = (customPrompt || refinementPrompt).trim();
    if (!data?.run?.id || !promptToSubmit) return;

    const userMsg = { sender: 'user' as const, text: promptToSubmit, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setRefinementPrompt('');
    setRefining(true);

    try {
      const res = await api(`/v1/runs/${data.run.id}/stages/${stageNo}/refine`, {
        method: 'POST',
        body: JSON.stringify({ modificationPrompt: promptToSubmit }),
      });

      await fetchGateData();
      await refreshData();

      const aiMsg = {
        sender: 'ai' as const,
        text: res.aiMessage || `Updated Stage 0${stageNo} document to version v${res.artifact?.version || 2}. Review the updated specification above.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = {
        sender: 'ai' as const,
        text: `⚠️ Refinement Error: ${err.message || 'Failed to refine document.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setRefining(false);
    }
  };

  const isRtl = lang === 'ar';

  const fetchGateData = useCallback(async () => {
    try {
      setError(null);
      const res = await api(`/v1/gates/${gateId}`);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load gate review data.');
    } finally {
      setLoading(false);
    }
  }, [gateId]);

  useEffect(() => {
    fetchGateData();
  }, [fetchGateData]);

  // Polling every 2s while dispatch is running
  useEffect(() => {
    if (!data?.stageRun?.state || !['dispatched', 'running'].includes(data.stageRun.state)) {
      return;
    }
    const timer = setInterval(() => {
      fetchGateData();
    }, 2000);
    return () => clearInterval(timer);
  }, [data?.stageRun?.state, fetchGateData]);

  // Auto-populate BRD summary in chat thread when artifacts load
  useEffect(() => {
    if (data?.artifacts && data.artifacts.length > 0 && chatMessages.length === 1) {
      const art = data.artifacts[0];
      try {
        const parsed = typeof art.content === 'string' ? JSON.parse(art.content) : art.content;
        if (parsed.prdSummary) {
          const brdSummaryMsg = `Welcome! Here is your generated Business Requirements Document (BRD) & Product Specification:\n\n` +
            `📄 **PRD Overview:**\n${parsed.prdSummary}\n\n` +
            `📋 **Feature Scope & Epics:**\n` +
            (parsed.epics || []).map((e: any) => `• **${e.epicTitle}**: ${e.description}`).join('\n') +
            `\n\n🗄️ **Database Tables:**\n` +
            (parsed.postgresSchema || []).map((t: any) => `• \`${t.tableName}\`: ${t.columns}`).join('\n') +
            `\n\nIf you want any additions or modifications, type your request below or click a quick spark button!`;

          setChatMessages([
            { sender: 'ai', text: brdSummaryMsg, time: 'Just now' }
          ]);
        }
      } catch {}
    }
  }, [data?.artifacts, chatMessages.length]);

  // Run Preflight when stage is awaiting_start
  const handleRunPreflight = async () => {
    if (!data?.run?.id) return;
    try {
      setPreflightLoading(true);
      const res = await api(`/v1/runs/${data.run.id}/stages/${stageNo}/preflight`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setPreflightData(res);
    } catch (err: any) {
      setPreflightData(err.data || { success: false, checks: [] });
    } finally {
      setPreflightLoading(false);
    }
  };

  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [verifyTokenInput, setVerifyTokenInput] = useState<string>('');

  const handleResendVerification = async () => {
    try {
      setPreflightLoading(true);
      setResendStatus(null);
      await api('/v1/auth/resend-verification', { method: 'POST' });
      setResendStatus('Verification link sent! Check server logs or your email inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setPreflightLoading(false);
    }
  };

  const handleVerifyTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) return;
    try {
      setPreflightLoading(true);
      await api('/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token: verifyTokenInput.trim() }),
      });
      setVerifyTokenInput('');
      setResendStatus('Email verified successfully!');
      await handleRunPreflight();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification token.');
    } finally {
      setPreflightLoading(false);
    }
  };

  const handleStartStage = async () => {
    if (!data?.run?.id) return;
    try {
      setStarting(true);
      const idempotencyKey = `idemp_start_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
      await api(`/v1/runs/${data.run.id}/stages/${stageNo}/start`, {
        method: 'POST',
        idempotencyKey,
        body: JSON.stringify({}),
      });
      await fetchGateData();
    } catch (err: any) {
      setError(err.message || 'Failed to start stage.');
    } finally {
      setStarting(false);
    }
  };

  const handleGateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((decision === 'changes_requested' || decision === 'rejected') && !comment.trim()) {
      setError('A comment is required when requesting changes or rejecting.');
      return;
    }

    try {
      setSubmittingDecision(true);
      setError(null);
      await api(`/v1/gates/${gateId}/decision`, {
        method: 'POST',
        body: JSON.stringify({ decision, comment }),
      });
      await fetchGateData();
      await refreshData();

      if (decision === 'approved' && stageNo < 5) {
        const nextGate = `gate${stageNo + 1}` as any;
        setCurrentGateStep(nextGate);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record gate decision.');
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.run?.id || !manualContent.trim()) return;

    try {
      setUploading(true);
      setError(null);
      await api(`/v1/runs/${data.run.id}/stages/2/artifacts/upload`, {
        method: 'POST',
        body: JSON.stringify({ content: manualContent, mime: manualMime }),
      });
      setManualContent('');
      await fetchGateData();
    } catch (err: any) {
      setError(err.message || 'Failed to upload manual design export.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-stone-500 font-mono animate-pulse">
        Loading Gate {stageNo} Data...
      </div>
    );
  }

  const gate = data?.gate;
  const stageRun = data?.stageRun;
  const run = data?.run;
  const artifacts = data?.artifacts || [];
  const evidence = data?.evidence || [];

  const isVoid = gate?.status === 'void';
  const isApproved = gate?.status === 'approved';
  const isPending = gate?.status === 'pending' || gate?.status === 'changes_requested';

  return (
    <div className={`flex flex-col w-full pb-24 font-sans text-[#1c212c] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              Gate 0{stageNo} Review
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-mono">Run: {run?.title || run?.id}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#1c212c]">{stageTitle}</h1>
          <p className="text-xs text-stone-600 mt-0.5 font-medium">{stageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {stageRun?.state && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono ${
                stageRun.state === 'running'
                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                  : stageRun.state === 'awaiting_review'
                  ? 'bg-amber-100 text-amber-800'
                  : stageRun.state === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : stageRun.state === 'failed'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              Stage State: {stageRun.state}
            </span>
          )}

          {gate?.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono ${
                gate.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : gate.status === 'void'
                  ? 'bg-rose-950 text-rose-200 border border-rose-800'
                  : gate.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Gate Status: {gate.status}
            </span>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-6 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900 text-sm font-bold">×</button>
        </div>
      )}

      {/* VOID Status Alert Banner */}
      {isVoid && (
        <div className="p-5 rounded-2xl bg-rose-950 border-2 border-rose-800 text-rose-100 space-y-2 mb-6 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-rose-300">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>GATE VOIDED / إبطال الموافقة</span>
          </div>
          <p className="text-xs text-rose-200">
            {gate.comment || 'This gate approval has been voided because upstream artifacts or gate decisions were modified.'}
          </p>
          <div className="text-[11px] text-rose-400 font-mono">
            Re-approval is required before downstream stages can be dispatched.
          </div>
        </div>
      )}

      {/* Intent Brief Card */}
      {run?.intent && (
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-6 text-xs text-stone-700 font-medium">
          <span className="font-bold text-stone-900">Run Primary Intent:</span> {run.intent}
        </div>
      )}

      {/* AWAITING START PANEL */}
      {stageRun?.state === 'awaiting_start' && (
        <div className="p-6 bg-white rounded-2xl border-2 border-amber-500 shadow-sm space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-[#1c212c] flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">play_circle</span>
              <span>Start Stage 0{stageNo} Dispatch</span>
            </h3>

            <button
              onClick={handleRunPreflight}
              disabled={preflightLoading}
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
            >
              {preflightLoading ? 'Running Preflight...' : 'Run Preflight Check'}
            </button>
          </div>

          {/* Preflight Checks List */}
          {preflightData && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="font-bold text-stone-900 flex items-center justify-between">
                <span>Preflight Status:</span>
                <span className={preflightData.success ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {preflightData.success ? 'PASSED ✓' : 'BLOCKED ✕'}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                {(preflightData.checks || []).map((c: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-mono text-stone-600">{c.checkName}:</span>
                    <div className="flex items-center gap-2">
                      {c.checkName === 'email_verified' && !c.passed && (
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer shadow-2xs"
                          >
                            Resend Verification Email
                          </button>
                          <form onSubmit={handleVerifyTokenSubmit} className="flex items-center gap-1 mt-1">
                            <input
                              type="text"
                              value={verifyTokenInput}
                              onChange={(e) => setVerifyTokenInput(e.target.value)}
                              placeholder="Paste token..."
                              className="px-2 py-0.5 rounded border border-stone-300 text-[10px] font-mono w-28 bg-white outline-none focus:border-amber-600"
                            />
                            <button
                              type="submit"
                              className="px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Verify
                            </button>
                          </form>
                          {resendStatus && <span className="text-[10px] text-emerald-700 font-bold">{resendStatus}</span>}
                        </div>
                      )}
                      <span className={c.passed ? 'text-emerald-700 font-bold' : 'text-rose-700 font-semibold'}>
                        {c.passed ? 'Pass ✓' : `Fail: ${c.reason || 'Blocked'}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartStage}
              disabled={starting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {starting ? 'Enqueueing Dispatch...' : `🚀 Start Stage 0${stageNo} Execution`}
            </button>
          </div>
        </div>
      )}

      {/* FAILED STAGE PANEL */}
      {stageRun?.state === 'failed' && (
        <div className="p-6 bg-white rounded-2xl border-2 border-rose-500 shadow-sm space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-rose-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">error</span>
              <span>Stage 0{stageNo} Execution Failed / تعثر تنفيذ المرحلة</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs uppercase font-mono">
              FAILED
            </span>
          </div>

          <p className="text-xs text-rose-700 font-medium">
            The previous stage attempt failed (e.g. before email verification). Now that your requirements are ready, click below to retry stage execution.
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartStage}
              disabled={starting}
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>{starting ? 'Enqueueing Dispatch...' : `🔄 Retry Stage 0${stageNo} Execution • إعادة المحاولة`}</span>
            </button>
          </div>
        </div>
      )}

      {/* RUNNING DISPATCH PROGRESS */}
      {['dispatched', 'running'].includes(stageRun?.state) && (
        <div className="p-8 bg-white rounded-2xl border border-blue-200 text-center space-y-3 shadow-xs mb-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
          </div>
          <h3 className="font-bold text-sm text-[#1c212c]">Stage 0{stageNo} Execution In Progress</h3>
          <p className="text-xs text-stone-500 font-mono">
            Background worker is executing LLM agent dispatch. Auto-refreshing every 2 seconds...
          </p>
        </div>
      )}

      {/* STAGE ARTIFACT OUTPUT */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-base text-[#1c212c] flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600">article</span>
          <span>Stage Output & Artifacts</span>
        </h3>

        {artifacts.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-500 font-mono">
            No data yet. This appears after the stage runs.
          </div>
        ) : (
          <div className="space-y-4">
            {artifacts.map((art: any) => (
              <div key={art.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs border-b border-stone-100 pb-3 gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-stone-900">{art.kind}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-[#ea580c] font-bold">v{art.version}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
                      SHA-256: {art.sha256.slice(0, 16)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadArtifact(art)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download Document (.md) • تحميل المستند</span>
                    </button>
                  </div>
                </div>

                {/* Render artifact based on MIME / Kind */}
                {art.mime === 'text/html' ? (
                  <iframe
                    srcDoc={art.content}
                    sandbox=""
                    title={`Artifact ${art.id}`}
                    className="w-full h-80 rounded-xl border border-stone-200 bg-white"
                  />
                ) : art.mime === 'image/png' ? (
                  <img src={art.content} alt="Design Artifact" className="max-h-96 rounded-xl border border-stone-200 mx-auto" />
                ) : art.kind === 'spec_output' || art.content.includes('prdSummary') ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-200 text-xs">
                      <span className="font-bold text-stone-700">Display View Format:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('formatted')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                            viewMode === 'formatted' ? 'bg-[#ea580c] text-white shadow-2xs' : 'bg-white text-stone-600 border border-stone-200'
                          }`}
                        >
                          📄 Formatted PRD Document View
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('raw')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                            viewMode === 'raw' ? 'bg-[#ea580c] text-white shadow-2xs' : 'bg-white text-stone-600 border border-stone-200'
                          }`}
                        >
                          💻 Raw JSON & SHA Evidence
                        </button>
                      </div>
                    </div>

                    {viewMode === 'formatted' ? (
                      <FormattedSpecView content={art.content} />
                    ) : (
                      <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto max-h-96 whitespace-pre-wrap">
                        {art.content}
                      </pre>
                    )}
                  </div>
                ) : (
                  <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto max-h-96 whitespace-pre-wrap">
                    {art.content}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}

      {/* INTERACTIVE GEMINI AI STAGE REFINEMENT CHAT */}
      {artifacts.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-[#e5e3dd] shadow-xs space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e3dd] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c]">chat</span>
                <h3 className="font-bold text-sm text-[#1f242e]">
                  Chat with AI to Modify Document • النقاش والتعديل مع الذكاء الاصطناعي
                </h3>
              </div>
              <p className="text-xs text-[#554336] mt-0.5">
                Need additions or changes before approving? Type your request below and Gemini AI will instantly update the document above.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold font-mono shrink-0 self-start sm:self-auto">
              Stage 0{stageNo} Assistant Active
            </span>
          </div>

          {/* Chat Messages Thread */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5e3dd] space-y-3 max-h-72 overflow-y-auto font-sans">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#887364] font-medium">
                  <span>{msg.sender === 'user' ? 'You (Reviewer)' : `Stage 0${stageNo} AI Agent`}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#ea580c] text-white rounded-tr-none font-medium'
                      : 'bg-white border border-[#e5e3dd] text-[#1f242e] rounded-tl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {refining && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#e5e3dd] text-xs text-[#ea580c] font-bold animate-pulse">
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                <span>Gemini AI is updating your document specifications...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#887364] font-semibold">Quick modification sparks:</span>
            <button
              type="button"
              onClick={() => handleRefineDocument('Please add WhatsApp appointment reminders and status notifications epic.')}
              className="px-2.5 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100 border border-[#e5e3dd] text-[#1f242e] text-xs transition cursor-pointer"
            >
              📱 Add WhatsApp reminders
            </button>
            <button
              type="button"
              onClick={() => handleRefineDocument('Please include online payment integration for Apple Pay and Mada checkout.')}
              className="px-2.5 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100 border border-[#e5e3dd] text-[#1f242e] text-xs transition cursor-pointer"
            >
              💳 Include Apple Pay & Mada
            </button>
            <button
              type="button"
              onClick={() => handleRefineDocument('Please add Arabic PDF invoice receipt generation and tax fields.')}
              className="px-2.5 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100 border border-[#e5e3dd] text-[#1f242e] text-xs transition cursor-pointer"
            >
              📄 Add Arabic invoice PDF
            </button>
          </div>

          {/* Interactive Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRefineDocument();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              placeholder="e.g. Please add a discount promo code feature or modify the database schema..."
              className="flex-1 p-3 rounded-xl border border-[#e5e3dd] bg-[#faf8f5] focus:bg-white focus:border-[#ea580c] text-xs outline-none text-[#1f242e]"
            />
            <button
              type="submit"
              disabled={refining || !refinementPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{refining ? 'Updating...' : 'Send & Update Document'}</span>
            </button>
          </form>
        </div>
      )}

        {/* MANUAL GOOGLE STITCH DESIGN UPLOAD (STAGE 2) */}
        {stageNo === 2 && (
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3 mt-4">
            <h4 className="font-bold text-xs text-stone-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">upload_file</span>
              <span>Manual Google Stitch Export Upload (Stage 2)</span>
            </h4>
            <form onSubmit={handleManualUpload} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={manualMime}
                  onChange={(e: any) => setManualMime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
                >
                  <option value="text/html">text/html</option>
                  <option value="image/png">image/png</option>
                  <option value="application/pdf">application/pdf</option>
                </select>
              </div>
              <textarea
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="Paste raw Google Stitch HTML / layout export content here..."
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs font-mono bg-white outline-none focus:border-amber-600"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading || !manualContent.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Upload Design Export'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* QC SPECIFIC STATUS CHIP (STAGE 4) */}
      {stageNo === 4 && (
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-stone-900">QC Security & Diagnostic Status</span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs font-mono">
              PASSED_STATIC_ONLY
            </span>
          </div>
          <p className="text-xs text-stone-600 italic">
            Note: Dynamic browser sandbox UI tests were not executed (static analysis & evidence evaluation only).
          </p>
        </div>
      )}

      {/* EVIDENCE TABLE */}
      <div className="space-y-4 mt-8">
        <h3 className="font-display font-bold text-base text-[#1c212c] flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600">verified</span>
          <span>Collected Diagnostic Evidence</span>
        </h3>

        {evidence.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 font-mono text-center">
            No evidence rows collected yet.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700">
                <tr>
                  <th className="p-3.5">Check Name</th>
                  <th className="p-3.5">Required</th>
                  <th className="p-3.5">Executed</th>
                  <th className="p-3.5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {evidence.map((ev: any) => (
                  <tr key={ev.id}>
                    <td className="p-3.5 font-bold text-stone-900">{ev.checkName}</td>
                    <td className="p-3.5">{ev.required ? 'YES' : 'NO'}</td>
                    <td className="p-3.5 font-bold">{ev.executed ? 'YES ✓' : 'NOT EXECUTED'}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          ev.result === 'pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.result === 'fail'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {ev.result.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI OPINION PANEL (NOT EVIDENCE) */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 mt-8">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>AI opinion (not evidence)</span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-mono">
          Model output represents machine generated analysis. Human authorization at Gate 0{stageNo} is required to certify approval.
        </p>
      </div>

      {/* HUMAN DECISION FORM */}
      <div className="p-6 bg-white rounded-2xl border-2 border-stone-300 shadow-sm space-y-4 mt-8">
        <h3 className="font-display font-bold text-sm text-[#1c212c]">
          Human Approval Gate 0{stageNo} Decision
        </h3>

        {isApproved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            Approved ✓ Decision recorded by tenant reviewer.
          </div>
        )}

        {isApproved && stageNo < 5 && (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Gate 0{stageNo} Approved & Verified!</h4>
                <p className="text-xs text-emerald-800">
                  {stageNo === 1
                    ? 'Specs & PRD approved. Stage 02: UI/UX Design Gate is now unlocked.'
                    : `Stage 0${stageNo} approved. Stage 0${stageNo + 1} is now unlocked.`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextGate = `gate${stageNo + 1}` as any;
                setCurrentGateStep(nextGate);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Proceed to Stage 0{stageNo + 1} Gate →</span>
            </button>
          </div>
        )}

        <form onSubmit={handleGateDecision} className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDecision('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                decision === 'approved' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              Approve Gate 0{stageNo}
            </button>

            <button
              type="button"
              onClick={() => setDecision('changes_requested')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                decision === 'changes_requested' ? 'bg-amber-600 text-white border-amber-600' : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              Request Changes
            </button>

            <button
              type="button"
              onClick={() => setDecision('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                decision === 'rejected' ? 'bg-rose-600 text-white border-rose-600' : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              Reject Gate
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Reviewer Comment {(decision === 'changes_requested' || decision === 'rejected') && <span className="text-rose-600">*</span>}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter review decision notes..."
              rows={3}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs font-mono outline-none focus:border-amber-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingDecision || !isPending}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer"
            >
              {submittingDecision ? 'Recording Decision...' : `Submit Gate 0${stageNo} Decision`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
