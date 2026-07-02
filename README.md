# ApexBank Dashboard 🏦

An advanced financial control panel built to simulate banking domain business rules. This project focuses strictly on modern React architecture, strict typing, fluid UX, and robust software quality principles.

## 🚀 Key Features & UX Enhancements
- **Asynchronous Data State:** Simulates live API polling with dynamic **Skeleton Loaders** to provide a polished user experience during data fetching.
- **Optimistic State Updates:** Calculations for balance and transaction history happen immediately upon submission, with full race-condition protection (disabling fields during mutation).
- **A11y & Validation:** Semantic forms using pure React state control with native validations and visual error prevention.

## 🛠️ Tech Stack & Concepts Covered
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict interface boundaries)
- **Styling:** Tailwind CSS v4 (Leveraging the new native `@theme` directive for Design System and **Theme Tokens**)
- **Architecture:** Separation of Concerns via custom stateful React Hooks (`useTransactions`), isolating enterprise business logic from presentation components.

## 🧪 Testing Strategy (100% Coverage)
This project stands out for its high reliability. Core hooks and business branch logic are thoroughly guarded using **Jest** and **React Testing Library**.

- **Unit Testing:** Validates balance accumulators and hook state evolution.
- **Asynchronous Testing:** Leverages Jest fake timers (`useFakeTimers`) to test component behavior during API delays and active form submissions.
- **Branch Coverage:** Achieved **100% Statements & Branch Coverage**, ensuring every mathematical outcome is safe from regression.

Run tests locally with coverage metrics:
\`\`\` bash
npm run test:coverage
\`\`\`

---
*Developed as a high-fidelity front-end engineering portfolio piece.*
