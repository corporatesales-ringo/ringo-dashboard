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
  { key: "Q1", label: "Q1", months: [0, 1, 2] },
  { key: "Q2", label: "Q2", months: [3, 4, 5] },
  { key: "Q3", label: "Q3", months: [6, 7, 8] },
  { key: "Q4", label: "Q4", months: [9, 10, 11] },
] as const;

type ViewKey = (typeof viewOptions)[number]["key"];
type ChannelName = "Shopify" | "Amazon" | "Corporate" | "Retail";
type SeededChannelName = Exclude<ChannelName, "Corporate">;
type PageTab = "dashboard" | "reports";
type MonthDisplayMode = "full" | "mtd";
type GoalRollupMode = "monthly" | "quarterly" | "annual";

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

const channelMeta = [
  { channel: "Shopify" as const, icon: Store },
  { channel: "Amazon" as const, icon: ShoppingBag },
  { channel: "Corporate" as const, icon: Building2 },
  { channel: "Retail" as const, icon: Truck },
];

const targetAovByChannel: Record<ChannelName, number> = {
  Shopify: 61,
  Amazon: 58,
  Corporate: 650,
  Retail: 446,
};

const seededMonthlyRevenue2026: Record<SeededChannelName, Record<string, number>> = {
  Shopify: {
    "2026-01": 22000,
    "2026-02": 24500,
    "2026-03": 26000,
    "2026-04": 28200,
    "2026-05": 30400,
    "2026-06": 31800,
    "2026-07": 32600,
    "2026-08": 34100,
    "2026-09": 33300,
    "2026-10": 35800,
    "2026-11": 38200,
    "2026-12": 42500,
  },
  Amazon: {
    "2026-01": 11800,
    "2026-02": 13200,
    "2026-03": 14500,
    "2026-04": 15100,
    "2026-05": 16400,
    "2026-06": 17600,
    "2026-07": 16900,
    "2026-08": 18100,
    "2026-09": 17300,
    "2026-10": 18600,
    "2026-11": 19800,
    "2026-12": 21200,
  },
  Retail: {
    "2026-01": 3000,
    "2026-02": 3100,
    "2026-03": 3000,
    "2026-04": 3500,
    "2026-05": 3600,
    "2026-06": 3900,
    "2026-07": 3800,
    "2026-08": 4050,
    "2026-09": 3950,
    "2026-10": 4100,
    "2026-11": 4300,
    "2026-12": 4500,
  },
};

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
      <CardContent className="flex justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{subtext}</p>
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
  row: {
    channel: ChannelName;
    revenue: number;
    orders: number;
    aov: number;
    fill: number;
    icon: React.ComponentType<{ className?: string }>;
  };
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer rounded-2xl border-0 shadow-sm transition hover:shadow-md ${
        active ? "ring-2 ring-slate-900" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{row.channel}</p>
            <p className="mt-2 text-xl font-semibold">
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

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function parseIsoDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatMonth(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function formatDayLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
}

function monthKeyFromDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

function normalizeAccount(value: string) {
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
}

function normalizeChannel(value: string): ChannelName {
  const cleaned = value.trim().toLowerCase();

  if (cleaned.includes("shop")) return "Shopify";
  if (cleaned.includes("amazon")) return "Amazon";
  if (cleaned.includes("retail")) return "Retail";
  if (cleaned.includes("corp")) return "Corporate";
  if (cleaned.includes("wholesale")) return "Corporate";
  if (cleaned.includes("custom")) return "Corporate";

  return "Corporate";
}

function parseAmount(value: string) {
  const parsed = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slashMatch) {
    let [, m, d, y] = slashMatch;
    const year = y ? (y.length === 2 ? `20${y}` : y) : "2026";
    return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDailySeedEntriesForMonth(
  year: number,
  monthIndex: number,
  channel: SeededChannelName,
  total: number,
  startId: number
): ManualEntry[] {
  const numDays = daysInMonth(year, monthIndex);
  const rawWeights: number[] = [];

  for (let day = 1; day <= numDays; day++) {
    const date = new Date(year, monthIndex, day);
    const weekday = date.getDay();

    let weight = 1;
    if (channel === "Shopify") {
      weight += weekday === 0 || weekday === 6 ? 0.25 : 0.05;
      weight += day % 7 === 0 ? 0.08 : 0;
    } else if (channel === "Amazon") {
      weight += weekday === 0 || weekday === 6 ? 0.12 : 0.04;
      weight += day % 5 === 0 ? 0.06 : 0;
    } else {
      weight += weekday === 5 || weekday === 6 ? 0.18 : 0.03;
      weight += day % 6 === 0 ? 0.05 : 0;
    }
    rawWeights.push(weight);
  }

  const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0);
  const amounts = rawWeights.map((weight) => Math.round((total * weight) / totalWeight));
  const diff = total - amounts.reduce((sum, amount) => sum + amount, 0);
  amounts[amounts.length - 1] += diff;

  return amounts.map((amount, index) => {
    const day = String(index + 1).padStart(2, "0");
    const month = String(monthIndex + 1).padStart(2, "0");
    return {
      id: startId + index,
      date: `${year}-${month}-${day}`,
      month: `${year}-${month}`,
      channel,
      account: `${channel} Seed`,
      amount,
      notes: "Seeded",
    };
  });
}

function buildSeededEntries() {
  const entries: ManualEntry[] = [];
  let idCounter = -100000;

  (Object.keys(seededMonthlyRevenue2026) as SeededChannelName[]).forEach((channel) => {
    Object.entries(seededMonthlyRevenue2026[channel]).forEach(([monthKey, total]) => {
      const [yearStr, monthStr] = monthKey.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monthStr) - 1;

      entries.push(
        ...buildDailySeedEntriesForMonth(year, monthIndex, channel, total, idCounter)
      );
      idCounter -= 1000;

      const previousYearTotal = Math.round(total * 0.82);
      entries.push(
        ...buildDailySeedEntriesForMonth(year - 1, monthIndex, channel, previousYearTotal, idCounter)
      );
      idCounter -= 1000;
    });
  });

  return entries;
}

