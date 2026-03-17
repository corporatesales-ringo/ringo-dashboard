"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Calendar, TrendingUp, Target, Store, ShoppingBag, Truck, Building2, Plus, Upload, Database } from "lucide-react";

const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const pctFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const chartData = [
  { date: "Mar 1", current: 1950, previous: 3800, goal: 2500 },
  { date: "Mar 2", current: 2120, previous: 3350, goal: 2500 },
  { date: "Mar 3", current: 2200, previous: 4050, goal: 2500 },
  { date: "Mar 4", current: 2525, previous: 3180, goal: 2500 },
  { date: "Mar 5", current: 1710, previous: 5025, goal: 2500 },
  { date: "Mar 6", current: 1650, previous: 3880, goal: 2500 },
  { date: "Mar 7", current: 2660, previous: 4050, goal: 2500 },
  { date: "Mar 8", current: 2010, previous: 3240, goal: 2500 },
  { date: "Mar 9", current: 2420, previous: 4420, goal: 2500 },
  { date: "Mar 10", current: 2210, previous: 3680, goal: 2500 },
  { date: "Mar 11", current: 3420, previous: 3460, goal: 2500 },
  { date: "Mar 12", current: 1510, previous: 2740, goal: 2500 },
  { date: "Mar 13", current: 2010, previous: 3940, goal: 2500 },
  { date: "Mar 14", current: 1580, previous: 5860, goal: 2500 },
  { date: "Mar 15", current: 1630, previous: 7090, goal: 2500 },
  { date: "Mar 16", current: 1560, previous: 5180, goal: 2500 },
  { date: "Mar 17", current: 520, previous: 3210, goal: 2500 },
];

const channelRows = [
  { channel: "Shopify", revenue: 18420, orders: 302, units: 364, aov: 61, fill: 0.53, icon: Store },
  { channel: "Amazon", revenue: 10895, orders: 189, units: 248, aov: 58, fill: 0.31, icon: ShoppingBag },
  { channel: "Wholesale", revenue: 3900, orders: 6, units: 180, aov: 650, fill: 0.11, icon: Building2 },
  { channel: "Retail", revenue: 1337, orders: 3, units: 64, aov: 446, fill: 0.05, icon: Truck },
];

const manualSeed = [
  { date: "2026-03-05", channel: "Wholesale", account: "Nordic Shop", amount: 1200, notes: "Spring reorder" },
  { date: "2026-03-09", channel: "Retail", account: "Pop-up Event", amount: 480, notes: "Weekend event" },
  { date: "2026-03-11", channel: "Wholesale", account: "Club Account", amount: 2700, notes: "Case pack PO" },
  { date: "2026-03-15", channel: "Retail", account: "Local partner", amount: 857, notes: "In-store sell through" },
];

const goals = {
  monthTarget: 75000,
  quarterTarget: 240000,
  ytdTarget: 780000,
};

type ManualChannel = "Wholesale" | "Retail";

