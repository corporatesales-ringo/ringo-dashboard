"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Building2,
  Truck,
  Upload,
} from "lucide-react";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const pctFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const channelChartData = {
  Shopify: [
    { date: "Mar 1", current: 1050, previous: 2100 },
    { date: "Mar 2", current: 1180, previous: 1950 },
    { date: "Mar 3", current: 1240, previous: 2300 },
    { date: "Mar 4", current: 1410, previous: 1880 },
    { date: "Mar 5", current: 980, previous: 2900 },
    { date: "Mar 6", current: 930, previous: 2050 },
    { date: "Mar 7", current: 1520, previous: 2150 },
    { date: "Mar 8", current: 1110, previous: 1840 },
    { date: "Mar 9", current: 1360, previous: 2520 },
    { date: "Mar 10", current: 1280, previous: 2140 },
    { date: "Mar 11", current: 1730, previous: 2210 },
    { date: "Mar 12", current: 870, previous: 1620 },
    { date: "Mar 13", current: 1190, previous: 2250 },
    { date: "Mar 14", current: 940, previous: 3180 },
    { date: "Mar 15", current: 990, previous: 3720 },
    { date: "Mar 16", current: 950, previous: 2660 },
    { date: "Mar 17", current: 320, previous: 1710 },
  ],
  Amazon: [
    { date: "Mar 1", current: 620, previous: 1150 },
    { date: "Mar 2", current: 700, previous: 980 },
    { date: "Mar 3", current: 730, previous: 1180 },
    { date: "Mar 4", current: 810, previous: 890 },
    { date: "Mar 5", current: 520, previous: 1420 },
    { date: "Mar 6", current: 500, previous: 1110 },
    { date: "Mar 7", current: 760, previous: 1240 },
    { date: "Mar 8", current: 590, previous: 930 },
    { date: "Mar 9", current: 680, previous: 1290 },
    { date: "Mar 10", current: 630, previous: 1060 },
    { date: "Mar 11", current: 930, previous: 1020 },
    { date: "Mar 12", current: 410, previous: 810 },
    { date: "Mar 13", current: 560, previous: 1080 },
    { date: "Mar 14", current: 460, previous: 1650 },
    { date: "Mar 15", current: 480, previous: 2080 },
    { date: "Mar 16", current: 450, previous: 1470 },
    { date: "Mar 17", current: 150, previous: 920 },
  ],
  Wholesale: [
    { date: "Mar 1", current: 180, previous: 360 },
    { date: "Mar 2", current: 160, previous: 310 },
    { date: "Mar 3", current: 150, previous: 330 },
    { date: "Mar 4", current: 220, previous: 270 },
    { date: "Mar 5", current: 140, previous: 420 },
    { date: "Mar 6", current: 130, previous: 350 },
    { date: "Mar 7", current: 240, previous: 380 },
    { date: "Mar 8", current: 160, previous: 280 },
    { date: "Mar 9", current: 210, previous: 410 },
    { date: "Mar 10", current: 190, previous: 340 },
    { date: "Mar 11", current: 430, previous: 170 },
    { date: "Mar 12", current: 120, previous: 150 },
    { date: "Mar 13", current: 180, previous: 300 },
    { date: "Mar 14", current: 110, previous: 520 },
    { date: "Mar 15", current: 100, previous: 760 },
    { date: "Mar 16", current: 120, previous: 620 },
    { date: "Mar 17", current: 30, previous: 350 },
  ],
  Retail: [
    { date: "Mar 1", current: 100, previous: 190 },
    { date: "Mar 2", current: 80, previous: 110 },
    { date: "Mar 3", current: 80, previous: 240 },
    { date: "Mar 4", current: 85, previous: 140 },
    { date: "Mar 5", current: 70, previous: 285 },
    { date: "Mar 6", current: 90, previous: 370 },
    { date: "Mar 7", current: 140, previous: 280 },
    { date: "Mar 8", current: 150, previous: 190 },
    { date: "Mar 9", current: 170, previous: 200 },
    { date: "Mar 10", current: 110, previous: 140 },
    { date: "Mar 11", current: 330, previous: 60 },
    { date: "Mar 12", current: 110, previous: 160 },
    { date: "Mar 13", current: 80, previous: 310 },
    { date: "Mar 14", current: 70, previous: 510 },
    { date: "Mar 15", current: 60, previous: 530 },
    { date: "Mar 16", current: 40, previous: 430 },
    { date: "Mar 17", current: 20, previous: 230 },
  ],
} as const;

