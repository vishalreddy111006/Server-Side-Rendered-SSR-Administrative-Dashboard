import { prisma } from "@/lib/prisma";
import { RevenueChart } from "@/components/RevenueChart";
import { CategoryPieChart } from "@/components/CategoryPieChart"; // <--- Import New Chart
import { Package, Users, Activity, IndianRupee, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const totalRevenue = 45231.89;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store's performance</p>
      </div>
      
      {/* --- KPI CARDS --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
                <IndianRupee className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</div>
          <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
             <TrendingUp className="h-4 w-4 mr-1" />
             <span>+20.1%</span>
             <span className="text-gray-400 font-normal ml-2">from last month</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-sm font-medium text-gray-500">Products</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{productCount}</div>
          <p className="text-sm text-gray-400 mt-2">Items in inventory</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <div className="p-2 bg-amber-50 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{categoryCount}</div>
          <p className="text-sm text-gray-400 mt-2">Active categories</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <div className="p-2 bg-emerald-50 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">+573</div>
          <p className="text-sm text-gray-400 mt-2">Currently active</p>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Revenue Chart (Takes up 4 columns) */}
        <div className="col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <p className="text-sm text-gray-500">Monthly revenue analytics</p>
          </div>
          <RevenueChart />
        </div>
        
        {/* Category Pie Chart (Takes up 3 columns) */}
        <div className="col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
            <p className="text-sm text-gray-500">Distribution across top categories</p>
          </div>
           <CategoryPieChart />
        </div>
      </div>
    </div>
  );
}