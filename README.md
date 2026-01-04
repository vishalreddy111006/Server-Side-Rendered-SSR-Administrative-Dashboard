# Server-Side Rendered (SSR) Administrative Dashboard

A robust, full-stack administrative dashboard built with **Next.js 15 (App Router)**. This application features secure role-based authentication, comprehensive product management, and real-time data visualization, designed to simulate a professional e-commerce backend.

## 🚀 Key Features

* **🔐 Role-Based Authentication (RBAC):**
    * Secure Login/Signup flows using **NextAuth.js (v5)**.
    * **Admin Access:** Full control to Create, Read, Update, and Delete (CRUD) products.
    * **User Access:** Read-only mode with restricted visibility on administrative actions.

* **📦 Advanced Product Management:**
    * **CRUD Operations:** Add new products, update details (price/stock), and delete items.
    * **Interactive Table:** Client-side search and filtering for instant product lookup.
    * **Status Indicators:** Visual badges for "In Stock", "Low Stock", and "Out of Stock" states.

* **📊 Visual Analytics:**
    * **Revenue Chart:** Interactive area chart with gradient fills showing financial performance over time (powered by **Recharts**).
    * **Category Distribution:** Donut chart visualizing inventory distribution across different categories.

* **⚡ Optimized User Experience:**
    * **Server-Side Rendering (SSR):** Fast initial load times and SEO-friendly pages.
    * **Skeleton Loaders:** Smooth loading states preventing layout shifts while fetching data.
    * **Toast Notifications:** Instant feedback (Success/Error) for actions like deleting products, powered by **Sonner**.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** MongoDB (Atlas)
* **ORM:** Prisma
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Charts:** Recharts
* **Authentication:** NextAuth.js
* **UI Components:** Sonner (Toasts), clsx, tailwind-merge

## ⚙️ Setup & Installation Instructions

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/vishalreddy111006/Server-Side-Rendered-SSR-Administrative-Dashboard.git](https://github.com/vishalreddy111006/Server-Side-Rendered-SSR-Administrative-Dashboard.git)
cd Server-Side-Rendered-SSR-Administrative-Dashboard/my-dashboard
