import { env } from '../config';

export async function executeMockRole(role: string): Promise<{ rawOutput: string; parsedContent: any }> {
  if (env.NODE_ENV === 'production') {
    throw new Error('FORBIDDEN: Mock adapter is disabled in production environment.');
  }

  if (role === 'spec') {
    const mockSpec = {
      productName: 'Acme Platform',
      prdSummary: 'Grooming service appointment booking platform.',
      epics: [{ epicTitle: 'E1', description: 'Service catalog' }],
      postgresSchema: [{ tableName: 'appointments', columns: 'id, client_name' }],
    };
    return { rawOutput: JSON.stringify(mockSpec), parsedContent: mockSpec };
  }

  if (role === 'design') {
    const mockDesign = {
      colorPalette: [{ name: 'Gold', hex: '#d97706' }],
      typographyHeading: 'Inter',
      typographyBody: 'Inter',
      layoutStructure: 'Responsive Grid',
      componentHierarchy: ['Header', 'Menu', 'BookingModal'],
    };
    return { rawOutput: JSON.stringify(mockDesign), parsedContent: mockDesign };
  }

  return {
    rawOutput: `// Mock Code for ${role}`,
    parsedContent: `import React from "react"; export function App() { return <div>Mock App</div>; }`,
  };
}
