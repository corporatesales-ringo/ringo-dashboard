"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Building2,
  Truck,
  Upload,
  CalendarRange,
  Target,
  X,
  HandCoins,
  Search,
  FileBarChart2,
  LayoutDashboard,
  Download,
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

const palette = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1"];

const viewOptions = [
  { key: "daily", label: "Daily", mode: "daily" },
  { key: "weekly", label: "Weekly", mode: "daily" },
  { key: "monthly", label: "Monthly", mode: "daily" },
  { key: "quarterly", label: "Quarter", mode: "monthly" },
  { key: "annual", label: "Annual", mode: "monthly" },
  { key: "custom", label: "Custom", mode: "daily" },
] as const;

const quarterOptions = [
  { key: "Q1", label: "Q1", months: ["Jan", "Feb", "Mar"] },
  { key: "Q2", label: "Q2", months: ["Apr", "May", "Jun"] },
  { key: "Q3", label: "Q3", months: ["Jul", "Aug", "Sep"] },
  { key: "Q4", label: "Q4", months: ["Oct", "Nov", "Dec"] },
] as const;

type ViewKey = (typeof viewOptions)[number]["key"];

const goalMonths = [
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
  "2026-12",
] as const;

type ChannelName = "Shopify" | "Amazon" | "Corporate" | "Retail";
type PageTab = "dashboard" | "reports";

type GoalShape = {
  total: number;
  channels: Record<ChannelName, number>;
};

type ManualEntry = {
  id: number;
  date: string;
  month: string;
  channel: ChannelName;
  account: string;
  amount: number;
  notes: string;
};

type DailyPoint = { date: string; current: number; previous: number };
type MonthlyPoint = { month: string; current: number; previous: number };

const initialGoalsByMonth: Record<string, GoalShape> = {
  "2026-01": { total: 42000, channels: { Shopify: 22000, Amazon: 12000, Corporate: 5000, Retail: 3000 } },
  "2026-02": { total: 48000, channels: { Shopify: 25000, Amazon: 14000, Corporate: 6000, Retail: 3000 } },
  "2026-03": { total: 50000, channels: { Shopify: 26000, Amazon: 14500, Corporate: 6500, Retail: 3000 } },
  "2026-04": { total: 55000, channels: { Shopify: 29000, Amazon: 15500, Corporate: 7000, Retail: 3500 } },
  "2026-05": { total: 60000, channels: { Shopify: 31500, Amazon: 17000, Corporate: 8000, Retail: 3500 } },
  "2026-06": { total: 65000, channels: { Shopify: 34000, Amazon: 18000, Corporate: 9000, Retail: 4000 } },
  "2026-07": { total: 62000, channels: { Shopify: 33000, Amazon: 17000, Corporate: 8000, Retail: 4000 } },
  "2026-08": { total: 66000, channels: { Shopify: 35000, Amazon: 18000, Corporate: 9000, Retail: 4000 } },
  "2026-09": { total: 64000, channels: { Shopify: 33500, Amazon: 17500, Corporate: 9000, Retail: 4000 } },
  "2026-10": { total: 68000, channels: { Shopify: 36000, Amazon: 18500, Corporate: 9500, Retail: 4000 } },
  "2026-11": { total: 72000, channels: { Shopify: 38500, Amazon: 19500, Corporate: 10000, Retail: 4000 } },
  "2026-12": { total: 78000, channels: { Shopify: 42000, Amazon: 21000, Corporate: 11000, Retail: 4000 } },
};

