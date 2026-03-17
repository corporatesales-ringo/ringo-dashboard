"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, ShoppingBag, Target } from "lucide-react";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const chartData = [
  { date: "Mar 1", current: 1950, previous: 3800 },
  { date: "Mar 2", current: 2120, previous: 3350 },
  { date: "Mar 3", current: 2200, previous: 4050 },
  { date: "Mar 4", current: 2525, previous: 3180 },
  { date: "Mar 5", current: 1710, previous: 5025 },
  { date: "Mar 6", current: 1650, previous: 3880 },
  { date: "Mar 7", current: 2660, previous: 4050 },
];

function Kpi({ title, value, icon: Icon }: any) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5 flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-slate-600" />
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const totalRevenue = useMemo(() => chartData.reduce((s, r) => s + r.current, 0), []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="grid grid-cols-3 gap-4">
          <Kpi title="Revenue" value={currencyFmt.format(totalRevenue)} icon={TrendingUp} />
          <Kpi title="Orders" value="491" icon={ShoppingBag} />
          <Kpi title="Goal" value="75%" icon={Target} />
        </div>

        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} />
                  <Tooltip formatter={(v: any) => [currencyFmt.format(Number(v ?? 0)), ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#0f172a" strokeWidth={3} />
                  <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}