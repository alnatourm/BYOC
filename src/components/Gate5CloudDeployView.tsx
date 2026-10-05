import React, { useState, useEffect } from 'react';
import { useBYOK } from '../context/BYOKContext';

interface HostingConnection {
  id: string;
  type: string;
  label: string;
  verified: boolean;
  capabilities: {
    backups: { supported: boolean; automated: boolean; note: string };
    spendCaps: { supported: boolean; hardCap: boolean; note: string };
    predictablePricing: { score: number; note: string };
  };
}

interface PriceQuote {
  id: string;
  provider: string;
  planLabel: string;
  amountUsd: number;
  currency: string;
  stale: boolean;
}

export const Gate5CloudDeployView: React.FC = () => {
  const { runs, activeRunId } = useBYOK();
  const currentRun = runs.find((r) => r.id === activeRunId) || runs[0];
  const [connections, setConnections] = useState<HostingConnection[]>([]);
  const [quotes, setQuotes] = useState<PriceQuote[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [planning, setPlanning] = useState<boolean>(false);
  const [planSuccess, setPlanSuccess] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [connRes, quoteRes] = await Promise.all([
          fetch('/v1/hosting-connections', { credentials: 'include' }),
          fetch('/v1/quotes', { credentials: 'include' }),
        ]);

        if (connRes.ok) {
          const data = await connRes.json();
          const verifiedList = (data.connections || []).filter((c: HostingConnection) => c.verified);
          setConnections(verifiedList);
          if (verifiedList.length > 0) {
            setSelectedConnectionId(verifiedList[0].id);
          }
        }

        if (quoteRes.ok) {
          const data = await quoteRes.json();
          setQuotes(data.quotes || []);
        }
      } catch (err) {
        console.error('Failed to load hosting data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApprovePlan = async () => {
    if (!selectedConnectionId || !currentRun) return;
    try {
      setPlanning(true);
      const res = await fetch('/v1/deployments/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (window as any).__CSRF_TOKEN__ || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          runId: currentRun.id,
          hostingConnectionId: selectedConnectionId,
        }),
      });

      if (res.ok) {
        setPlanSuccess(true);
        setToastMsg('Deployment plan created successfully.');
      } else {
        const errData = await res.json();
        setToastMsg(`Error: ${errData.error || 'Failed to create deployment plan'}`);
      }
    } catch {
      setToastMsg('Error creating deployment plan');
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Banner */}
      <div className="bg-amber-50 border-b border-amber-200 p-4 text-amber-900 font-medium text-xs text-center font-mono">
        Plan only. Real deployment arrives in Phase 2.
      </div>

      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border border-stone-300 p-4 rounded-xl shadow-lg z-50 text-xs font-semibold">
          {toastMsg}
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto space-y-6 w-full">
        <div>
          <h2 className="text-xl font-bold font-display">Gate 5: Release & Deploy Plan</h2>
          <p className="text-xs text-stone-600 mt-1">
            Review verified hosting target capabilities, pricing quotes, and plan deployment topology.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500 font-mono">Loading hosting connections & quotes...</div>
        ) : connections.length === 0 ? (
          <div className="p-6 bg-white border border-stone-200 rounded-2xl text-xs text-stone-600">
            No verified hosting connections available. Please add and verify a hosting connection in Settings before approving deployment plan.
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-sm">Verified Hosting Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((conn) => {
                const matchingQuote = quotes.find((q) => q.provider.toLowerCase().includes(conn.type.split('_')[0]));
                return (
                  <div
                    key={conn.id}
                    onClick={() => setSelectedConnectionId(conn.id)}
                    className={`p-4 rounded-2xl border cursor-pointer space-y-3 transition ${
                      selectedConnectionId === conn.id
                        ? 'border-2 border-amber-600 bg-amber-50/50'
                        : 'border-stone-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{conn.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Verified
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <div>
                        Estimated Cost:{' '}
                        {matchingQuote ? (
                          <span className="font-bold font-mono">
                            ${matchingQuote.amountUsd} {matchingQuote.currency}/mo
                            {matchingQuote.stale && <span className="text-amber-600 ml-1">(stale)</span>}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">No quote loaded</span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1">
                        <div className="font-semibold text-stone-700">Capabilities & Gaps:</div>
                        <ul className="list-disc pl-4 text-stone-600 space-y-0.5">
                          <li>
                            Backups: {conn.capabilities?.backups?.note || 'Backups exist but must be enabled and an offsite dump is required.'}
                          </li>
                          <li>
                            Spend Caps: {conn.capabilities?.spendCaps?.note || 'Verify spending alerts and monthly thresholds.'}
                          </li>
                          <li>
                            Predictability: {conn.capabilities?.predictablePricing?.note || 'Fixed compute tier vs usage variable.'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {planSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                Deployment plan created. Plan only. Real deployment arrives in Phase 2.
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleApprovePlan}
                disabled={planning || !selectedConnectionId}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition disabled:opacity-50"
              >
                {planning ? 'Planning...' : 'Approve deployment plan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
