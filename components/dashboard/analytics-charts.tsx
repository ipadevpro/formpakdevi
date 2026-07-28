"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartDataPoint {
  date: string;
  count: number;
}

interface DeviceDataPoint {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  trendData: ChartDataPoint[];
  deviceData: DeviceDataPoint[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export function AnalyticsCharts({ trendData, deviceData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submissions Trend Area Chart */}
      <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Tren Respon (30 Hari Terakhir)</CardTitle>
          <CardDescription>Perkembangan jumlah pengiriman respon harian.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Belum ada data respon masuk
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                  labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
                  itemStyle={{ color: "#3b82f6", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Respon"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Device Pie Chart */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Sumber Perangkat</CardTitle>
          <CardDescription>Persentase kunjungan berdasarkan tipe perangkat.</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex flex-col items-center justify-center">
          {deviceData.every((d) => d.value === 0) ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Belum ada data perangkat masuk
            </div>
          ) : (
            <div className="w-full h-full relative flex flex-col items-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={deviceData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legends Custom */}
              <div className="flex gap-4 text-xs font-semibold mt-2">
                {deviceData.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-650 dark:text-slate-350">
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
