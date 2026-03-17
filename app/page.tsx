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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Store, ShoppingBag, Building2, Truck, Plus } from "lucide-react";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const chartData = [
  { date: "Mar 1", current: 1950, previous: 3800 },
  { date: "Mar 2", current: 2120, previous: 3350 },
  { date: "Mar 3", current: 2200, previous: 4050 },
];

const channelRows = [
  { channel: "Shopify", revenue: 18420, orders: 302, icon: Store },
  { channel: "Amazon", revenue: 10895, orders: 189, icon: ShoppingBag },
  { channel: "Wholesale", revenue: 3900, orders: 6, icon: Building2 },
  { channel: "Retail", revenue: 1337, orders: 3, icon: Truck },
];

export default function Page() {
  const [form, setForm] = useState({
    date: "",
    channel: "Wholesale" as "Wholesale" | "Retail",
    account: "",
    amount: "",
  });

  const totalRevenue = useMemo(
    () => channelRows.reduce((sum, r) => sum + r.revenue, 0),
    []
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Revenue Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {currencyFmt.format(totalRevenue)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value: number) => `$${value}`} />
              <Tooltip />
              <Legend />
              <Line dataKey="current" stroke="#000" />
              <Line dataKey="previous" stroke="#999" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Manual Entries</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Entry</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />

                <Select
                  value={form.channel}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      channel: v as "Wholesale" | "Retail",
                    })
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

                <Input
                  placeholder="Account"
                  value={form.account}
                  onChange={(e) =>
                    setForm({ ...form, account: e.target.value })
                  }
                />

                <Input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                />

                <Button>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </div>
  );
}