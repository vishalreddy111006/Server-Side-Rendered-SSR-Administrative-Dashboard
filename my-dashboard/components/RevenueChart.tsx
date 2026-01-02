"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 3800 },
  { name: "Jun", total: 5200 },
  { name: "Jul", total: 4100 },
  { name: "Aug", total: 5600 },
  { name: "Sep", total: 6100 },
  { name: "Oct", total: 5800 },
  { name: "Nov", total: 6500 },
  { name: "Dec", total: 7200 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickMargin={10}
        />
        <YAxis 
          stroke="#9ca3af" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `₹${value}`} 
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: "#fff", 
            borderRadius: "8px", 
            border: "1px solid #e5e7eb", 
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
          }}
          itemStyle={{ color: "#1f2937" }}
          formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
        />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#2563eb" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTotal)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}