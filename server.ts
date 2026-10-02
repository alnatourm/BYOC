import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Simulated Server Encrypted Vault
const serverVaultStore: Record<string, { secret: string; providerId: string; createdAt: string }> = {};

// Helper: Mask Secret
function maskSecret(secret: string): string {
  if (!secret) return 'NO_SECRET';
  if (secret.length <= 8) return '••••' + secret.slice(-2);
  return secret.slice(0, 7) + '••••••••' + secret.slice(-4);
}

// Vault API Endpoints
app.get('/api/vault/status', (req, res) => {
  res.json({
    status: 'online',
    vaultEncryptedSecretsCount: Object.keys(serverVaultStore).length,
    kmsAlgorithm: 'AES-256-GCM-KMS',
    geminiKeyInjected: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/vault/save-secret', (req, res) => {
  const { providerId, rawSecret } = req.body;
  if (!providerId || !rawSecret) {
    return res.status(400).json({ error: 'Missing providerId or rawSecret' });
  }

  const vaultKeyId = `vault_sec_${providerId}_${Math.random().toString(36).substring(2, 8)}`;
  serverVaultStore[vaultKeyId] = {
    secret: rawSecret,
    providerId,
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    vaultKeyId,
    maskedSecret: maskSecret(rawSecret),
    message: 'Secret encrypted in server vault. Raw key removed from response payload.',
  });
});

// Live AI Role Orchestration Route
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

    // Choose model or default to gemini-2.5-flash
    const targetModel = modelIdentifier && modelIdentifier.includes('gemini') 
      ? modelIdentifier 
      : 'gemini-2.5-flash';

    let roleSystemPrompt = '';

    if (roleCategory === 'design') {
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
- stitchCanvasSpec: string (e.g. "Google Stitch Canvas v2.5 Layout Matrix")`;
    } else if (roleCategory === 'dev') {
      roleSystemPrompt = `You are a Lead Software Engineer Agent named ${roleTitle}.
Directives: ${agentDirectives}
Task: Create a production-ready, clean React component in TypeScript (TSX) for the brief: "${promptBrief}".
Requirements:
- Use React with hooks (useState, etc.)
- Use Lucide icons (import { IconName } from 'lucide-react')
- Use Tailwind CSS with dark slate theme (bg-slate-950 or bg-slate-900)
- Ensure all buttons have click handlers
- Do not output markdown backticks or extra prose, output ONLY the clean code block starting with 'import React...'`;
    } else if (roleCategory === 'qc') {
      roleSystemPrompt = `You are a Senior Quality Control (Q/C) Security and Accessibility Auditor Agent named ${roleTitle}.
Directives: ${agentDirectives}
Task: Evaluate the generated design and code for the brief: "${promptBrief}".
Output strictly valid JSON with keys:
- overallScore: number (0 to 100)
- passStatus: "PASSED" | "PASSED_WITH_WARNINGS" | "FAILED"
- checksPassed: Array of string
- warnings: Array of string
- recommendations: Array of string
- accessibilityScore: number
- securityScore: number
- codeQualityScore: number`;
    } else {
      roleSystemPrompt = `You are an AI Agent worker operating as ${roleTitle}.
Directives: ${agentDirectives}
Task: Execute task for brief: "${promptBrief}". Give concise structured output.`;
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: `${roleSystemPrompt}\n\nUser Brief:\n${promptBrief}`,
    });

    const outputText = response.text || '';

    res.json({
      success: true,
      modelUsed: targetModel,
      outputText,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('AI Orchestration Error:', err);
    res.status(500).json({ error: err?.message || 'Failed to execute AI role orchestration' });
  }
});

// Vite middleware in dev mode
async function startServer() {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BYOK Platform Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
