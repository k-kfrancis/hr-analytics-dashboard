import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";
import raw from "../data/workforce.json";
import { useMemo } from "react";

export default function HeadcountChart() {
  const data = useMemo(
    () => raw.map((d) => ({ ...d, headcount: Number(d.headcount) || 0 })),
    []
  );

  const nationalAvg = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.headcount, 0);
    return data.length ? sum / data.length : 0;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: 0 }}>Headcount: {value.toLocaleString()}</p>
          <p style={{ margin: 0, color: "red" }}>
            National Avg: {Math.round(nationalAvg).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "0.75rem" }}>
        Headcount by Jurisdiction
      </h2>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="province" />
          <YAxis domain={[(dataMin) => dataMin * 0.9, (dataMax) => dataMax * 1.1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="center"
            payload={[
              { value: "National Average", type: "line", color: "#DC2626" },
              { value: "Headcount", type: "rect", color: "#4F46E5" },
            ]}
          />

          {/* --- Red dashed National Average line --- */}
          {nationalAvg > 0 && (
            <ReferenceLine
              y={nationalAvg}
              stroke="#DC2626"
              strokeWidth={2}
              strokeDasharray="6 6"
              ifOverflow="extendDomain"
              isFront={true}
              label={{
                value: `National Avg: ${Math.round(
                  nationalAvg
                ).toLocaleString()}`,
                position: "right",
                fill: "#DC2626",
                fontSize: 12,
                fontWeight: "bold",
              }}
            />
          )}

          <Bar
            dataKey="headcount"
            fill="#4F46E5"
            name="Headcount"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>

      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "0.75rem",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Data shown is mock data for prototype demonstration only.
      </p>
    </div>
  );
}
