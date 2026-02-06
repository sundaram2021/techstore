"use client";

import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#06b6d4", "#14b8a6"];

interface ChartDataPoint {
  name: string;
  value: number;
}

interface DashboardChartChatProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  chartType: "bar" | "pie" | "area" | "line";
}

export function DashboardChartChat({ title, description, data, chartType }: DashboardChartChatProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="px-1">
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <div className="h-[200px] w-full bg-white rounded-xl border border-gray-100 p-2">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart(data, chartType)}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function renderChart(data: ChartDataPoint[], type: string) {
  const tooltipStyle = {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
  };

  switch (type) {
    case "pie":
      return (
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      );
    case "area":
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chatAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
          <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#chatAreaGrad)" strokeWidth={2} />
        </AreaChart>
      );
    case "line":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
          <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      );
    default: // bar
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
          <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      );
  }
}
