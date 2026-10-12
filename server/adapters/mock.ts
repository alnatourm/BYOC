import { env } from '../config';

function toTitleCase(str: string): string {
  if (!str) return 'Custom Software Application';
  return str
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function executeMockRole(
  role: string,
  promptBrief?: string,
  modificationPrompt?: string
): Promise<{ rawOutput: string; parsedContent: any }> {
  if (env.NODE_ENV === 'production') {
    throw new Error('FORBIDDEN: Mock adapter is disabled in production environment.');
  }

  const userIntent = (promptBrief || 'Custom Application').trim();
  const lowerIntent = `${userIntent} ${modificationPrompt || ''}`.toLowerCase();
  const formattedTitle = toTitleCase(userIntent);

  if (role === 'spec') {
    let productName = `${formattedTitle} Platform`;
    let prdSummary = `Comprehensive Business Requirements Document (BRD) & Product Specification Document (PRD) for ${userIntent}. Features end-to-end user workflows, administrative management, secure data persistence, and interactive interfaces.`;
    let businessGoals = [
      `Streamline core user operations and workflow efficiency for ${userIntent}.`,
      `Provide real-time data persistence, search, and status tracking.`,
      `Deliver a responsive, user-friendly interface with role-based access control.`,
    ];

    let epics: Array<{ epicTitle: string; description: string }> = [];
    let postgresSchema: Array<{ tableName: string; columns: string }> = [];

    // 1. Apartment / Real Estate / Rental
    if (
      lowerIntent.includes('apartment') ||
      lowerIntent.includes('rent') ||
      lowerIntent.includes('lease') ||
      lowerIntent.includes('property') ||
      lowerIntent.includes('real estate') ||
      lowerIntent.includes('housing')
    ) {
      productName = 'Apartment Rental & Property Management Platform';
      prdSummary = `Comprehensive Business Requirements Document (BRD) & Product Specification Document (PRD) for an Apartment Rental & Lease Management System based on your request: "${userIntent}". Features include apartment listings with filtering, virtual media, online tenant lease applications, security deposit & rent payment processing, landlord property management dashboard, and automated maintenance ticketing.`;

      businessGoals = [
        'Reduce average apartment vacancy duration with instant online listing & application flows.',
        'Automate monthly rent invoice dispatch and online lease agreements.',
        'Streamline tenant maintenance requests and landlord resolution tracking.',
      ];

      epics = [
        {
          epicTitle: 'E1: Apartment Listings & Interactive Search Catalog',
          description: 'Tenant-facing catalog allowing users to search available apartments by location, price, bedrooms, amenities, and view high-res photos and virtual tours.',
        },
        {
          epicTitle: 'E2: Online Tenant Application & Lease Agreement Portal',
          description: 'Digital application workflow for prospective tenants to submit background info, upload identification, sign digital lease agreements, and pay security deposits.',
        },
        {
          epicTitle: 'E3: Automated Rent Payment & Financial Billing Engine',
          description: 'Recurring monthly rent invoicing engine supporting card payments, bank transfers, payment history tracking, and digital receipt generation.',
        },
        {
          epicTitle: 'E4: Landlord & Property Manager Operations Dashboard',
          description: 'Admin dashboard for property owners to manage apartment availability, adjust rent rates, review applicant submissions, and generate revenue reports.',
        },
        {
          epicTitle: 'E5: Tenant Maintenance Ticketing & Service Request Portal',
          description: 'Tenant portal for submitting maintenance requests, assigning contractors, tracking repair status updates, and logging completed work.',
        },
      ];

      postgresSchema = [
        { tableName: 'apartments', columns: 'id (UUID PK), title (VARCHAR), address (TEXT), city (VARCHAR), monthly_rent (NUMERIC), bedrooms (INT), bathrooms (INT), status (VARCHAR - available/rented/maintenance), landlord_id (FK), created_at (TIMESTAMPTZ)' },
        { tableName: 'landlords', columns: 'id (UUID PK), full_name (VARCHAR), email (VARCHAR), phone (VARCHAR), company_name (VARCHAR), created_at (TIMESTAMPTZ)' },
        { tableName: 'tenants', columns: 'id (UUID PK), full_name (VARCHAR), email (VARCHAR), phone (VARCHAR), occupation (VARCHAR), created_at (TIMESTAMPTZ)' },
        { tableName: 'leases', columns: 'id (UUID PK), apartment_id (FK), tenant_id (FK), start_date (DATE), end_date (DATE), monthly_rent (NUMERIC), security_deposit (NUMERIC), status (VARCHAR - active/expired/terminated)' },
        { tableName: 'rent_payments', columns: 'id (UUID PK), lease_id (FK), amount (NUMERIC), payment_date (TIMESTAMPTZ), payment_method (VARCHAR), status (VARCHAR - paid/pending/overdue)' },
        { tableName: 'maintenance_tickets', columns: 'id (UUID PK), apartment_id (FK), tenant_id (FK), issue_title (VARCHAR), description (TEXT), priority (VARCHAR), status (VARCHAR - open/in_progress/resolved), created_at (TIMESTAMPTZ)' },
      ];
    }
    // 2. E-Commerce / Storefront / Cosmetics
    else if (
      lowerIntent.includes('store') ||
      lowerIntent.includes('shop') ||
      lowerIntent.includes('e-commerce') ||
      lowerIntent.includes('cart') ||
      lowerIntent.includes('cosmetic') ||
      lowerIntent.includes('beauty') ||
      lowerIntent.includes('product')
    ) {
      productName = `${formattedTitle} E-Commerce Storefront`;
      prdSummary = `Comprehensive Product Specification Document (PRD) for ${userIntent}. Features dynamic product catalogs with pricing, shopping cart, online order checkout, and inventory management.`;

      epics = [
        {
          epicTitle: 'E1: Product Catalog & Item Discovery',
          description: 'Interactive storefront catalog allowing customers to browse products, filter by categories, view pricing, and search items.',
        },
        {
          epicTitle: 'E2: Shopping Cart & Checkout Portal',
          description: 'Shopping cart manager enabling customers to adjust quantities, review order subtotals, and complete secure checkout.',
        },
        {
          epicTitle: 'E3: Order Processing & Digital Receipt Engine',
          description: 'Order management engine generating itemized digital receipts, order tracking IDs, and status updates.',
        },
        {
          epicTitle: 'E4: Admin Inventory & Store Dashboard',
          description: 'Administrative portal for managers to update product listings, adjust pricing, manage stock, and view sales performance.',
        },
      ];

      postgresSchema = [
        { tableName: 'products', columns: 'id (UUID PK), name (VARCHAR), category (VARCHAR), price (NUMERIC), description (TEXT), stock_quantity (INT), created_at (TIMESTAMPTZ)' },
        { tableName: 'orders', columns: 'id (UUID PK), customer_name (VARCHAR), customer_email (VARCHAR), total_amount (NUMERIC), status (VARCHAR), created_at (TIMESTAMPTZ)' },
        { tableName: 'order_items', columns: 'id (UUID PK), order_id (FK), product_id (FK), quantity (INT), unit_price (NUMERIC)' },
      ];
    }
    // 3. Dynamic Fallback for Any Other Custom Application Idea
    else {
      epics = [
        {
          epicTitle: `E1: Core ${formattedTitle} User Interface & Discovery`,
          description: `User-facing web portal for ${userIntent}, offering clean navigation, search, and core interaction workflows.`,
        },
        {
          epicTitle: `E2: ${formattedTitle} Operational Management Engine`,
          description: `Backend logic and workflows dedicated to processing records, managing state transitions, and validating inputs for ${userIntent}.`,
        },
        {
          epicTitle: `E3: Secure Data Persistence & Transactions`,
          description: `Database transactions, relationship management, and secure handling of user submissions for ${userIntent}.`,
        },
        {
          epicTitle: `E4: Administrative Dashboard & Analytics`,
          description: `Centralized dashboard enabling administrators to configure platform settings, review activity logs, and analyze metrics.`,
        },
      ];

      postgresSchema = [
        { tableName: 'main_records', columns: 'id (UUID PK), title (VARCHAR), status (VARCHAR), details_json (JSONB), created_at (TIMESTAMPTZ)' },
        { tableName: 'users', columns: 'id (UUID PK), email (VARCHAR), full_name (VARCHAR), role (VARCHAR), created_at (TIMESTAMPTZ)' },
        { tableName: 'activity_logs', columns: 'id (UUID PK), user_id (FK), action (VARCHAR), timestamp (TIMESTAMPTZ)' },
      ];
    }

    if (modificationPrompt) {
      epics.push({
        epicTitle: `E${epics.length + 1}: Refinement Requirement • ${modificationPrompt.slice(0, 35)}`,
        description: `Applied modification request from refinement chat: ${modificationPrompt}`,
      });
      prdSummary += ` Updated with request: "${modificationPrompt}".`;
    }

    const mockSpec = {
      productName,
      prdSummary,
      businessGoals,
      epics,
      postgresSchema,
    };

    return { rawOutput: JSON.stringify(mockSpec, null, 2), parsedContent: mockSpec };
  }

  if (role === 'design') {
    let colorPalette = [
      { name: 'Primary Slate Accent', hex: '#2563eb' },
      { name: 'Background Light Surface', hex: '#f8fafc' },
      { name: 'Dark Text Main', hex: '#0f172a' },
    ];
    let typographyHeading = 'Inter / Plus Jakarta Sans';
    let typographyBody = 'Inter / System Sans';
    let layoutStructure = `Responsive Workspace Layout for ${formattedTitle}`;
    let componentHierarchy = [
      'Global Navigation Header',
      `${formattedTitle} Primary Interactive Workspace`,
      'Detailed Content Cards & Interactive Controls',
      'Action Bar & Settings',
    ];

    if (
      lowerIntent.includes('coffee') ||
      lowerIntent.includes('cofe') ||
      lowerIntent.includes('cafe') ||
      lowerIntent.includes('roastery') ||
      lowerIntent.includes('espresso') ||
      lowerIntent.includes('bakery')
    ) {
      colorPalette = [
        { name: 'Rich Espresso Dark Roast', hex: '#3c2415' },
        { name: 'Warm Caramel & Latte Accent', hex: '#d4a373' },
        { name: 'Cozy Cream Surface', hex: '#fefae0' },
        { name: 'Deep Mocha Text', hex: '#1c0f0d' },
      ];
      typographyHeading = 'Playfair Display / Serif Display';
      typographyBody = 'Plus Jakarta Sans';
      layoutStructure = 'Artisanal Coffee House Layout with Hero Showcase, Drink Menu Grid, & Order Counter Bar';
      componentHierarchy = [
        'Coffee House Ambient Hero Banner & Seasonal Highlights',
        'Interactive Specialty Coffee & Pastry Catalog Menu',
        'Custom Beverage Configurator (Roast, Beans, Milk, Syrups)',
        'Barista Order Counter & Quick Pickup Scheduler',
        'Cozy Seating Table Reservation & Loyalty Rewards Portal',
      ];
    } else if (
      lowerIntent.includes('apartment') ||
      lowerIntent.includes('rent') ||
      lowerIntent.includes('lease') ||
      lowerIntent.includes('property') ||
      lowerIntent.includes('real estate')
    ) {
      colorPalette = [
        { name: 'Estate Slate Primary', hex: '#1e293b' },
        { name: 'Emerald Trust Accent', hex: '#059669' },
        { name: 'Warm Off-White Surface', hex: '#f8fafc' },
        { name: 'Charcoal Main Text', hex: '#0f172a' },
      ];
      typographyHeading = 'Plus Jakarta Sans';
      typographyBody = 'Inter / System Sans';
      layoutStructure = 'Real Estate Listings Catalog with Interactive Filtering & Map Layout';
      componentHierarchy = [
        'Property Search & Multi-Filter Navigation Bar',
        'Interactive Apartment Gallery & Virtual Tour Preview',
        'Tenant Digital Lease Application & Deposit Portal',
        'Landlord Dashboard & Property Operations Manager',
      ];
    }

    const mockDesign = {
      colorPalette,
      typographyHeading,
      typographyBody,
      layoutStructure,
      componentHierarchy,
    };
    return { rawOutput: JSON.stringify(mockDesign, null, 2), parsedContent: mockDesign };
  }

  return {
    rawOutput: `// Refined Output for ${role}\n// Intent: ${userIntent}\n// Modification Brief: ${modificationPrompt || 'Initial Generation'}`,
    parsedContent: `import React from "react"; export function App() { return <div>Refined ${formattedTitle} View</div>; }`,
  };
}
