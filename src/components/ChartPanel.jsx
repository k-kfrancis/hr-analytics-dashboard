import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { metrics } from "../data/metricsConfig.js";
import { formatValue } from "../utils/format.js";
import { useMemo } from "react";

export default function ChartPanel({
  activeMetrics = [],
  selectedYears = [],
  selectedProvinces = [],
  data = [],
}) {
  // --- 1. Clean data ---
  const cleanedData = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return [];
    return data.map((d) => {
      const cleaned = {};
      for (const [key, val] of Object.entries(d)) {
        if (key === "province") cleaned[key] = String(val);
        else if (typeof val === "string" && val.includes(":")) cleaned[key] = val;
        else {
          const n = Number(val);
          cleaned[key] = Number.isFinite(n) ? n : 0;
        }
      }
      return cleaned;
    });
  }, [data]);

  // --- 2. Filter dataset ---
  const filteredData = useMemo(() => {
    if (!cleanedData.length) return [];
    return cleanedData.filter(
      (d) =>
        (!selectedYears.length || selectedYears.includes(d.year)) &&
        (!selectedProvinces.length || selectedProvinces.includes(d.province))
    );
  }, [cleanedData, selectedYears, selectedProvinces]);

  // --- 3. If nothing to show, render placeholder ---
  // ✅ Notice: all hooks have already executed
  if (!filteredData.length) {
    return (
      <div
        style={{
          width: "100%",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #d1d5db",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
        }}
      >
        <p style={{ color: "#6b7280" }}>
          No data available. Please upload a CSV file to get started.
        </p>
      </div>
    );
  }


  // --- Active metrics and averages ---
  const series = metrics.filter((m) => activeMetrics.includes(m.key));

  const averages = useMemo(() => {
    const result = {};
    selectedYears.forEach((year) => {
      result[year] = {};
      series.forEach((m) => {
        const subset = filteredData.filter((d) => d.year === year);
        const sum = subset.reduce((acc, d) => acc + (Number(d[m.key]) || 0), 0);
        result[year][m.key] = subset.length ? sum / subset.length : 0;
      });
    });
    return result;
  }, [filteredData, series, selectedYears]);

  // --- Group data by province for multi-year display ---
  const grouped = useMemo(() => {
    const provinces = [...new Set(filteredData.map((d) => d.province))];
    return provinces.map((prov) => {
      const row = { province: prov };
      selectedYears.forEach((year) => {
        const match = filteredData.find(
          (d) => d.province === prov && d.year === year
        );
        if (match) {
          series.forEach((m) => {
            row[`${m.key}_${year}`] = match[m.key];
          });
        }
      });
      return row;
    });
  }, [filteredData, selectedYears, series]);

  // --- Colors and legend ---
  const yearColors = [
  "#A5B4FC", // pastel indigo
  "#86EFAC", // pastel green
  "#FCD34D", // pastel amber
  "#FCA5A5", // pastel red
  "#7DD3FC", // pastel blue
  "#C4B5FD", // lavender
  "#FDBA74", // orange-peach
];

// darker versions of the above (for avg lines)
const yearLineColors = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#EAB308", // amber
  "#DC2626", // red
  "#0284C7", // blue
  "#8B5CF6", // purple
  "#EA580C", // orange
];


  const legendPayload = [
    ...selectedYears.map((y, i) => ({
      value: `Year ${y}`,
      type: "rect",
      color: yearColors[i % yearColors.length],
    })),
    { value: "National Avg", type: "line", color: "#DC2626" },
  ];

  // --- Custom tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const entries = payload.filter((p) => p.value != null);
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "6px",
            minWidth: "180px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {entries.map((p) => (
            <p key={p.dataKey} style={{ margin: 0, color: p.fill }}>
              {p.name}: {formatValue(p.metricKey, p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Render the chart ---
  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={grouped}
          margin={{ top: 40, right: 100, left: 30, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="province"
            angle={-40}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="center" payload={legendPayload} />

          {/* Bars for each metric × year */}
          {series.map((m) =>
            selectedYears.map((year, i) => (
              <Bar
                 key={`${m.key}_${year}`}
                  dataKey={`${m.key}_${year}`}
                  name={`${m.label} (${year})`}
                  metricKey={m.key}
                  fill={yearColors[i % yearColors.length]}
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                  barSize={activeMetrics.length > 1 ? 15 : 25}
    />
  ))
)}


          {/* Average reference lines */}
          {series.map((m) =>
  selectedYears.map((year, i) => {
    const avg = averages[year]?.[m.key];
    if (!avg) return null;
    const lineColor = yearLineColors[i % yearLineColors.length];
    return (
      <ReferenceLine
        key={`avg_${m.key}_${year}`}
        y={avg}
        stroke={lineColor}
        strokeDasharray="6 6"
        strokeWidth={1.5}
        ifOverflow="extendDomain"
        isFront={true}
        label={{
          value: `${m.label} ${year} Avg: ${formatValue(
            m.key,
            Math.round(avg)
          )}`,
          position: "right",
          fill: lineColor,
          fontSize: 11,
          dy: -4,
        }}
      />
    );
  })
)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
