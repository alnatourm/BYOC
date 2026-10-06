import { env } from '../config';

export async function executeMockRole(role: string, modificationPrompt?: string): Promise<{ rawOutput: string; parsedContent: any }> {
  if (env.NODE_ENV === 'production') {
    throw new Error('FORBIDDEN: Mock adapter is disabled in production environment.');
  }

  if (role === 'spec') {
    const epics = [
      {
        epicTitle: 'E1: Customer Self-Service Booking Portal',
        description: 'Interactive client portal allowing customers to select grooming services (Haircut, Beard Styling, VIP Spa), select preferred barbers, choose available time slots, and receive instant booking confirmation.',
      },
      {
        epicTitle: 'E2: Barber Schedule & Capacity Operations Manager',
        description: 'Schedule management module for barbers to set working hours, shift breaks, vacation blocks, and track daily appointment queues and client preferences.',
      },
      {
        epicTitle: 'E3: Online Payments & ZATCA Digital Tax Invoices',
        description: 'Integrated checkout supporting Apple Pay, Mada, credit cards, and cash POS logging with automated QR-code tax invoice generation.',
      },
      {
        epicTitle: 'E4: Automated WhatsApp & SMS Notification Engine',
        description: 'Automated notification engine sending instant booking confirmations, 1-hour pre-appointment reminders, cancellation alerts, and post-service feedback forms.',
      },
      {
        epicTitle: 'E5: Business Intelligence Analytics & Revenue Dashboard',
        description: 'Executive dashboard tracking total revenue, daily appointment volume, barber commission reports, and customer retention metrics.',
      },
    ];

    if (modificationPrompt) {
      epics.push({
        epicTitle: `E6: Refinement • ${modificationPrompt.slice(0, 40)}`,
        description: `Custom enhancement requested during interactive chat: ${modificationPrompt}`,
      });
    }

    const mockSpec = {
      productName: 'Gentlemen\'s Salon & Grooming Booking Platform',
      prdSummary: modificationPrompt
        ? `Updated Business Requirements Document (BRD) & PRD Specification reflecting user modification request: "${modificationPrompt}". The platform provides an end-to-end salon booking system with barber schedule management, WhatsApp notifications, and ZATCA tax invoicing.`
        : 'Comprehensive Business Requirements Document (BRD) & Product Specification Document (PRD) for a premier Salon & Grooming Booking System. The platform features self-service client appointment scheduling, barber staff schedule management, service catalog configuration, automated WhatsApp/SMS booking confirmations, Apple Pay / Mada checkout, and an administrative analytics dashboard.',
      businessGoals: [
        'Reduce booking creation time for customers to under 45 seconds.',
        'Eliminate double-bookings and optimize barber calendar occupancy.',
        'Automate WhatsApp & SMS reminders to reduce no-shows by 85%.',
        'Issue ZATCA-compliant digital tax invoices and support Apple Pay / Mada checkout.',
      ],
      epics,
      postgresSchema: [
        { tableName: 'appointments', columns: 'id (UUID PK), client_id (FK), barber_id (FK), service_id (FK), scheduled_at (TIMESTAMPTZ), status (VARCHAR), total_price (NUMERIC), created_at (TIMESTAMPTZ)' },
        { tableName: 'clients', columns: 'id (UUID PK), full_name (VARCHAR), phone_number (VARCHAR), email (VARCHAR), loyalty_points (INT), created_at (TIMESTAMPTZ)' },
        { tableName: 'barbers', columns: 'id (UUID PK), name (VARCHAR), specialization (VARCHAR), bio (TEXT), active (BOOLEAN), created_at (TIMESTAMPTZ)' },
        { tableName: 'services', columns: 'id (UUID PK), title (VARCHAR), duration_minutes (INT), price (NUMERIC), category (VARCHAR), active (BOOLEAN)' },
        { tableName: 'invoices', columns: 'id (UUID PK), appointment_id (FK), zatca_qr_code (TEXT), tax_amount (NUMERIC), total_amount (NUMERIC), payment_method (VARCHAR), paid_at (TIMESTAMPTZ)' },
        { tableName: 'notifications', columns: 'id (UUID PK), appointment_id (FK), channel (VARCHAR - whatsapp/sms), status (VARCHAR), dispatched_at (TIMESTAMPTZ)' },
      ],
    };
    return { rawOutput: JSON.stringify(mockSpec, null, 2), parsedContent: mockSpec };
  }

  if (role === 'design') {
    const mockDesign = {
      colorPalette: [
        { name: 'Warm Amber Primary', hex: '#ea580c' },
        { name: 'Cream Surface Background', hex: '#faf8f5' },
        { name: 'Deep Charcoal Text', hex: '#1f242e' },
      ],
      typographyHeading: 'Inter Display / System Sans',
      typographyBody: 'Inter / System Sans',
      layoutStructure: 'Responsive Dual Column Layout with Sidebar Navigation',
      componentHierarchy: ['Global Header', 'Interactive App Area', 'Document View', 'Refinement Chat'],
    };
    return { rawOutput: JSON.stringify(mockDesign, null, 2), parsedContent: mockDesign };
  }

  return {
    rawOutput: `// Refined Output for ${role}\n// Modification Brief: ${modificationPrompt || 'Initial Generation'}`,
    parsedContent: `import React from "react"; export function App() { return <div>Refined App View</div>; }`,
  };
}