const seededEntries = buildSeededEntries();

export default function Page() {
  const today = startOfDay(new Date());
  const currentMonthKey = monthKeyFromDate(today);

  const [activeTab, setActiveTab] = useState<PageTab>("dashboard");
  const [selectedChannels, setSelectedChannels] = useState<ChannelName[]>([
    "Shopify",
    "Amazon",
    "Corporate",
    "Retail",
  ]);
  const [selectedView, setSelectedView] = useState<ViewKey>("daily");
  const [selectedQuarter, setSelectedQuarter] =
    useState<(typeof quarterOptions)[number]["key"]>("Q1");
  const [selectedDashboardMonth, setSelectedDashboardMonth] =
    useState<string>(currentMonthKey);
  const [monthDisplayMode, setMonthDisplayMode] =
    useState<MonthDisplayMode>("full");
  const [customStart, setCustomStart] = useState(currentMonthKey + "-01");
  const [customEnd, setCustomEnd] = useState(
    `${currentMonthKey}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [showGoals, setShowGoals] = useState(false);
  const [selectedGoalMonth, setSelectedGoalMonth] = useState<string>(currentMonthKey);
  const [goalsByMonth, setGoalsByMonth] =
    useState<Record<string, GoalShape>>(initialGoalsByMonth);
  const [selectedDetailChannel, setSelectedDetailChannel] =
    useState<ChannelName | null>(null);

  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [newManualEntry, setNewManualEntry] = useState<Omit<ManualEntry, "id">>({
    date: `${currentMonthKey}-${String(today.getDate()).padStart(2, "0")}`,
    month: currentMonthKey,
    channel: "Corporate",
    account: "",
    amount: 0,
    notes: "",
  });

  const [reportSearch, setReportSearch] = useState("");
  const [reportChannel, setReportChannel] =
    useState<"All" | ChannelName>("All");
  const [reportStart, setReportStart] = useState("");
  const [reportEnd, setReportEnd] = useState("");

  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");

  const allEntries = useMemo(() => {
    return [...seededEntries, ...manualEntries];
  }, [manualEntries]);

  const latestDashboardDate = useMemo(() => {
    const all = [...allEntries];
    if (!all.length) return today;
    return all.reduce((latest, entry) => {
      const current = parseIsoDate(entry.date);
      return current > latest ? current : latest;
    }, parseIsoDate(all[0].date));
  }, [allEntries, today]);

  const chartMode = useMemo(() => {
    const selected = viewOptions.find((option) => option.key === selectedView);
    return selected?.mode ?? "daily";
  }, [selectedView]);

  const rangeInfo = useMemo(() => {
    if (selectedView === "daily") {
      return {
        mode: "daily" as const,
        currentStart: today,
        currentEnd: today,
        previousStart: addDays(today, -1),
        bucketCount: 1,
      };
    }

    if (selectedView === "weekly") {
      const end = today;
      const start = addDays(end, -6);

      return {
        mode: "daily" as const,
        currentStart: start,
        currentEnd: end,
        previousStart: addDays(start, -7),
        bucketCount: 7,
      };
    }

    if (selectedView === "monthly") {
      const selectedMonthDate = parseIsoDate(`${selectedDashboardMonth}-01`);
      const start = startOfMonth(selectedMonthDate);
      const fullEnd = startOfDay(endOfMonth(selectedMonthDate));

      const isCurrentMonth = selectedDashboardMonth === currentMonthKey;
      const effectiveEnd =
        monthDisplayMode === "mtd" && isCurrentMonth && today < fullEnd
          ? today
          : fullEnd;

      const bucketCount = Math.max(
        1,
        Math.round(
          (effectiveEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );

      return {
        mode: "daily" as const,
        currentStart: start,
        currentEnd: effectiveEnd,
        previousStart: addDays(start, -bucketCount),
        bucketCount,
      };
    }

    if (chartMode === "monthly") {
      const year = Number(selectedGoalMonth.slice(0, 4));

      if (selectedView === "annual") {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 1);
        return {
          mode: "monthly" as const,
          currentStart: start,
          currentEnd: end,
          previousStart: new Date(year - 1, 0, 1),
          bucketCount: 12,
        };
      }

      const quarter = quarterOptions.find((q) => q.key === selectedQuarter) ?? quarterOptions[0];
      const start = new Date(year, quarter.months[0], 1);
      return {
        mode: "monthly" as const,
        currentStart: start,
        currentEnd: new Date(year, quarter.months[2], 1),
        previousStart: addMonths(start, -3),
        bucketCount: 3,
      };
    }

    const start = startOfDay(new Date(customStart));
    const end = startOfDay(new Date(customEnd));
    const bucketCount = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    return {
      mode: "daily" as const,
      currentStart: start,
      currentEnd: end,
      previousStart: addDays(start, -bucketCount),
      bucketCount,
    };
  }, [
    chartMode,
    selectedView,
    selectedQuarter,
    selectedGoalMonth,
    selectedDashboardMonth,
    monthDisplayMode,
    customStart,
    customEnd,
    today,
    currentMonthKey,
  ]);

  const currentPeriodEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      if (!selectedChannels.includes(entry.channel)) return false;
      const date = parseIsoDate(entry.date);

      if (rangeInfo.mode === "daily") {
        return (
          date >= rangeInfo.currentStart &&
          date < addDays(rangeInfo.currentEnd, 1)
        );
      }

      const monthDate = startOfMonth(date);
      return (
        monthDate >= rangeInfo.currentStart &&
        monthDate <= rangeInfo.currentEnd
      );
    });
  }, [allEntries, selectedChannels, rangeInfo]);

  const channelRows = useMemo(() => {
    const revenueByChannel: Record<ChannelName, number> = {
      Shopify: 0,
      Amazon: 0,
      Corporate: 0,
      Retail: 0,
    };

    currentPeriodEntries.forEach((entry) => {
      revenueByChannel[entry.channel] += entry.amount;
    });

    const totalRevenue = Object.values(revenueByChannel).reduce((sum, v) => sum + v, 0);

    return channelMeta.map((row) => {
      const revenue = revenueByChannel[row.channel];
      const orders =
        revenue > 0 ? Math.max(1, Math.round(revenue / targetAovByChannel[row.channel])) : 0;

      return {
        ...row,
        revenue,
        orders,
        aov: orders ? revenue / orders : 0,
        fill: totalRevenue ? revenue / totalRevenue : 0,
      };
    });
  }, [currentPeriodEntries]);

  const filteredRows = useMemo(
    () => channelRows.filter((row) => selectedChannels.includes(row.channel)),
    [channelRows, selectedChannels]
  );

  const totalRevenue = filteredRows.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = filteredRows.reduce((s, r) => s + r.orders, 0);
  const aov = totalOrders ? totalRevenue / totalOrders : 0;

  const getMonthGoalForChannels = (monthKey: string) => {
    const monthGoals = goalsByMonth[monthKey]?.channels;
    if (!monthGoals) return 0;

    return selectedChannels.reduce((sum, channel) => {
      return sum + (monthGoals[channel] ?? 0);
    }, 0);
  };

  const getAllChannelMonthGoal = (monthKey: string) => {
    const monthGoals = goalsByMonth[monthKey]?.channels;
    if (!monthGoals) return 0;
    return (Object.values(monthGoals) as number[]).reduce((sum, value) => sum + value, 0);
  };

  const currentGoalRollupMode: GoalRollupMode =
    selectedView === "quarterly"
      ? "quarterly"
      : selectedView === "annual"
      ? "annual"
      : "monthly";

  const goalMonthKeysForCurrentView = useMemo(() => {
    const year = Number(selectedGoalMonth.slice(0, 4));

    if (currentGoalRollupMode === "annual") {
      return Array.from({ length: 12 }, (_, i) => {
        const mm = String(i + 1).padStart(2, "0");
        return `${year}-${mm}`;
      });
    }

    if (currentGoalRollupMode === "quarterly") {
      const quarter = quarterOptions.find((q) => q.key === selectedQuarter) ?? quarterOptions[0];
      return quarter.months.map((monthIndex) => {
        const mm = String(monthIndex + 1).padStart(2, "0");
        return `${year}-${mm}`;
      });
    }

    return [selectedGoalMonth];
  }, [currentGoalRollupMode, selectedGoalMonth, selectedQuarter]);

  const selectedGoalRevenue = useMemo(() => {
    if (currentGoalRollupMode === "monthly") {
      return allEntries
        .filter(
          (entry) =>
            entry.month === selectedGoalMonth &&
            selectedChannels.includes(entry.channel)
        )
        .reduce((sum, entry) => sum + entry.amount, 0);
    }

    if (currentGoalRollupMode === "quarterly") {
      const quarterMonths = new Set(goalMonthKeysForCurrentView);
      return allEntries
        .filter(
          (entry) =>
            quarterMonths.has(entry.month) &&
            selectedChannels.includes(entry.channel)
        )
        .reduce((sum, entry) => sum + entry.amount, 0);
    }

    const annualMonths = new Set(goalMonthKeysForCurrentView);
    return allEntries
      .filter(
        (entry) =>
          annualMonths.has(entry.month) &&
          selectedChannels.includes(entry.channel)
      )
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [
    allEntries,
    currentGoalRollupMode,
    goalMonthKeysForCurrentView,
    selectedChannels,
    selectedGoalMonth,
  ]);

  const activeGoal = useMemo(() => {
    return goalMonthKeysForCurrentView.reduce((sum, monthKey) => {
      return sum + getMonthGoalForChannels(monthKey);
    }, 0);
  }, [goalMonthKeysForCurrentView, selectedChannels, goalsByMonth]);

  const goalGap = Math.max(activeGoal - selectedGoalRevenue, 0);
  const goalAttainment = activeGoal ? selectedGoalRevenue / activeGoal : 0;

  const goalContextLabel = useMemo(() => {
    if (currentGoalRollupMode === "annual") {
      return `${selectedGoalMonth.slice(0, 4)} goal`;
    }

    if (currentGoalRollupMode === "quarterly") {
      return `${selectedQuarter} ${selectedGoalMonth.slice(0, 4)} goal`;
    }

    return `${selectedGoalMonth} goal`;
  }, [currentGoalRollupMode, selectedGoalMonth, selectedQuarter]);

  const combinedChartData = useMemo(() => {
    const rows: Array<Record<string, string | number>> = [];

    for (let i = 0; i < rangeInfo.bucketCount; i++) {
      const currentBucketStart =
        rangeInfo.mode === "daily"
          ? addDays(rangeInfo.currentStart, i)
          : addMonths(rangeInfo.currentStart, i);

      const currentBucketEnd =
        rangeInfo.mode === "daily"
          ? addDays(currentBucketStart, 1)
          : addMonths(currentBucketStart, 1);

      const previousBucketStart =
        rangeInfo.mode === "daily"
          ? addDays(rangeInfo.previousStart, i)
          : addMonths(rangeInfo.previousStart, i);

      const previousBucketEnd =
        rangeInfo.mode === "daily"
          ? addDays(previousBucketStart, 1)
          : addMonths(previousBucketStart, 1);

      const label =
        rangeInfo.mode === "daily"
          ? formatDayLabel(currentBucketStart)
          : formatMonth(currentBucketStart);

      const row: Record<string, string | number> = { label };
      let previous = 0;

      selectedChannels.forEach((channel) => {
        const currentRevenue = allEntries
          .filter((entry) => entry.channel === channel)
          .filter((entry) => {
            const date = parseIsoDate(entry.date);
            return date >= currentBucketStart && date < currentBucketEnd;
          })
          .reduce((sum, entry) => sum + entry.amount, 0);

        const previousRevenue = allEntries
          .filter((entry) => entry.channel === channel)
          .filter((entry) => {
            const date = parseIsoDate(entry.date);
            return date >= previousBucketStart && date < previousBucketEnd;
          })
          .reduce((sum, entry) => sum + entry.amount, 0);

        row[channel] = currentRevenue;
        previous += previousRevenue;
      });

      row.previous = previous;
      rows.push(row);
    }

    return rows;
  }, [allEntries, selectedChannels, rangeInfo]);

  const mixData = useMemo(
    () =>
      filteredRows
        .filter((row) => row.revenue > 0)
        .map((row) => ({ name: row.channel, value: row.revenue })),
    [filteredRows]
  );

  const selectedDetailRow = useMemo(
    () => channelRows.find((row) => row.channel === selectedDetailChannel) ?? null,
    [channelRows, selectedDetailChannel]
  );

  const channelGoal = selectedDetailChannel
    ? goalsByMonth[selectedGoalMonth]?.channels[selectedDetailChannel] ?? 0
    : 0;

  const selectedDetailRevenueForGoalMonth = useMemo(() => {
    if (!selectedDetailChannel) return 0;
    return allEntries
      .filter(
        (entry) =>
          entry.channel === selectedDetailChannel &&
          entry.month === selectedGoalMonth
      )
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [allEntries, selectedDetailChannel, selectedGoalMonth]);

  const channelAttainment =
    selectedDetailChannel && channelGoal
      ? selectedDetailRevenueForGoalMonth / channelGoal
      : 0;

  const channelGap = Math.max(channelGoal - selectedDetailRevenueForGoalMonth, 0);

  const detailChartData = useMemo(() => {
    if (!selectedDetailChannel) return [];

    const rows: Array<Record<string, string | number>> = [];

    for (let i = 0; i < rangeInfo.bucketCount; i++) {
      const currentBucketStart =
        rangeInfo.mode === "daily"
          ? addDays(rangeInfo.currentStart, i)
          : addMonths(rangeInfo.currentStart, i);

      const currentBucketEnd =
        rangeInfo.mode === "daily"
          ? addDays(currentBucketStart, 1)
          : addMonths(currentBucketStart, 1);

      const previousBucketStart =
        rangeInfo.mode === "daily"
          ? addDays(rangeInfo.previousStart, i)
          : addMonths(rangeInfo.previousStart, i);

      const previousBucketEnd =
        rangeInfo.mode === "daily"
          ? addDays(previousBucketStart, 1)
          : addMonths(previousBucketStart, 1);

      const label =
        rangeInfo.mode === "daily"
          ? formatDayLabel(currentBucketStart)
          : formatMonth(currentBucketStart);

      const current = allEntries
        .filter((entry) => entry.channel === selectedDetailChannel)
        .filter((entry) => {
          const date = parseIsoDate(entry.date);
          return date >= currentBucketStart && date < currentBucketEnd;
        })
        .reduce((sum, entry) => sum + entry.amount, 0);

      const previous = allEntries
        .filter((entry) => entry.channel === selectedDetailChannel)
        .filter((entry) => {
          const date = parseIsoDate(entry.date);
          return date >= previousBucketStart && date < previousBucketEnd;
        })
        .reduce((sum, entry) => sum + entry.amount, 0);

      rows.push({ label, current, previous });
    }

    return rows;
  }, [allEntries, selectedDetailChannel, rangeInfo]);

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

  const updateGoal = (month: string, field: ChannelName, value: string) => {
    const parsed = Number(value || 0);
    setGoalsByMonth((prev) => {
      const current = prev[month] ?? {
        total: 0,
        channels: { Shopify: 0, Amazon: 0, Corporate: 0, Retail: 0 },
      };

      const nextChannels = {
        ...current.channels,
        [field]: parsed,
      };

      const nextTotal = (Object.values(nextChannels) as number[]).reduce(
        (sum, amount) => sum + amount,
        0
      );

      return {
        ...prev,
        [month]: {
          ...current,
          total: nextTotal,
          channels: nextChannels,
        },
      };
    });
  };

  const addManualEntry = () => {
    if (!newManualEntry.account || !newManualEntry.amount || !newManualEntry.date) return;

    const month = newManualEntry.date.slice(0, 7) || newManualEntry.month;

    setManualEntries((prev) => [
      ...prev,
      { ...newManualEntry, month, id: Date.now() },
    ]);

    setNewManualEntry({
      date: `${currentMonthKey}-${String(today.getDate()).padStart(2, "0")}`,
      month: currentMonthKey,
      channel: "Corporate",
      account: "",
      amount: 0,
      notes: "",
    });
  };

  const importData = () => {
    const lines = importText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const newEntries: ManualEntry[] = [];

    const splitFlexible = (line: string) => {
      if (line.includes("\t")) {
        return line.split("\t").map((p) => p.trim()).filter(Boolean);
      }
      return line.split(",").map((p) => p.trim()).filter(Boolean);
    };

    const firstLine = lines[0]?.toLowerCase() || "";
    const hasHeader =
      firstLine.includes("date") ||
      firstLine.includes("channel") ||
      firstLine.includes("customer") ||
      firstLine.includes("revenue") ||
      firstLine.includes("account");

    const workingLines = hasHeader ? lines.slice(1) : lines;

    for (const line of workingLines) {
      const parts = splitFlexible(line);
      if (parts.length < 3) continue;

      let account = "";
      let channel: ChannelName = "Corporate";
      let date = "";
      let amount = 0;

      if (parts.length >= 4 && (parts[0].includes("/") || parts[0].includes("-"))) {
        date = parseDate(parts[0]);
        channel = normalizeChannel(parts[1]);
        account = normalizeAccount(parts[2]);
        amount = parseAmount(parts[3]);
      } else {
        account = normalizeAccount(parts[0]);
        date = parseDate(parts[1]);
        amount = parseAmount(parts[parts.length - 1]);

        if (parts.length >= 4) {
          channel = normalizeChannel(parts[2]);
        }
      }

      if (!account || !date || !amount) continue;

      newEntries.push({
        id: Date.now() + newEntries.length,
        date,
        month: date.slice(0, 7),
        channel,
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
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Revenue dashboard</h1>
            <p className="text-sm text-slate-500">
              Toggle channels, change views, compare channel mix, and optionally
              track monthly goals
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex w-full flex-wrap rounded-xl border bg-white p-1 shadow-sm sm:w-auto">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="rounded-lg"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className="rounded-lg"
                onClick={() => setActiveTab("reports")}
              >
                <FileBarChart2 className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </div>
            <Button className="rounded-xl">
              <Upload className="mr-2 h-4 w-4" />
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
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
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
                    {channelMeta.map((row) => (
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <div className="overflow-x-auto rounded-2xl border">
                  <div className="min-w-[720px]">
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
                          <div className="text-slate-500">{row.notes || "—"}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {selectedView === "quarterly" ? (
              <div className="flex flex-wrap items-center gap-3">
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

            {selectedView === "monthly" ? (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm">
                <span className="text-sm text-slate-500">Month</span>
                <select
                  value={selectedDashboardMonth}
                  onChange={(e) => {
                    setSelectedDashboardMonth(e.target.value);
                    setSelectedGoalMonth(e.target.value);
                  }}
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                >
                  {goalMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <div className="inline-flex rounded-xl border bg-slate-50 p-1">
                  <Button
                    variant={monthDisplayMode === "full" ? "default" : "ghost"}
                    className="rounded-lg"
                    onClick={() => setMonthDisplayMode("full")}
                  >
                    Full Month
                  </Button>
                  <Button
                    variant={monthDisplayMode === "mtd" ? "default" : "ghost"}
                    className="rounded-lg"
                    onClick={() => setMonthDisplayMode("mtd")}
                  >
                    Month to Date
                  </Button>
                </div>
              </div>
            ) : null}

            {selectedView === "custom" ? (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm">
                <span className="text-sm text-slate-500">Custom date range</span>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
            ) : null}

            <div className="inline-flex w-full flex-wrap rounded-xl border bg-white p-1 shadow-sm sm:w-auto">
              {viewOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={selectedView === option.key ? "default" : "ghost"}
                  className="rounded-lg"
                  onClick={() => setSelectedView(option.key)}
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

            <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center">
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
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Goal setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-sm text-slate-500">Month</label>
                      <select
                        value={selectedGoalMonth}
                        onChange={(e) => {
                          setSelectedGoalMonth(e.target.value);
                          if (selectedView === "monthly") {
                            setSelectedDashboardMonth(e.target.value);
                          }
                        }}
                        className="rounded-xl border bg-white px-3 py-2 text-sm"
                      >
                        {goalMonths.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {channelMeta.map((channel) => (
                        <div key={channel.channel} className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">{channel.channel} goal</p>
                          <Input
                            type="number"
                            value={goalsByMonth[selectedGoalMonth]?.channels[channel.channel] ?? 0}
                            onChange={(e) =>
                              updateGoal(selectedGoalMonth, channel.channel, e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">
                        Monthly total goal (all channels)
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {currencyFmt.format(getAllChannelMonthGoal(selectedGoalMonth))}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Visible goal with current channel toggles:{" "}
                        {currencyFmt.format(getMonthGoalForChannels(selectedGoalMonth))}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Goal summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{goalContextLabel}</p>
                      <p className="mt-2 text-2xl font-semibold">
                        {currencyFmt.format(selectedGoalRevenue)} /{" "}
                        {currencyFmt.format(activeGoal)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Based on selected channel toggles
                      </p>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{
                            width: `${Math.min(goalAttainment * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-500">
                        Attainment: {pctFmt.format(goalAttainment)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Gap: {currencyFmt.format(goalGap)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Included months</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {goalMonthKeysForCurrentView.map((monthKey) => (
                          <Badge key={monthKey} variant="secondary">
                            {monthKey}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <CardTitle>Revenue by channel</CardTitle>
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
                  <div className="h-[280px] md:h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        key={`main-${selectedView}-${selectedQuarter}-${selectedGoalMonth}-${selectedDashboardMonth}-${monthDisplayMode}-${customStart}-${customEnd}`}
                        data={combinedChartData}
                        stackOffset="none"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" minTickGap={20} />
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
                  <div className="h-[280px] md:h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mixData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={100}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>{selectedDetailRow.channel} detail</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDetailChannel(null)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                      <Card className="rounded-2xl border-0 bg-slate-50 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Channel goal by month
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
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

                      <Card className="rounded-2xl border-0 bg-slate-50 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">Channel trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[220px] md:h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                key={`detail-${selectedDetailChannel}-${selectedView}-${selectedQuarter}-${selectedGoalMonth}-${selectedDashboardMonth}-${monthDisplayMode}-${customStart}-${customEnd}`}
                                data={detailChartData}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" minTickGap={20} />
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
                    Paste tab- or comma-separated rows like Customer, Date, Revenue or Date, Channel, Customer, Revenue.
                  </p>

                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={`W Good Co\t1/8\t$1,386\nSwag.com\t3/3\t$900\n1/8/2026,Wholesale,W Good Co,$1386`}
                    className="min-h-[220px] w-full rounded-xl border p-3 text-sm"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={importData}>Import rows</Button>
                    {importMessage ? (
                      <span className="text-sm text-slate-500">{importMessage}</span>
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
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input
                      type="date"
                      value={newManualEntry.date}
                      onChange={(e) =>
                        setNewManualEntry((prev) => ({
                          ...prev,
                          date: e.target.value,
                          month: e.target.value.slice(0, 7),
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
                      {channelMeta.map((row) => (
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
                    {manualEntries.length === 0 ? (
                      <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">
                        No entries yet. Import some rows above to populate the Corporate channel.
                      </div>
                    ) : (
                      manualEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border bg-slate-50 p-3 text-sm"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                      ))
                    )}
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