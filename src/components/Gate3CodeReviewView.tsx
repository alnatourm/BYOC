import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate3CodeReviewView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [activeCodeTab, setActiveCodeTab] = useState<'preview' | 'code' | 'plain'>('preview');
  const [selectedFile, setSelectedFile] = useState<string>('DocumentVault.tsx');
  const [isApproving, setIsApproving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [tweakInput, setTweakInput] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate3 = () => {
    setIsApproving(true);
    showToast('✅ Gate 3 Approved! Transitioning to Gate 4 (QC & Security Audit)...');
    setTimeout(() => {
      setIsApproving(false);
      setCurrentGateStep('gate4');
    }, 600);
  };

  const handleTweakNour = () => {
    if (!tweakInput.trim()) {
      showToast('Please type a code adjustment prompt first.');
      return;
    }
    showToast(`Nour is synthesizing adjustments: "${tweakInput}"... Code updated in 2s.`);
    setTweakInput('');
  };

  const codeSnippets: Record<string, string> = {
    'DocumentVault.tsx': `'use server';

// OGroup AI Factory - Synthesized Component: DocumentVault.tsx
// Architecture: React 19 Server Component with Concurrent Optimistic Mutations

import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DocumentRow } from './DocumentRow';

export async function DocumentVault({ tenantId }: { tenantId: string }) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SERVICE_KEY!);
  const { data: docs, error } = await supabase
    .from('documents')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(\`Vault fetch failure: \${error.message}\`);

  return (
    <section className="w-full flex flex-col gap-4 p-6 bg-white rounded-2xl border border-stone-200">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-[#18181b]">Bilingual Vault / خزانة العقود</h2>
        <span className="text-xs font-mono font-bold text-teal-700">{docs?.length || 142} Active Records</span>
      </div>
      <Suspense fallback={<div className="p-8 text-center animate-pulse text-stone-500">Loading encrypted docs...</div>}>
        <div className="space-y-2">
          {docs?.map((doc: any) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </div>
      </Suspense>
    </section>
  );
}`,
    'SignModalWithOTP.tsx': `'use client';

import { useState } from 'react';

export function SignModalWithOTP({ docId, phoneNumber }: { docId: string; phoneNumber: string }) {
  const [otp, setOtp] = useState('');
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="font-display font-bold text-lg text-[#18181b]">Confirm Signature via Nafath</h3>
        <p className="text-xs text-stone-500">Verification code sent to {phoneNumber}</p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="0 0 0 0 0 0"
          className="w-full text-center tracking-widest text-2xl py-3 rounded-xl bg-stone-50 border border-stone-200 font-mono"
        />
        <button
          disabled={isPending || otp.length < 4}
          className="w-full py-3 rounded-xl bg-[#ea580c] text-white font-bold shadow-md hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? 'Verifying with Nafath...' : 'Authorize Digital Stamp'}
        </button>
      </div>
    </div>
  );
}`,
    'AuditLedgerTable.tsx': `'use server';

export async function AuditLedgerTable({ docId }: { docId: string }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4 border border-stone-200">
      <h4 className="font-bold text-sm text-[#18181b]">SHA-256 Chain of Custody</h4>
      <div className="mt-2 space-y-1 font-mono text-xs text-stone-600">
        <div className="flex justify-between py-1 border-b border-stone-200">
          <span>EVENT: UPLOAD</span>
          <span className="text-teal-700 font-bold">HASH: 7f83...bc41 (MATCH)</span>
        </div>
        <div className="flex justify-between py-1 border-b border-stone-200">
          <span>EVENT: NAFATH_AUTH</span>
          <span className="text-teal-700 font-bold">HASH: 99a1...12ef (VALID)</span>
        </div>
      </div>
    </div>
  );
}`,
    'schema.prisma': `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Document {
  id           String       @id @default(uuid())
  tenantId     String       @map("tenant_id")
  titleEn      String       @map("title_en")
  titleAr      String       @map("title_ar")
  sha256Hash   String       @map("sha256_hash")
  status       SignStatus   @default(PENDING_OTP)
  createdAt    DateTime     @default(now()) @map("created_at")

  @@index([tenantId])
  @@map("documents")
}`
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#18181b] bg-[#f9f8f6] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#ea580c] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#18181b] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#ea580c] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#ea580c]">Gate 3 Update</p>
            <p className="text-xs text-[#554336]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Metadata Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e5e4de] shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#ea580c] font-bold">
              PROJECT {selectedArtifact?.title ? selectedArtifact.title.substring(0, 15) : 'PRJ-8842'}
            </span>
            <span className="text-stone-300">/</span>
            <span className="font-display text-sm font-bold text-[#18181b]">VaultSign OS</span>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 font-bold text-[#18181b]">Bilingual v1.2</span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 text-teal-700 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Spec & Design locked from Gate 1 & Gate 2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-[#ea580c] font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-ping"></span>
              Gate 3 Mandatory Approval • اعتماد بشري إلزامي للكود
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 font-mono text-xs text-stone-700 font-semibold">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>58s synthesis</span>
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e4de] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-[#18181b]">01. PRODUCT SPEC</span>
                <span className="text-teal-700 text-[10px]">Passed in 32s ✓</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-[#18181b]">02. UI/UX DESIGN</span>
                <span className="text-teal-700 text-[10px]">Passed in 41s ✓</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-orange-50 border-2 border-[#ea580c] rounded-lg shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs">03</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-[#ea580c]">DEV AGENT</span>
                <span className="text-[#ea580c] text-[10px] font-bold">Gate 3 Pending • برمجة</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 opacity-60 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">🔒</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-stone-500">04. QC & SECURITY</span>
                <span className="text-stone-400 text-[10px]">Awaiting Gate 3</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 opacity-60 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">🔒</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-stone-500">05. DEPLOYMENT</span>
                <span className="text-stone-400 text-[10px]">Awaiting Gate 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent 03 Bio Hero Banner */}
      <section className="bg-white p-6 rounded-2xl border border-[#e5e4de] shadow-xs mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[36px]">terminal</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-[#18181b]">
                  Nour • Full-Stack Developer Agent
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold">
                  React 19 & Fastify Engine v4.2
                </span>
                <span className="text-xs text-stone-500 font-semibold">وكيل البرمجة وتجميع الأكواد</span>
              </div>
              <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium">
                Generated complete production-ready full-stack codebase: <strong className="text-[#18181b]">18 React components</strong>, <strong className="text-[#18181b]">8 Fastify REST endpoints</strong>, Postgres RLS schema migrations, and live sandbox in <span className="text-[#ea580c] font-bold">58 seconds</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto shrink-0 text-center text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[#887364] block">COMPONENTS</span>
              <strong className="font-display text-base text-[#ea580c]">18 / 18</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[#887364] block">API ROUTES</span>
              <strong className="font-display text-base text-teal-700">8 Live</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[#887364] block">TYPESCRIPT</span>
              <strong className="font-display text-base text-[#18181b]">100% Safe</strong>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="text-[#887364] block">CONFIDENCE</span>
              <strong className="font-display text-base text-[#ea580c]">99.6%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (8 Cols): Sandbox & Code Inspector */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e4de] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-base text-[#18181b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ea580c]">developer_board</span>
                  <span>Interactive Code Sandbox & Live Component Playground</span>
                </h2>
                <span className="text-xs text-stone-500">معاينة تفاعلية حية للكود المولد والمكونات المستقلة</span>
              </div>

              {/* View Switcher Tabs */}
              <div className="inline-flex p-1 bg-stone-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveCodeTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    activeCodeTab === 'preview' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>Live App Sandbox</span>
                </button>

                <button
                  onClick={() => setActiveCodeTab('code')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    activeCodeTab === 'code' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">code_blocks</span>
                  <span>Clean Code View</span>
                </button>

                <button
                  onClick={() => setActiveCodeTab('plain')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    activeCodeTab === 'plain' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>Plain English</span>
                </button>
              </div>
            </div>

            {/* File Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold">
              {['DocumentVault.tsx', 'SignModalWithOTP.tsx', 'AuditLedgerTable.tsx', 'schema.prisma'].map((file) => (
                <button
                  key={file}
                  onClick={() => {
                    setSelectedFile(file);
                    setActiveCodeTab('code');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    selectedFile === file ? 'bg-white text-[#ea580c] shadow-2xs border border-stone-200' : 'text-stone-600 hover:bg-white/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>{file}</span>
                </button>
              ))}
            </div>

            {/* Code / Preview Render Area */}
            {activeCodeTab === 'preview' && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono pb-2 border-b border-stone-200">
                  <span>https://sandbox-prj8842.ogroup.internal/vault</span>
                  <span className="text-teal-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    Hot Reload Connected (React 19)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-sm text-[#18181b]">Bilingual Document Vault • خزانة العقود</h3>
                    <button
                      onClick={() => showToast('Uploading contract in sandbox...')}
                      className="px-3 py-1.5 bg-[#ea580c] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      + Upload Contract
                    </button>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#18181b] block">Aramco Services Master Agreement 2025</strong>
                      <span className="text-stone-500">SHA-256 Verified • 2 Signers</span>
                    </div>
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 font-bold rounded">OTP Verified ✓</span>
                  </div>
                </div>
              </div>
            )}

            {activeCodeTab === 'code' && (
              <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[400px]">
                <div className="text-stone-400 pb-2 border-b border-slate-800 flex justify-between items-center mb-3">
                  <span>src/components/{selectedFile}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeSnippets[selectedFile] || '');
                      showToast('Code copied to clipboard!');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <pre>{codeSnippets[selectedFile] || '// Code snippet loading...'}</pre>
              </div>
            )}

            {activeCodeTab === 'plain' && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-3">
                <h4 className="font-bold text-sm text-[#18181b]">Zero-Jargon Architecture Guide (شرح مبسط)</h4>
                <p className="text-stone-600 leading-relaxed">
                  How Nour built this module to ensure high speed, bank-level security, and seamless Saudi digital identity integration:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="text-[#ea580c] block">1. Lightning Fast Load Speeds (&lt;200ms)</strong>
                    <span className="text-stone-600">Uses React 19 Server Components so your visitors download 70% less JS.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="text-teal-700 block">2. Bank-Grade Tamper Proofing</strong>
                    <span className="text-stone-600">Every uploaded contract receives a SHA-256 cryptographic digital fingerprint.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tweak Prompt Assistant */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e4de] shadow-xs space-y-3">
            <h4 className="font-display font-bold text-sm text-[#18181b]">Want Nour to adjust the code before approving?</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tweakInput}
                onChange={(e) => setTweakInput(e.target.value)}
                placeholder="Ask Nour for code tweaks (e.g. 'Add a download PDF receipt server action')..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-[#18181b] outline-none"
              />
              <button
                onClick={handleTweakNour}
                className="px-4 py-2 bg-[#ea580c] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 hover:bg-orange-700 cursor-pointer"
              >
                Tweak with Nour
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Assembly Manifest & Gate 3 Checklist */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e4de] shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#18181b]">Assembly Manifest</h3>
            <div className="space-y-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-[#ea580c] block">Frontend Stack</strong>
                <span className="text-stone-600">React 19 + Tailwind CSS + Lucide Icons</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-teal-700 block">Backend & APIs</strong>
                <span className="text-stone-600">Fastify 4.28 + Node 22 + Zod Schemas</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Database & Storage</strong>
                <span className="text-stone-600">PostgreSQL + Supabase RLS Policies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
              03
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#18181b]">
                Human Approval Gate 3: Lock Codebase & Trigger Stage 04 QC?
              </span>
              <p className="text-xs text-stone-600">
                Authorizes Faris (Lead QC Sentinel) to run automated Playwright E2E tests & security scans.
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate3}
            disabled={isApproving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isApproving ? 'Authorizing Stage 04...' : 'Approve Code & Unlock Stage 04 ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
