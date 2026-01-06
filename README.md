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

## 📂 Project Structure
```bash
 my-dashboard/
 ├── app/
 │   ├── dashboard/       # Protected routes (Charts, Products, etc.)
 │   ├── login/           # Authentication pages
 │   └── api/             # NextAuth route handlers
 ├── components/          # Reusable UI (Charts, Tables, Skeletons)
 ├── lib/
 │   ├── prisma.ts        # Database client singleton
 │   └── actions.ts       # Server Actions for CRUD logic
 ├── prisma/
 │   └── schema.prisma    # Database schema definition
 └── public/              # Static assets   
```
## ⚙️ Setup & Installation Instructions

Follow these steps to set up the project locally.
```bash
1. Clone the Repository
git clone [https://github.com/vishalreddy111006/Server-Side-Rendered-SSR-Administrative-Dashboard.git](https://github.com/vishalreddy111006/Server-Side-Rendered-SSR-Administrative-Dashboard.git)
cd Server-Side-Rendered-SSR-Administrative-Dashboard/my-dashboard

2. Install Dependencies
Bash
npm install

3. Configure Environment Variables
Create a .env file in the root directory (my-dashboard/.env) and add the following keys:

# MongoDB Connection String
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/my-dashboard"

# Secret key for NextAuth (You can generate one using `openssl rand -base64 32`)
AUTH_SECRET="your_super_secret_key_here"

4. Database Setup
Generate the Prisma client to sync your project with the MongoDB schema:

Bash
npx prisma generate
(Optional) push the schema to the database if starting fresh:

Bash
npx prisma db push

5. Run the Application
Start the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser to view the dashboard.
```

## Working Video:
   drive-https://drive.google.com/file/d/1X-XdqtMufztLUSjoCgMC9TQTH8NPaK7q/view?usp=sharing
## Dummy Super Admin Credentials:
 id - admin@demo.com
 password - admin123
## Dummy Admin Credentials:
 id - new.admin@company.com
 password - newadmin
## Dummy User Credentials:
 id - user@demo.com
 password - user123


