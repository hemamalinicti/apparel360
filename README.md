# Apparel360 - Garments Inventory & Stock ERP Management System

A modern, responsive, and robust Garment Stock & Inventory ERP web application designed for apparel retailers, garment manufacturers, and boutiques.

## 🚀 Features

- **Dashboard & KPIs**: Real-time sales metrics, revenue overview, low stock alerts, top-selling apparel items, and stock movement analysis.
- **Product Catalog Management**: Multi-attribute garment tracking (size, color, category, fabric, SKU, barcode, unit cost, retail price, stock levels).
- **Point of Sale (POS)**: Fast barcode-supported checkout, dynamic tax/discount calculations, and instant digital receipt generation.
- **Stock Movement & Inward Procurement**: Supplier purchase orders, batch receiving, manual adjustments (damage, shrinkage, count reconciliation), and audit history logs.
- **Supplier Directory**: Vendor management with credit tracking, contact details, payment terms, and supply histories.
- **Financial & Inventory Reports**: Exportable reports, profit margins, sales breakdown by category, and stock valuation.
- **Master Data Customization**: Manage categories, sizes (S, M, L, XL, etc.), color codes, fabric blends, and tax presets.
- **Role-Based Authentication**: Secure Admin and Store Staff access modes with local persistence.
- **Responsive Mobile First Design**: Clean UI optimized for desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Storage**: LocalStorage with state persistence

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate into the project folder
cd Garments

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The output will be created in the `dist/` directory.

## 🔒 Security Best Practices
- No secrets or API credentials are hardcoded.
- Input sanitation and safe state management.
- Standard `.gitignore` prevents sensitive local files and dependencies from leaking.

---
© Apparel360 ERP. All rights reserved.