const channelRows = [
  { channel: "Shopify", revenue: 18420, orders: 302, units: 364, aov: 61, fill: 0.53, icon: Store },
  { channel: "Amazon", revenue: 10895, orders: 189, units: 248, aov: 58, fill: 0.31, icon: ShoppingBag },
  { channel: "Wholesale", revenue: 3900, orders: 6, units: 180, aov: 650, fill: 0.11, icon: Building2 },
  { channel: "Retail", revenue: 1337, orders: 3, units: 64, aov: 446, fill: 0.05, icon: Truck },
];

function KpiCard({ title, value, subtext, icon: Icon }: any) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5 flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
        <Icon className="h-5 w-5 text-slate-600" />
      </CardContent>
    </Card>
  );
}

function ChannelCard({ row }: any) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">{row.channel}</p>
            <p className="text-xl font-semibold mt-2">{currencyFmt.format(row.revenue)}</p>
            <p className="text-xs text-slate-400">{numberFmt.format(row.orders)} orders</p>
          </div>
          <Badge>{pctFmt.format(row.fill)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "Shopify",
    "Amazon",
    "Wholesale",
    "Retail",
  ]);

  const filteredRows = useMemo(
    () => channelRows.filter((row) => selectedChannels.includes(row.channel)),
    [selectedChannels]
  );

  const totalRevenue = useMemo(
    () => filteredRows.reduce((s, r) => s + r.revenue, 0),
    [filteredRows]
  );
  const totalOrders = useMemo(
    () => filteredRows.reduce((s, r) => s + r.orders, 0),
    [filteredRows]
  );
  const aov = totalOrders ? totalRevenue / totalOrders : 0;

  const combinedChartData = useMemo(() => {
    const dates = channelChartData.Shopify.map((d) => d.date);
    return dates.map((date, index) => {
      const current = selectedChannels.reduce((sum, channel) => {
        const key = channel as keyof typeof channelChartData;
        return sum + channelChartData[key][index].current;
      }, 0);
      const previous = selectedChannels.reduce((sum, channel) => {
        const key = channel as keyof typeof channelChartData;
        return sum + channelChartData[key][index].previous;
      }, 0);
      return { date, current, previous };
    });
  }, [selectedChannels]);

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channel)) {
        return prev.length === 1 ? prev : prev.filter((c) => c !== channel);
      }
      return [...prev, channel];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Revenue dashboard</h1>
            <p className="text-sm text-slate-500">Toggle channels to compare revenue by source</p>
          </div>
          <Button className="rounded-xl">
            <Upload className="h-4 w-4 mr-2" /> Connect
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <KpiCard title="Net sales" value={currencyFmt.format(totalRevenue)} subtext="Selected channels" icon={TrendingUp} />
          <KpiCard title="Orders" value={numberFmt.format(totalOrders)} subtext="Across selected channels" icon={ShoppingBag} />
          <KpiCard title="AOV" value={currencyFmt.format(aov)} subtext="Blended average order value" icon={Store} />
        </div>

        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Total sales</CardTitle>
            <div className="flex flex-wrap gap-2">
              {channelRows.map((row) => {
                const active = selectedChannels.includes(row.channel);
                return (
                  <Button
                    key={row.channel}
                    variant={active ? "default" : "outline"}
                    className={active ? "rounded-full" : "rounded-full bg-white"}
                    onClick={() => toggleChannel(row.channel)}
                  >
                    {row.channel}
                  </Button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} />
                  <Tooltip formatter={(v: any) => [currencyFmt.format(Number(v ?? 0)), ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="current" name="Current period" stroke="#0f172a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="previous" name="Comparison period" stroke="#94a3b8" strokeWidth={3} strokeDasharray="4 8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {filteredRows.map((r) => (
            <ChannelCard key={r.channel} row={r} />
          ))}
        </div>
      </div>
    </div>
  );
}