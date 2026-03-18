"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, ChartLegend);

export default function OverviewPage() {
  const barData = {
    labels: ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Kimisagara", "Gisozi"],
    datasets: [
      {
        label: "Complaints per District",
        data: [45, 32, 58, 28, 67, 41],
        backgroundColor: ["#2E7D32", "#00E676", "#2E7D32", "#00E676", "#2E7D32", "#00E676"],
        borderRadius: 8,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom", 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const donutData = {
    labels: ["Nyarugenge", "Gasabo", "Kicukiro"],
    datasets: [
      {
        data: [100000, 80000, 60000],
        backgroundColor: ["#2E7D32", "#1B5E20", "#4CAF50"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const donutOptions: ChartOptions<"doughnut"> = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Households" value="2,847" note="+12% this month" color="text-green-600" />
        <StatCard title="Registered Companies" value="156/160" note="98%" color="text-green-600" />
        <StatCard title="Active Routes" value="85K RWF" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-4 rounded-2xl shadow h-[420px]">
          <h2 className="font-semibold mb-4">District Complaints Overview</h2>
          <div className="h-[330px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl shadow h-[420px]">
          <h2 className="font-semibold mb-4">Monthly Revenue Distribution</h2>
          <div className="relative h-[260px] flex items-center justify-center">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute text-center">
              <p className="text-xl font-bold">85K</p>
              <p className="text-sm text-gray-500">RWF</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <RevenueLegend color="#2E7D32" label="Nyarugenge" value="100000 rwf" />
            <RevenueLegend color="#1B5E20" label="Gasabo" value="80000 rwf" />
            <RevenueLegend color="#4CAF50" label="Kicukiro" value="60000 rwf" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, note, color }: { title: string; value: string; note?: string; color?: string }) {
  return (
    <Card className="rounded-2xl shadow">
      <CardContent className="p-4">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        {note && <p className={`text-sm ${color}`}>{note}</p>}
      </CardContent>
    </Card>
  );
}

function RevenueLegend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
        <span>{label}</span>
      </div>
      <span>{value}</span>
    </div>
  );
}