const dailyChartData = {
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
  Corporate: [
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
} as const satisfies Record<ChannelName, ReadonlyArray<DailyPoint>>;

const monthlyChartData = {
  Shopify: [
    { month: "Jan", current: 22000, previous: 19000 },
    { month: "Feb", current: 24500, previous: 20500 },
    { month: "Mar", current: 26000, previous: 22000 },
    { month: "Apr", current: 28200, previous: 23500 },
    { month: "May", current: 30400, previous: 24800 },
    { month: "Jun", current: 31800, previous: 25900 },
    { month: "Jul", current: 32600, previous: 26800 },
    { month: "Aug", current: 34100, previous: 27700 },
    { month: "Sep", current: 33300, previous: 27100 },
    { month: "Oct", current: 35800, previous: 28600 },
    { month: "Nov", current: 38200, previous: 30000 },
    { month: "Dec", current: 42500, previous: 33800 },
  ],
  Amazon: [
    { month: "Jan", current: 11800, previous: 10200 },
    { month: "Feb", current: 13200, previous: 11100 },
    { month: "Mar", current: 14500, previous: 12100 },
    { month: "Apr", current: 15100, previous: 12900 },
    { month: "May", current: 16400, previous: 13600 },
    { month: "Jun", current: 17600, previous: 14400 },
    { month: "Jul", current: 16900, previous: 13800 },
    { month: "Aug", current: 18100, previous: 14900 },
    { month: "Sep", current: 17300, previous: 14500 },
    { month: "Oct", current: 18600, previous: 15200 },
    { month: "Nov", current: 19800, previous: 16100 },
    { month: "Dec", current: 21200, previous: 17600 },
  ],
  Corporate: [
    { month: "Jan", current: 5200, previous: 4600 },
    { month: "Feb", current: 5800, previous: 4900 },
    { month: "Mar", current: 6500, previous: 5300 },
    { month: "Apr", current: 7100, previous: 5600 },
    { month: "May", current: 7900, previous: 6100 },
    { month: "Jun", current: 8600, previous: 6700 },
    { month: "Jul", current: 8200, previous: 6400 },
    { month: "Aug", current: 8800, previous: 7000 },
    { month: "Sep", current: 9100, previous: 7200 },
    { month: "Oct", current: 9600, previous: 7600 },
    { month: "Nov", current: 10200, previous: 8100 },
    { month: "Dec", current: 11000, previous: 8900 },
  ],
  Retail: [
    { month: "Jan", current: 3000, previous: 2500 },
    { month: "Feb", current: 3100, previous: 2600 },
    { month: "Mar", current: 3000, previous: 2700 },
    { month: "Apr", current: 3500, previous: 2900 },
    { month: "May", current: 3600, previous: 3000 },
    { month: "Jun", current: 3900, previous: 3200 },
    { month: "Jul", current: 3800, previous: 3150 },
    { month: "Aug", current: 4050, previous: 3300 },
    { month: "Sep", current: 3950, previous: 3250 },
    { month: "Oct", current: 4100, previous: 3400 },
    { month: "Nov", current: 4300, previous: 3550 },
    { month: "Dec", current: 4500, previous: 3700 },
  ],
} as const satisfies Record<ChannelName, ReadonlyArray<MonthlyPoint>>;

const baseChannelRows = [
  { channel: "Shopify" as const, revenue: 18420, orders: 302, units: 364, aov: 61, fill: 0.53, icon: Store },
  { channel: "Amazon" as const, revenue: 10895, orders: 189, units: 248, aov: 58, fill: 0.31, icon: ShoppingBag },
  { channel: "Corporate" as const, revenue: 3900, orders: 6, units: 180, aov: 650, fill: 0.11, icon: Building2 },
  { channel: "Retail" as const, revenue: 1337, orders: 3, units: 64, aov: 446, fill: 0.05, icon: Truck },
] as const;

const initialManualEntries: ManualEntry[] = [
  { id: 1, date: "2026-03-06", month: "2026-03", channel: "Corporate", account: "Foxtrot", amount: 1200, notes: "Spring reorder" },
  { id: 2, date: "2026-03-11", month: "2026-03", channel: "Retail", account: "Pop-up Event", amount: 857, notes: "Weekend sell-through" },
  { id: 3, date: "2026-03-14", month: "2026-03", channel: "Corporate", account: "Club Account", amount: 1800, notes: "Case pack PO" },
  { id: 4, date: "2026-03-15", month: "2026-03", channel: "Corporate", account: "Foxtrot", amount: 950, notes: "Fill-in order" },
  { id: 5, date: "2026-03-12", month: "2026-03", channel: "Retail", account: "Door County Shop", amount: 640, notes: "Store replenishment" },
  { id: 6, date: "2026-03-09", month: "2026-03", channel: "Corporate", account: "Nordstrom Local", amount: 2200, notes: "Launch order" },
];

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

function ChannelCard({
  row,
  onClick,
  active,
}: {
  row: (typeof baseChannelRows)[number] & { revenue: number; aov: number };
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Card
      className={`rounded-2xl border-0 shadow-sm cursor-pointer transition hover:shadow-md ${
        active ? "ring-2 ring-slate-900" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">{row.channel}</p>
            <p className="text-xl font-semibold mt-2">
              {currencyFmt.format(row.revenue)}
            </p>
            <p className="text-xs text-slate-400">
              {numberFmt.format(row.orders)} orders
            </p>
          </div>
          <Badge>{pctFmt.format(row.fill)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<PageTab>("dashboard");
  const [selectedChannels, setSelectedChannels] = useState<ChannelName[]>([
    "Shopify",
    "Amazon",
    "Corporate",
    "Retail",
  ]);
  const [selectedView, setSelectedView] = useState<ViewKey>("monthly");
  const [selectedQuarter, setSelectedQuarter] =
    useState<(typeof quarterOptions)[number]["key"]>("Q1");
  const [customStart, setCustomStart] = useState("2026-03-01");
  const [customEnd, setCustomEnd] = useState("2026-03-17");
  const [showGoals, setShowGoals] = useState(false);
  const [selectedGoalMonth, setSelectedGoalMonth] =
    useState<string>("2026-03");
  const [goalsByMonth, setGoalsByMonth] =
    useState<Record<string, GoalShape>>(initialGoalsByMonth);
  const [selectedDetailChannel, setSelectedDetailChannel] =
    useState<ChannelName | null>(null);
  const [manualEntries, setManualEntries] =
    useState<ManualEntry[]>(initialManualEntries);
  const [newManualEntry, setNewManualEntry] = useState<
    Omit<ManualEntry, "id">
  >({
    date: "2026-03-18",
    month: "2026-03",
    channel: "Corporate",
    account: "",
    amount: 0,
    notes: "",
  });
  const [reportSearch, setReportSearch] = useState("");
  const [reportChannel, setReportChannel] =
    useState<"All" | ChannelName>("All");
  const [reportStart, setReportStart] = useState("2026-03-01");
  const [reportEnd, setReportEnd] = useState("2026-03-31");

  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");

  const manualRevenueByChannel = useMemo(() => {
    return manualEntries.reduce<Record<ChannelName, number>>(
      (acc, entry) => {
        acc[entry.channel] += entry.amount;
        return acc;
      },
      { Shopify: 0, Amazon: 0, Corporate: 0, Retail: 0 }
    );
  }, [manualEntries]);

  const channelRows = useMemo(() => {
    return baseChannelRows.map((row) => {
      const revenue = row.revenue + manualRevenueByChannel[row.channel];
      const aov = row.orders ? revenue / row.orders : 0;
      return {
        ...row,
        revenue,
        aov,
      };
    });
  }, [manualRevenueByChannel]);

  const filteredRows = useMemo(
    () => channelRows.filter((row) => selectedChannels.includes(row.channel)),
    [channelRows, selectedChannels]
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
  const activeGoal = goalsByMonth[selectedGoalMonth]?.total ?? 0;
  const goalGap = Math.max(activeGoal - totalRevenue, 0);
  const goalAttainment = activeGoal ? totalRevenue / activeGoal : 0;

  const chartMode = useMemo(() => {
    const selected = viewOptions.find((option) => option.key === selectedView);
    return selected?.mode ?? "daily";
  }, [selectedView]);

  const customVisibleLength = useMemo(() => {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    const diff = Math.max(
      1,
      Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
    return Math.min(diff, dailyChartData.Shopify.length);
  }, [customStart, customEnd]);

  const combinedChartData = useMemo(() => {
    if (chartMode === "monthly") {
      let monthSubset = monthlyChartData.Shopify;
      if (selectedView === "quarterly") {
        const selected = quarterOptions.find((q) => q.key === selectedQuarter);
        monthSubset = monthlyChartData.Shopify.filter((point) =>
          selected?.months.includes(point.month)
        );
      }
      return monthSubset.map((point) => {
        const sourceIndex = monthlyChartData.Shopify.findIndex(
          (m) => m.month === point.month
        );
        const base: Record<string, string | number> = { label: point.month };
        let previous = 0;
        selectedChannels.forEach((channel) => {
          const channelPoint = monthlyChartData[channel][sourceIndex];
          base[channel] = channelPoint.current;
          previous += channelPoint.previous;
        });
        base.previous = previous;
        return base;
      });
    }

    const visibleLength =
      selectedView === "daily"
        ? 7
        : selectedView === "weekly"
        ? 14
        : selectedView === "custom"
        ? customVisibleLength
        : 17;

    const dates = dailyChartData.Shopify.slice(-visibleLength).map((d) => d.date);

    return dates.map((date, index) => {
      const sourceIndex = dailyChartData.Shopify.length - visibleLength + index;
      const base: Record<string, string | number> = { label: date };
      let previous = 0;
      selectedChannels.forEach((channel) => {
        const point = dailyChartData[channel][sourceIndex];
        const manualBump = channel === "Corporate" || channel === "Retail" ? 35 : 0;
        base[channel] = point.current + manualBump;
        previous += point.previous;
      });
      base.previous = previous;
      return base;
    });
  }, [chartMode, selectedChannels, selectedView, selectedQuarter, customVisibleLength]);

  const mixData = useMemo(
    () => filteredRows.map((row) => ({ name: row.channel, value: row.revenue })),
    [filteredRows]
  );

  const selectedDetailRow = useMemo(
    () => channelRows.find((row) => row.channel === selectedDetailChannel) ?? null,
    [channelRows, selectedDetailChannel]
  );

  const channelGoal = selectedDetailChannel
    ? goalsByMonth[selectedGoalMonth]?.channels[selectedDetailChannel] ?? 0
    : 0;

  const channelAttainment =
    selectedDetailRow && channelGoal
      ? selectedDetailRow.revenue / channelGoal
      : 0;

  const channelGap = selectedDetailRow
    ? Math.max(channelGoal - selectedDetailRow.revenue, 0)
    : 0;

  const detailChartData = useMemo(() => {
    if (!selectedDetailChannel) return [] as Array<Record<string, string | number>>;

    if (chartMode === "monthly") {
      let subset = monthlyChartData[selectedDetailChannel];
      if (selectedView === "quarterly") {
        const selected = quarterOptions.find((q) => q.key === selectedQuarter);
        subset = monthlyChartData[selectedDetailChannel].filter((point) =>
          selected?.months.includes(point.month)
        );
      }
      return subset.map((point) => ({
        label: point.month,
        current: point.current,
        previous: point.previous,
      }));
    }

    const visibleLength =
      selectedView === "daily"
        ? 7
        : selectedView === "weekly"
        ? 14
        : selectedView === "custom"
        ? customVisibleLength
        : 17;

    return dailyChartData[selectedDetailChannel]
      .slice(-visibleLength)
      .map((point) => ({
        label: point.date,
        current: point.current,
        previous: point.previous,
      }));
  }, [selectedDetailChannel, chartMode, selectedView, selectedQuarter, customVisibleLength]);

  const reportRows = useMemo(() => {
    return manualEntries
      .filter((entry) => {
        const matchesSearch =
          !reportSearch ||
          entry.account.toLowerCase().includes(reportSearch.toLowerCase());
        const matchesChannel =
          reportChannel === "All" || entry.channel === reportChannel;
        const matchesStart = !reportStart || entry.date >= reportStart;
        const matchesEnd = !reportEnd || entry.date <= reportEnd;
        return matchesSearch && matchesChannel && matchesStart && matchesEnd;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [manualEntries, reportSearch, reportChannel, reportStart, reportEnd]);

  const reportSummary = useMemo(() => {
    const total = reportRows.reduce((sum, row) => sum + row.amount, 0);
    const orders = reportRows.length;
    const average = orders ? total / orders : 0;
    const lastOrder = orders ? reportRows[reportRows.length - 1].date : "—";
    const customerLabel = reportSearch || "All customers";
    return { total, orders, average, lastOrder, customerLabel };
  }, [reportRows, reportSearch]);

  const toggleChannel = (channel: ChannelName) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channel)) {
        return prev.length === 1 ? prev : prev.filter((c) => c !== channel);
      }
      return [...prev, channel];
    });
  };

  const updateGoal = (month: string, field: "total" | ChannelName, value: string) => {
    const parsed = Number(value || 0);
    setGoalsByMonth((prev) => {
      const current = prev[month] ?? {
        total: 0,
        channels: { Shopify: 0, Amazon: 0, Corporate: 0, Retail: 0 },
      };
      if (field === "total") {
        return {
          ...prev,
          [month]: { ...current, total: parsed },
        };
      }
      return {
        ...prev,
        [month]: {
          ...current,
          channels: {
            ...current.channels,
            [field]: parsed,
          },
        },
      };
    });
  };

  const addManualEntry = () => {
    if (!newManualEntry.account || !newManualEntry.amount) return;
    setManualEntries((prev) => [
      ...prev,
      { ...newManualEntry, id: Date.now() },
    ]);
    setNewManualEntry({
      date: "2026-03-18",
      month: selectedGoalMonth,
      channel: "Corporate",
      account: "",
      amount: 0,
      notes: "",
    });
  };

  const parseAmount = (value: string) => {
    return Number(value.replace(/[$,]/g, ""));
  };

  const parseDate = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "2025-01-01";

    const [m, d] = trimmed.split("/");
    if (!m || !d) return "2025-01-01";

    return `2025-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const normalizeAccount = (value: string) => {
    const cleaned = value.trim();
    const lower = cleaned.toLowerCase();

    if (
      [
        "w good co",
        "w.good/co",
        "w/good co",
        "w good.co",
        "w/good,co",
        "w/good.co",
        "w.good co",
        "w/good/co",
        "w.good/co ",
      ].includes(lower)
    ) {
      return "W Good Co";
    }

    if (lower === "swag,com") return "Swag.com";

    return cleaned;
  };

  const importData = () => {
    const lines = importText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const newEntries: ManualEntry[] = [];

    for (const line of lines) {
      const parts = line.split("\t").filter(Boolean);
      if (parts.length < 2) continue;

      const account = normalizeAccount(parts[0] ?? "");
      const maybeDate = parts.length >= 3 ? parts[1] : "";
      const maybeAmount = parts[parts.length - 1] ?? "";

      const amount = parseAmount(maybeAmount);
      if (!account || !Number.isFinite(amount)) continue;

      const date = parseDate(maybeDate);
      const month = date.slice(0, 7);

      newEntries.push({
        id: Date.now() + newEntries.length,
        date,
        month,
        channel: "Corporate",
        account,
        amount,
        notes: "Imported",
      });
    }

    if (!newEntries.length) {
      setImportMessage("No valid rows found.");
      return;
    }

    setManualEntries((prev) => [...newEntries, ...prev]);
    setImportText("");
    setImportMessage(`Imported ${newEntries.length} rows`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-3xl font-semibold">Revenue dashboard</h1>
            <p className="text-sm text-slate-500">
              Toggle channels, change views, compare channel mix, and optionally
              track monthly goals
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm border">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="rounded-lg"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className="rounded-lg"
                onClick={() => setActiveTab("reports")}
              >
                <FileBarChart2 className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
            <Button className="rounded-xl">
              <Upload className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>

        {activeTab === "reports" ? (
          <>
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Customer lookup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-9"
                      placeholder="Search customer or account"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="rounded-xl border bg-white px-3 py-2 text-sm"
                    value={reportChannel}
                    onChange={(e) =>
                      setReportChannel(e.target.value as "All" | ChannelName)
                    }
                  >
                    <option value="All">All channels</option>
                    {baseChannelRows.map((row) => (
                      <option key={row.channel} value={row.channel}>
                        {row.channel}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="date"
                    value={reportStart}
                    onChange={(e) => setReportStart(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={reportEnd}
                    onChange={(e) => setReportEnd(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                title="Customer sales"
                value={currencyFmt.format(reportSummary.total)}
                subtext={reportSummary.customerLabel}
                icon={TrendingUp}
              />
              <KpiCard
                title="Orders"
                value={numberFmt.format(reportSummary.orders)}
                subtext="Matching records"
                icon={ShoppingBag}
              />
              <KpiCard
                title="Average order"
                value={currencyFmt.format(reportSummary.average)}
                subtext="Across filtered results"
                icon={Store}
              />
              <KpiCard
                title="Last order date"
                value={reportSummary.lastOrder}
                subtext="Most recent matching sale"
                icon={CalendarRange}
              />
            </div>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Sales records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-2xl border">
                  <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.8fr_1.4fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <div>Date</div>
                    <div>Customer</div>
                    <div>Channel</div>
                    <div>Amount</div>
                    <div>Notes</div>
                  </div>
                  {reportRows.length === 0 ? (
                    <div className="px-4 py-8 text-sm text-slate-500">
                      No matching sales found.
                    </div>
                  ) : (
                    reportRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.8fr_1.4fr] gap-3 border-t px-4 py-3 text-sm"
                      >
                        <div>{row.date}</div>
                        <div className="font-medium text-slate-900">
                          {row.account}
                        </div>
                        <div>{row.channel}</div>
                        <div>{currencyFmt.format(row.amount)}</div>
                        <div className="text-slate-500">
                          {row.notes || "—"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {selectedView === "quarterly" ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Quarter</span>
                <select
                  value={selectedQuarter}
                  onChange={(e) =>
                    setSelectedQuarter(
                      e.target.value as (typeof quarterOptions)[number]["key"]
                    )
                  }
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                >
                  {quarterOptions.map((quarter) => (
                    <option key={quarter.key} value={quarter.key}>
                      {quarter.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {selectedView === "custom" ? (
              <div className="flex items-center gap-3 flex-wrap rounded-2xl border bg-white p-4 shadow-sm">
                <span className="text-sm text-slate-500">Custom date range</span>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-auto"
                />
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-auto"
                />
              </div>
            ) : null}

            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm border flex-wrap">
              {viewOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={selectedView === option.key ? "default" : "ghost"}
                  className="rounded-lg"
                  onClick={() => setSelectedView(option.key)}
                >
                  <CalendarRange className="h-4 w-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <KpiCard
                title="Net sales"
                value={currencyFmt.format(totalRevenue)}
                subtext="Selected channels"
                icon={TrendingUp}
              />
              <KpiCard
                title="Orders"
                value={numberFmt.format(totalOrders)}
                subtext="Across selected channels"
                icon={ShoppingBag}
              />
              <KpiCard
                title="AOV"
                value={currencyFmt.format(aov)}
                subtext="Blended average order value"
                icon={Store}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-medium text-slate-900">Goals</p>
                <p className="text-sm text-slate-500">
                  Turn goals on when you want to compare revenue against a monthly
                  target. Channel goals live below.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {showGoals ? "On" : "Off"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGoals((prev) => !prev)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    showGoals ? "bg-slate-900" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      showGoals ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {showGoals ? (
              <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Monthly goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-slate-500">Month</label>
                      <select
                        value={selectedGoalMonth}
                        onChange={(e) => setSelectedGoalMonth(e.target.value)}
                        className="rounded-xl border bg-white px-3 py-2 text-sm"
                      >
                        {goalMonths.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Monthly total goal</p>
                        <Input
                          type="number"
                          value={goalsByMonth[selectedGoalMonth]?.total ?? 0}
                          onChange={(e) =>
                            updateGoal(selectedGoalMonth, "total", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Attainment</p>
                        <p className="mt-2 text-2xl font-semibold">
                          {pctFmt.format(goalAttainment)}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Gap: {currencyFmt.format(goalGap)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Goal summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Revenue vs goal</p>
                      <p className="mt-2 text-2xl font-semibold">
                        {currencyFmt.format(totalRevenue)} /{" "}
                        {currencyFmt.format(activeGoal)}
                      </p>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{
                            width: `${Math.min(goalAttainment * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <div className="grid grid-cols-[1.6fr_0.8fr] gap-6">
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>Revenue by channel</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {channelRows.map((row) => {
                      const active = selectedChannels.includes(row.channel);
                      return (
                        <Button
                          key={row.channel}
                          variant={active ? "default" : "outline"}
                          className={
                            active
                              ? "rounded-full"
                              : "rounded-full bg-white"
                          }
                          onClick={() => toggleChannel(row.channel)}
                        >
                          {row.channel}
                        </Button>
                      );
                    })}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={combinedChartData} stackOffset="none">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} />
                        <Tooltip
                          formatter={(v: any) => [
                            currencyFmt.format(Number(v ?? 0)),
                            "",
                          ]}
                        />
                        <Legend />
                        {selectedChannels.map((channel, index) => (
                          <Bar
                            key={channel}
                            dataKey={channel}
                            stackId="channels"
                            fill={palette[index % palette.length]}
                            radius={
                              index === selectedChannels.length - 1
                                ? [4, 4, 0, 0]
                                : [0, 0, 0, 0]
                            }
                          />
                        ))}
                        <Line
                          type="monotone"
                          dataKey="previous"
                          name="Comparison period"
                          stroke="#0f172a"
                          strokeWidth={3}
                          dot={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Channel mix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mixData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={3}
                        >
                          {mixData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={palette[index % palette.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any) => [
                            currencyFmt.format(Number(v ?? 0)),
                            "Revenue",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredRows.map((r) => (
                <ChannelCard
                  key={r.channel}
                  row={r}
                  active={selectedDetailChannel === r.channel}
                  onClick={() => setSelectedDetailChannel(r.channel)}
                />
              ))}
            </div>

            {selectedDetailRow ? (
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{selectedDetailRow.channel} detail</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDetailChannel(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <KpiCard
                      title="Revenue"
                      value={currencyFmt.format(selectedDetailRow.revenue)}
                      subtext="Channel actual"
                      icon={TrendingUp}
                    />
                    <KpiCard
                      title="Orders"
                      value={numberFmt.format(selectedDetailRow.orders)}
                      subtext="Channel orders"
                      icon={ShoppingBag}
                    />
                    <KpiCard
                      title="AOV"
                      value={currencyFmt.format(selectedDetailRow.aov)}
                      subtext="Channel average order value"
                      icon={Store}
                    />
                    <KpiCard
                      title="Goal"
                      value={currencyFmt.format(channelGoal)}
                      subtext={`Attainment ${pctFmt.format(channelAttainment)}`}
                      icon={Target}
                    />
                  </div>

                  {showGoals ? (
                    <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
                      <Card className="rounded-2xl border-0 shadow-sm bg-slate-50">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Channel goal by month
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-slate-500">
                              Month
                            </label>
                            <select
                              value={selectedGoalMonth}
                              onChange={(e) =>
                                setSelectedGoalMonth(e.target.value)
                              }
                              className="rounded-xl border bg-white px-3 py-2 text-sm"
                            >
                              {goalMonths.map((month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Input
                            type="number"
                            value={
                              goalsByMonth[selectedGoalMonth]?.channels[
                                selectedDetailRow.channel
                              ] ?? 0
                            }
                            onChange={(e) =>
                              updateGoal(
                                selectedGoalMonth,
                                selectedDetailRow.channel,
                                e.target.value
                              )
                            }
                          />
                          <p className="text-sm text-slate-500">
                            Gap to goal: {currencyFmt.format(channelGap)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-0 shadow-sm bg-slate-50">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Channel trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={detailChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis
                                  tickFormatter={(v: number) => `$${v / 1000}K`}
                                />
                                <Tooltip
                                  formatter={(v: any) => [
                                    currencyFmt.format(Number(v ?? 0)),
                                    "",
                                  ]}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="current"
                                  name="Current"
                                  stroke="#0f172a"
                                  strokeWidth={3}
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="previous"
                                  name="Previous"
                                  stroke="#94a3b8"
                                  strokeWidth={3}
                                  strokeDasharray="4 8"
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <div className="grid grid-cols-1 gap-6">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Download className="h-5 w-5" />
                  <CardTitle>Data importer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-500">
                    Paste tab-separated rows like Customer, Date, Revenue.
                  </p>

                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={`W Good Co\t1/8\t$1,386\nSwag.com\t3/3\t$900\nLadder\t3/19\t$31,500`}
                    className="w-full min-h-[220px] rounded-xl border p-3 text-sm"
                  />

                  <div className="flex items-center gap-3">
                    <Button onClick={importData}>Import rows</Button>
                    {importMessage ? (
                      <span className="text-sm text-slate-500">
                        {importMessage}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2">
                  <HandCoins className="h-5 w-5" />
                  <CardTitle>Manual revenue entries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={newManualEntry.date}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <select
                      className="rounded-xl border bg-white px-3 py-2 text-sm"
                      value={newManualEntry.channel}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          channel: e.target.value as ChannelName,
                        }))
                      }
                    >
                      {baseChannelRows.map((row) => (
                        <option key={row.channel} value={row.channel}>
                          {row.channel}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Account"
                      value={newManualEntry.account}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          account: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newManualEntry.amount || ""}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          amount: Number(e.target.value),
                        }))
                      }
                    />
                    <Input
                      placeholder="Month (YYYY-MM)"
                      value={newManualEntry.month}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          month: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Notes"
                      value={newManualEntry.notes}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={addManualEntry}>Add manual entry</Button>

                  <div className="space-y-2">
                    {manualEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border bg-slate-50 p-3 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {entry.account} · {entry.channel}
                            </p>
                            <p className="text-slate-500">
                              {entry.date} · {entry.notes || "No notes"}
                            </p>
                          </div>
                          <div className="font-semibold">
                            {currencyFmt.format(entry.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}