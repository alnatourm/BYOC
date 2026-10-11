import { env } from '../config';

export async function executeMockRole(role: string, promptBrief?: string, modificationPrompt?: string): Promise<{ rawOutput: string; parsedContent: any }> {
  if (env.NODE_ENV === 'production') {
    throw new Error('FORBIDDEN: Mock adapter is disabled in production environment.');
  }

  if (role === 'spec') {
    const combinedText = `${promptBrief || ''} ${modificationPrompt || ''}`.toLowerCase();
    const isCosmetics = combinedText.includes('cosmatic') || combinedText.includes('cosmetic') || combinedText.includes('beauty') || combinedText.includes('cart') || combinedText.includes('items prices');
    const isRemoveZatca = combinedText.includes('zatca') && (combinedText.includes('remove') || combinedText.includes('not in saudi') || combinedText.includes('no zatca') || combinedText.includes('without'));
    const isAddArabicPdf = combinedText.includes('arabic') || combinedText.includes('pdf') || combinedText.includes('invoice');

    if (isCosmetics) {
      const mockSpec = {
        productName: 'Cosmetics & Beauty E-Commerce Storefront',
        prdSummary: 'Comprehensive Product Specification Document (PRD) for a Cosmetics & Beauty Storefront. Features include a dynamic product catalog with pricing, customer shopping cart, order checkout with instant confirmations, and an administrative panel to edit item prices and inventory.',
        businessGoals: [
          'Display cosmetic items with clear pricing and shade options.',
          'Provide a seamless shopping cart and instant order confirmation flow.',
          'Enable administrators to manage product items, prices, and inventory in real-time.',
        ],
        epics: [
          {
            epicTitle: 'E1: Cosmetics Product Catalog & Price Listing',
            description: 'Interactive storefront catalog allowing customers to browse beauty and cosmetic products, view prices, filter by category, and see item descriptions.',
          },
          {
            epicTitle: 'E2: Shopping Cart & Order Checkout Flow',
            description: 'E-commerce cart management allowing customers to add items, adjust quantities, review order subtotals, and complete purchase checkout.',
          },
          {
            epicTitle: 'E3: Order Confirmation & Receipt Engine',
            description: 'Order processing system generating unique order confirmation numbers, itemized receipts, and dispatching notifications upon order placement.',
          },
          {
            epicTitle: 'E4: Admin Product & Inventory Management Dashboard',
            description: 'Administrative portal for store managers to add new items, update prices, adjust stock levels, and view sales performance metrics.',
          },
        ],
        postgresSchema: [
          { tableName: 'products', columns: 'id (UUID PK), name (VARCHAR), category (VARCHAR), price (NUMERIC), description (TEXT), image_url (TEXT), stock_quantity (INT), created_at (TIMESTAMPTZ)' },
          { tableName: 'categories', columns: 'id (UUID PK), name (VARCHAR), slug (VARCHAR)' },
          { tableName: 'orders', columns: 'id (UUID PK), customer_name (VARCHAR), customer_email (VARCHAR), total_amount (NUMERIC), status (VARCHAR), created_at (TIMESTAMPTZ)' },
          { tableName: 'order_items', columns: 'id (UUID PK), order_id (FK), product_id (FK), quantity (INT), unit_price (NUMERIC)' },
          { tableName: 'admin_users', columns: 'id (UUID PK), email (VARCHAR), password_hash (VARCHAR), role (VARCHAR)' },
        ],
      };

      if (modificationPrompt) {
        mockSpec.epics.push({
          epicTitle: `E5: Custom Refinement • ${modificationPrompt.slice(0, 35)}`,
          description: `Applied modification request: ${modificationPrompt}`,
        });
      }

      return { rawOutput: JSON.stringify(mockSpec, null, 2), parsedContent: mockSpec };
    }

    let e3Title = 'E3: Online Payments & ZATCA Digital Tax Invoices';
    let e3Desc = 'Integrated checkout supporting Apple Pay, Mada, credit cards, and cash POS logging with automated QR-code tax invoice generation.';
    let invoiceColumns = 'id (UUID PK), appointment_id (FK), zatca_qr_code (TEXT), tax_amount (NUMERIC), total_amount (NUMERIC), payment_method (VARCHAR), paid_at (TIMESTAMPTZ)';

    if (isRemoveZatca) {
      e3Title = 'E3: Online Payments & Digital Invoice Receipts';
      e3Desc = 'Integrated checkout supporting Apple Pay, Mada, credit cards, and cash POS logging with standard digital receipt generation.';
      invoiceColumns = 'id (UUID PK), appointment_id (FK), invoice_number (VARCHAR), tax_amount (NUMERIC), total_amount (NUMERIC), payment_method (VARCHAR), paid_at (TIMESTAMPTZ)';
    }

    if (isAddArabicPdf) {
      e3Title = 'E3: Online Payments & Arabic PDF Invoice Receipts';
      e3Desc = 'Integrated checkout supporting Apple Pay, Mada, credit cards, cash POS logging, and automated Arabic PDF invoice receipt generation.';
      invoiceColumns = 'id (UUID PK), appointment_id (FK), invoice_number (VARCHAR), arabic_pdf_url (TEXT), tax_amount (NUMERIC), total_amount (NUMERIC), payment_method (VARCHAR), paid_at (TIMESTAMPTZ)';
    }

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
        epicTitle: e3Title,
        description: e3Desc,
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
        epicTitle: `E6: Custom Refinement • ${modificationPrompt.slice(0, 35)}`,
        description: `Custom requirement applied from refinement chat: ${modificationPrompt}`,
      });
    }

    const businessGoals = [
      'Reduce booking creation time for customers to under 45 seconds.',
      'Eliminate double-bookings and optimize barber calendar occupancy.',
      'Automate WhatsApp & SMS reminders to reduce no-shows by 85%.',
    ];

    if (!isRemoveZatca) {
      businessGoals.push('Issue ZATCA-compliant digital tax invoices and support Apple Pay / Mada checkout.');
    } else {
      businessGoals.push('Issue digital receipt invoices with Arabic PDF support and Apple Pay / Mada checkout.');
    }

    let prdSummary = 'Comprehensive Business Requirements Document (BRD) & Product Specification Document (PRD) for a premier Grooming & Appointment Booking System. The platform features self-service client appointment scheduling, barber staff schedule management, service catalog configuration, automated WhatsApp/SMS booking confirmations, Apple Pay / Mada checkout, and an administrative analytics dashboard.';

    if (modificationPrompt) {
      prdSummary = `Updated Business Requirements Document (BRD) reflecting your request: "${modificationPrompt}". ${isRemoveZatca ? 'ZATCA Saudi tax invoice requirements have been removed from the platform scope. ' : ''}${isAddArabicPdf ? 'Added support for Arabic PDF invoice receipt generation and tax fields.' : ''}`;
    }

    const mockSpec = {
      productName: 'Gentlemen\'s Grooming & Booking Platform',
      prdSummary,
      businessGoals,
      epics,
      postgresSchema: [
        { tableName: 'appointments', columns: 'id (UUID PK), client_id (FK), barber_id (FK), service_id (FK), scheduled_at (TIMESTAMPTZ), status (VARCHAR), total_price (NUMERIC), created_at (TIMESTAMPTZ)' },
        { tableName: 'clients', columns: 'id (UUID PK), full_name (VARCHAR), phone_number (VARCHAR), email (VARCHAR), loyalty_points (INT), created_at (TIMESTAMPTZ)' },
        { tableName: 'barbers', columns: 'id (UUID PK), name (VARCHAR), specialization (VARCHAR), bio (TEXT), active (BOOLEAN), created_at (TIMESTAMPTZ)' },
        { tableName: 'services', columns: 'id (UUID PK), title (VARCHAR), duration_minutes (INT), price (NUMERIC), category (VARCHAR), active (BOOLEAN)' },
        { tableName: 'invoices', columns: invoiceColumns },
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
