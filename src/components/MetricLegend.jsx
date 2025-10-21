import { metrics } from "../data/metricsConfig.js";

export default function MetricLegend({ activeMetrics }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        paddingTop: "0.5rem",
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            opacity: activeMetrics.includes(m.key) ? 1 : 0.4,
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              backgroundColor: m.color,
            }}
          />
          <span style={{ fontSize: "0.85rem" }}>{m.label}</span>
        </div>
      ))}
    </div>
  );
}
