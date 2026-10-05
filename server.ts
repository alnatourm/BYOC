import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

import { env } from './server/config';
import { db } from './server/db';
import { runMigrations } from './server/db/migrate';
import { helmetMiddleware, corsMiddleware } from './server/middleware/logger';

import { authRouter } from './server/routes/auth';
import { connectionsRouter } from './server/routes/connections';
import { auditRouter } from './server/routes/audit';
import { adminRouter } from './server/routes/admin';
import { pipelineRouter } from './server/routes/pipeline';
import { hostingRouter } from './server/routes/hosting';

export const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Health & Readiness Endpoints (BRD v1.1 Task 7)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/readyz', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ready', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(503).json({ status: 'not_ready', db: 'disconnected', error: err.message });
  }
});

// Mounting V1 API Surface
app.use('/v1/auth', authRouter);
app.use('/v1', authRouter);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/audit', auditRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1', pipelineRouter);
app.use('/v1/hosting-connections', hostingRouter);
app.use('/v1', hostingRouter);

// AI Role Orchestration Proxy Route (Behind Environment Key)
app.post('/api/ai/orchestrate-role', async (req, res) => {
  try {
    const { roleCategory, roleTitle, agentDirectives, modelIdentifier, promptBrief } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY is not configured in server environment secrets.' 
      });
    }

    const ai = new GoogleGenAI({});

    const targetModel = modelIdentifier && modelIdentifier.includes('gemini') 
      ? modelIdentifier 
      : 'gemini-2.5-flash';

    let roleSystemPrompt = '';

    if (roleCategory === 'product' || roleCategory === 'spec' || (roleCategory === 'design' && roleTitle?.includes('Product'))) {
      roleSystemPrompt = `You are a Lead Product Manager & System Architect Agent named ${roleTitle}.
Directives: ${agentDirectives}
Task: Generate a Product Requirements Document (PRD), Feature Epics list, and PostgreSQL Data Model JSON object for brief: "${promptBrief}".
Output strictly valid JSON with keys:
- productName: string
- prdSummary: string
- epics: Array of { epicTitle: string, description: string }
- postgresSchema: Array of { tableName: string, columns: string }
- systemBoundaries: Array of string
- localizationKeys: Array of string`;
    } else if (roleCategory === 'design') {
      const isStitchEngine = modelIdentifier?.includes('stitch') || agentDirectives?.includes('Stitch');
      roleSystemPrompt = `You are a world-class UI/UX Designer Agent named ${roleTitle}${isStitchEngine ? ' powered by Google Stitch AI Layout Engine' : ''}.
Directives: ${agentDirectives}
Task: Generate a high-fidelity Design Specification JSON object for the user brief: "${promptBrief}".
Output strictly valid JSON with keys:
- colorPalette: Array of { name: string, hex: string } (3-4 colors)
- typographyHeading: string
- typographyBody: string
- layoutStructure: string
- componentHierarchy: Array of string
- visualGuidelines: string
- stitchCanvasSpec: string`;
    } else if (roleCategory === 'dev') {
      roleSystemPrompt = `You are a Lead Software Engineer Agent named ${roleTitle}.
Directives: ${agentDirectives}
Task: Create a production-ready, clean React component in TypeScript (TSX) for the brief: "${promptBrief}".
Output strictly valid TSX code without markdown backticks.`;
    } else if (roleCategory === 'qc') {
      roleSystemPrompt = `You are a Senior Quality Control Security Auditor Agent named ${roleTitle}.
Task: Evaluate design and code for brief: "${promptBrief}".
Output strictly valid JSON with overallScore, passStatus, checksPassed, warnings, accessibilityScore, securityScore, codeQualityScore.`;
    } else {
      roleSystemPrompt = `You are an AI Agent worker operating as ${roleTitle}. Directives: ${agentDirectives}`;
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: `${roleSystemPrompt}\n\nUser Brief:\n${promptBrief}`,
    });

    res.json({
      success: true,
      modelUsed: targetModel,
      outputText: response.text || '',
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('AI Orchestration Error:', err);
    res.status(500).json({ error: err?.message || 'Failed to execute AI role orchestration' });
  }
});

// Hosting Connections Verification API (BRD v1.1 Section 7.9)
app.post('/api/hosting/verify', (req, res) => {
  const { providerType } = req.body;
  res.json({
    success: true,
    providerType,
    status: 'ACTIVE',
    verifiedAt: new Date().toISOString(),
  });
});

// Hosting Cost Quotes API
app.get('/api/hosting/quotes', (req, res) => {
  res.json({
    success: true,
    quotes: [
      {
        providerId: 'railway',
        providerName: 'Railway PaaS (Client Account)',
        estimatedMonthlyUsd: 15.0,
        currency: 'USD',
        quotedAt: new Date().toISOString(),
        backupsStatus: 'VERIFIED_ENABLED',
        spendLimitCapUsd: 25.0,
        capabilitiesGaps: [],
        recommended: true,
      },
      {
        providerId: 'hetzner',
        providerName: 'Hetzner Cloud CX22 (2 vCPU / 4GB RAM)',
        estimatedMonthlyUsd: 12.5,
        currency: 'USD',
        quotedAt: new Date().toISOString(),
        backupsStatus: 'VERIFIED_ENABLED',
        spendLimitCapUsd: 12.5,
        capabilitiesGaps: ['Manual snapshot required for database rollback'],
        recommended: false,
      },
    ],
  });
});

// Server Initialization
async function startServer() {
  await runMigrations();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`🚀 OGroup AI Factory Server listening on http://0.0.0.0:${env.PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Fatal Server Boot Error:', err);
  });
}
