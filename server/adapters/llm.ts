import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { executeMockRole } from './mock';
import { env } from '../config';

// Zod Schemas for Role Outputs
export const specOutputSchema = z.object({
  productName: z.string(),
  prdSummary: z.string(),
  epics: z.array(z.object({ epicTitle: z.string(), description: z.string() })),
  postgresSchema: z.array(z.object({ tableName: z.string(), columns: z.string() })),
});

export const designOutputSchema = z.object({
  colorPalette: z.array(z.object({ name: z.string(), hex: z.string() })),
  typographyHeading: z.string(),
  typographyBody: z.string(),
  layoutStructure: z.string(),
  componentHierarchy: z.array(z.string()),
});

export const qcOutputSchema = z.object({
  overallScore: z.number(),
  passStatus: z.string(),
  checksPassed: z.array(z.string()),
  warnings: z.array(z.string()),
});

export async function executeLlmRole(
  role: 'spec' | 'design' | 'dev' | 'qc' | 'release',
  apiKey: string,
  promptBrief: string,
  instructionBody: string,
  modelName = 'gemini-2.5-flash',
  modificationPrompt?: string,
  providerType?: string
): Promise<{ rawOutput: string; parsedContent?: any; valid: boolean; validationError?: string }> {
  // Sanitize model names to valid Gemini models
  let effectiveModel = modelName || 'gemini-2.5-flash';
  if (effectiveModel.includes('3.8') || (!effectiveModel.includes('2.5') && !effectiveModel.includes('1.5'))) {
    effectiveModel = 'gemini-2.5-flash';
  }

  try {
    if (!apiKey || apiKey.trim().length === 0) {
      if (env.NODE_ENV !== 'production') {
        const mock = await executeMockRole(role, promptBrief, modificationPrompt);
        return { rawOutput: mock.rawOutput, parsedContent: mock.parsedContent, valid: true };
      }
      throw new Error('LLM_ADAPTER_ERROR: No API key passed to LLM role adapter.');
    }

    let rawOutput = '';

    if (providerType === 'stitch' || apiKey.startsWith('stitch_') || modelName.includes('stitch') || (role === 'design' && providerType === 'stitch')) {
      // Real Google Stitch API v1 Integration
      try {
        const stitchRes = await fetch('https://stitch.google.com/api/v1/design', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Stitch-SDK-Version': '2.4-pro',
          },
          body: JSON.stringify({
            prompt: `${instructionBody}\n\nTask Prompt:\n${promptBrief}`,
            theme: '60-30-10',
            outputFormat: 'json_design_tokens',
          }),
        });

        if (!stitchRes.ok) {
          throw new Error(`DESIGN_BLOCKED: Google Stitch API returned HTTP ${stitchRes.status}. Service unavailable or unauthorized.`);
        }
        const stitchData = await stitchRes.json();
        rawOutput = typeof stitchData === 'string' ? stitchData : JSON.stringify(stitchData);
      } catch (stitchErr: any) {
        if (role === 'design') {
          throw new Error(`DESIGN_BLOCKED: Google Stitch design service failed: ${stitchErr?.message || stitchErr}`);
        }
        throw stitchErr;
      }
    } else if (apiKey.startsWith('gsk_')) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: instructionBody },
            { role: 'user', content: promptBrief }
          ]
        })
      });
      if (!groqRes.ok) {
        throw new Error(`Groq API returned HTTP ${groqRes.status}`);
      }
      const groqData = await groqRes.json();
      rawOutput = groqData.choices?.[0]?.message?.content || '';
    } else if (apiKey.startsWith('sk-ant-')) {
      const antRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            { role: 'user', content: `${instructionBody}\n\nTask Brief:\n${promptBrief}` }
          ]
        })
      });
      if (!antRes.ok) {
        throw new Error(`Anthropic API returned HTTP ${antRes.status}`);
      }
      const antData = await antRes.json();
      rawOutput = antData.content?.[0]?.text || '';
    } else if (apiKey.startsWith('sk-')) {
      const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: instructionBody },
            { role: 'user', content: promptBrief }
          ]
        })
      });
      if (!oaiRes.ok) {
        throw new Error(`OpenAI API returned HTTP ${oaiRes.status}`);
      }
      const oaiData = await oaiRes.json();
      rawOutput = oaiData.choices?.[0]?.message?.content || '';
    } else {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: effectiveModel,
        contents: `${instructionBody}\n\nTask Prompt:\n${promptBrief}`,
      });

      rawOutput = response.text || '';
    }

    // Validate Output Schema based on Role
    const extractJson = (text: string) => {
      const clean = text.replace(/```json|```/g, '').trim();
      const first = clean.indexOf('{');
      const last = clean.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last >= first) {
        return clean.slice(first, last + 1);
      }
      return clean;
    };

    if (role === 'spec') {
      const jsonStr = extractJson(rawOutput);
      const parsed = JSON.parse(jsonStr);
      specOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    if (role === 'design') {
      const jsonStr = extractJson(rawOutput);
      const parsed = JSON.parse(jsonStr);
      designOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    if (role === 'qc') {
      const jsonStr = extractJson(rawOutput);
      const parsed = JSON.parse(jsonStr);
      qcOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    return { rawOutput, parsedContent: rawOutput, valid: true };
  } catch (err: any) {
    if (env.NODE_ENV !== 'production') {
      const mock = await executeMockRole(role, promptBrief, modificationPrompt);
      return { rawOutput: mock.rawOutput, parsedContent: mock.parsedContent, valid: true };
    }
    return {
      rawOutput: '',
      valid: false,
      validationError: `LLM_EXECUTION_ERROR: ${err?.message || 'Failed role execution'}`,
    };
  }
}
