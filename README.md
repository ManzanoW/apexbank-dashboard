# 🏦 ApexBank Dashboard

An engineering-first, high-fidelity financial dashboard built using **Next.js**, **TypeScript**, and **Tailwind CSS v4**. This project showcases advanced React state patterns, custom hook isolation, full responsive data visualization, local storage pipelines, and resilient multi-theme layout hydration.

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router) with fast Turbopack compilation.
- **Styling Engine:** Tailwind CSS v4 featuring native CSS design tokens.
- **State Management:** Fully isolated business logic using custom asynchronous hooks (`useTransactions`, `useTheme`).
- **Data Visualization:** Responsive chart rendering using **Recharts**.
- **Icons & Polish:** Lightweight vector components from **Lucide React**.

---

## 🚀 Key Engineering Features

### 1. Zero-Flash Native Dark Mode (FOUC Prevention)
Implements a synchronous blocking inline injection script inside the document `<head>` to query `localStorage` preferences *before* the body mounts. This completely eliminates the Flash of Unstyled Content (FOUC) common in SSR applications.

### 2. Resilient Type Narrowing for Dynamic Third-Party Modules
Employs strict type narrowing (`unknown`) on Recharts tooltip formatting to comfortably map dynamic library-emitted values (`ValueType | undefined | arrays`) without disabling rule strictness via explicit `any`.

### 3. Asynchronous Data Persistence & Local Pagination
Features a local storage pipeline that automatically caches structural inputs across browser sessions. Includes memory-efficient cursor-like data chunking (pagination slicing) that dynamically recalculates metrics depending on data filters.

### 4. Dynamic Savings Goals Tracking
Integrates a micro-interaction module for tracking multi-tier financial constraints. Leverages CSS utility keyframes to seamlessly handle progress-bar status re-computations without causing layout shifts.

---

## 📦 Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ManzanoW/apexbank-dashboard.git](https://github.com/ManzanoW/apexbank-dashboard.git)
   cd apexbank-dashboard
