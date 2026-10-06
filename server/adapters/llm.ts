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
  modificationPrompt?: string
): Promise<{ rawOutput: string; parsedContent?: any; valid: boolean; validationError?: string }> {
  try {
    if (!apiKey || apiKey.trim().length === 0) {
      if (env.NODE_ENV !== 'production') {
        const mock = await executeMockRole(role, modificationPrompt);
        return { rawOutput: mock.rawOutput, parsedContent: mock.parsedContent, valid: true };
      }
      throw new Error('LLM_ADAPTER_ERROR: No API key passed to LLM role adapter.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${instructionBody}\n\nTask Prompt:\n${promptBrief}`,
    });

    const rawOutput = response.text || '';

    // Validate Output Schema based on Role
    if (role === 'spec') {
      const cleanJson = rawOutput.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      specOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    if (role === 'design') {
      const cleanJson = rawOutput.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      designOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    if (role === 'qc') {
      const cleanJson = rawOutput.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      qcOutputSchema.parse(parsed);
      return { rawOutput, parsedContent: parsed, valid: true };
    }

    return { rawOutput, parsedContent: rawOutput, valid: true };
  } catch (err: any) {
    if (env.NODE_ENV !== 'production') {
      const mock = await executeMockRole(role, modificationPrompt);
      return { rawOutput: mock.rawOutput, parsedContent: mock.parsedContent, valid: true };
    }
    return {
      rawOutput: '',
      valid: false,
      validationError: `LLM_EXECUTION_ERROR: ${err?.message || 'Failed role execution'}`,
    };
  }
}