function cn(...classes: Array<string | boolean | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function KpiCard({
  title,
  value,
  subtext,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{subtext}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelCard({
  label,
  revenue,
  orders,
  icon: Icon,
  percent,
}: {
  label: string;
  revenue: number;
  orders: number;
  icon: React.ComponentType<{ className?: string }>;
  percent: number;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-slate-700">{label}</p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{currencyFmt.format(revenue)}</p>
            <p className="mt-1 text-sm text-slate-500">{numberFmt.format(orders)} orders</p>
          </div>
          <Badge variant="secondary" className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {pctFmt.format(percent)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RevenueDashboardReact() {
  const [range, setRange] = useState("mtd");
  const [compareMode, setCompareMode] = useState("lastYear");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["Shopify", "Amazon", "Wholesale", "Retail"]);
  const [manualRows, setManualRows] = useState<typeof manualSeed>(manualSeed);
  const [form, setForm] = useState<{
    date: string;
    channel: ManualChannel;
    account: string;
    amount: string;
    notes: string;
  }>({ date: "", channel: "Wholesale", account: "", amount: "", notes: "" });

  const totalRevenue = useMemo(
    () => channelRows.filter((r) => selectedChannels.includes(r.channel)).reduce((sum, r) => sum + r.revenue, 0),
    [selectedChannels]
  );

  const totalOrders = useMemo(
    () => channelRows.filter((r) => selectedChannels.includes(r.channel)).reduce((sum, r) => sum + r.orders, 0),
    [selectedChannels]
  );

  const aov = totalOrders ? totalRevenue / totalOrders : 0;
  const goalAttainment = totalRevenue / goals.monthTarget;
  const gapToGoal = Math.max(goals.monthTarget - totalRevenue, 0);
  const daysElapsed = chartData.length;
  const daysInMonth = 31;
  const daysRemaining = Math.max(daysInMonth - daysElapsed, 0);
  const requiredDailyRunRate = daysRemaining ? gapToGoal / daysRemaining : 0;

  const filteredChart = useMemo(() => {
    if (range === "7d") return chartData.slice(-7);
    if (range === "30d") return chartData;
    return chartData;
  }, [range]);

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const addManualRow = () => {
    if (!form.date || !form.channel || !form.account || !form.amount) return;
    setManualRows((prev) => [
      {
        date: form.date,
        channel: form.channel,
        account: form.account,
        amount: Number(form.amount),
        notes: form.notes,
      },
      ...prev,
    ]);
    setForm({ date: "", channel: "Wholesale", account: "", amount: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">Revenue OS</Badge>
              <Badge variant="secondary" className="rounded-full">Auto-sync ready</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Revenue reporting + goals dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Shopify-style revenue view with channel rollups, goal pacing, Amazon sell-through placeholders, and manual wholesale / retail inputs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={range} onValueChange={setRange} className="w-auto">
              <TabsList className="rounded-2xl bg-white shadow-sm">
                <TabsTrigger value="7d">Last 7 days</TabsTrigger>
                <TabsTrigger value="mtd">MTD</TabsTrigger>
                <TabsTrigger value="30d">Last 30 days</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={compareMode} onValueChange={setCompareMode}>
              <SelectTrigger className="w-[170px] rounded-2xl border-0 bg-white shadow-sm">
                <SelectValue placeholder="Compare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastYear">Compare: last year</SelectItem>
                <SelectItem value="priorPeriod">Compare: prior period</SelectItem>
                <SelectItem value="plan">Compare: plan</SelectItem>
              </SelectContent>
            </Select>

            <Button className="rounded-2xl gap-2">
              <Upload className="h-4 w-4" />
              Connect data
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Net sales"
            value={currencyFmt.format(totalRevenue)}
            subtext={`${pctFmt.format(goalAttainment)} of monthly target`}
            icon={TrendingUp}
          />
          <KpiCard
            title="Orders"
            value={numberFmt.format(totalOrders)}
            subtext="Across selected channels"
            icon={ShoppingBag}
          />
          <KpiCard
            title="Average order value"
            value={currencyFmt.format(aov)}
            subtext="Blended AOV"
            icon={Store}
          />
          <KpiCard
            title="Gap to goal"
            value={currencyFmt.format(gapToGoal)}
            subtext={`${currencyFmt.format(requiredDailyRunRate)}/day needed to hit month`}
            icon={Target}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-xl">Total sales over time</CardTitle>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-4xl font-semibold tracking-tight">{currencyFmt.format(totalRevenue)}</span>
                    <span className="mb-1 text-sm text-slate-500">vs comparison period</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {channelRows.map((row) => (
                    <Button
                      key={row.channel}
                      variant="outline"
                      onClick={() => toggleChannel(row.channel)}
                      className={cn(
                        "rounded-full border-slate-200 bg-white",
                        selectedChannels.includes(row.channel) && "border-slate-900 bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      {row.channel}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredChart} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value: number) => `$${value / 1000}K`}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
                      formatter={(value: number | string) => [currencyFmt.format(Number(value)), ""]}
                    />
                    <Legend />
                    <ReferenceLine y={2500} stroke="#94a3b8" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Mar 1–17, 2026"
                      strokeWidth={3}
                      dot={false}
                      stroke="#0f172a"
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      name={compareMode === "lastYear" ? "Mar 1–17, 2025" : compareMode === "priorPeriod" ? "Prior period" : "Plan"}
                      strokeWidth={3}
                      dot={false}
                      stroke="#94a3b8"
                      strokeDasharray="4 8"
                    />
                    <Line
                      type="monotone"
                      dataKey="goal"
                      name="Daily goal"
                      strokeWidth={2}
                      dot={false}
                      stroke="#cbd5e1"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Goal pacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Month target</span>
                    <span className="font-medium">{currencyFmt.format(goals.monthTarget)}</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.min(goalAttainment * 100, 100)}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>Actual: {currencyFmt.format(totalRevenue)}</span>
                    <span>{pctFmt.format(goalAttainment)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Days remaining</p>
                    <p className="mt-2 text-2xl font-semibold">{daysRemaining}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Run rate needed</p>
                    <p className="mt-2 text-2xl font-semibold">{currencyFmt.format(requiredDailyRunRate)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  Add monthly, quarterly, and channel-specific goals from a settings panel later. This is wired as static mock data for now.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Data connections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-slate-900">Shopify Admin API</p>
                      <p>Daily orders + net sales sync</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Ready</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-slate-900">Amazon SP-API</p>
                      <p>Orders + sell-through sync</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">Needs setup</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-slate-900">Manual wholesale / retail</p>
                      <p>Simple add-row flow below</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-200">Live input</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Channel performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {channelRows.map((row) => (
                  <ChannelCard
                    key={row.channel}
                    label={row.channel}
                    revenue={row.revenue}
                    orders={row.orders}
                    percent={row.fill}
                    icon={row.icon}
                  />
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <div>Channel</div>
                  <div>Revenue</div>
                  <div>Orders</div>
                  <div>Units</div>
                  <div>AOV</div>
                </div>
                {channelRows.map((row) => (
                  <div key={row.channel} className="grid grid-cols-5 gap-4 px-4 py-4 text-sm border-b border-slate-100 last:border-0">
                    <div className="font-medium text-slate-900">{row.channel}</div>
                    <div>{currencyFmt.format(row.revenue)}</div>
                    <div>{numberFmt.format(row.orders)}</div>
                    <div>{numberFmt.format(row.units)}</div>
                    <div>{currencyFmt.format(row.aov)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Manual entries</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl gap-2">
                    <Plus className="h-4 w-4" />
                    Add entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add wholesale / retail revenue</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 pt-2">
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Channel</Label>
                      <Select
                        value={form.channel}
                        onValueChange={(v) =>
                          setForm({ ...form, channel: v as "Wholesale" | "Retail" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wholesale">Wholesale</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Account</Label>
                      <Input value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} placeholder="Account or customer" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Amount</Label>
                      <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Notes</Label>
                      <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
                    </div>
                    <Button onClick={addManualRow} className="rounded-2xl">Save entry</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {manualRows.map((row, idx) => (
                  <div key={`${row.date}-${row.account}-${idx}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{row.account}</p>
                          <Badge variant="secondary" className="rounded-full">{row.channel}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{row.date}</p>
                        {row.notes ? <p className="mt-2 text-sm text-slate-600">{row.notes}</p> : null}
                      </div>
                      <div className="text-right font-semibold text-slate-900">{currencyFmt.format(row.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
