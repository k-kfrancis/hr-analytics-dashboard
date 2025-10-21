import { metrics } from "../data/metricsConfig.js";

export default function MetricPrivacyControls({ activeMetrics, setActiveMetrics }) {
  const handleToggle = (key) => {
    if (activeMetrics.includes(key)) {
      setActiveMetrics(activeMetrics.filter((k) => k !== key));
    } else {
      setActiveMetrics([...activeMetrics, key]);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "0.5rem" }}>Metric Visibility</h3>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        Choose which metrics are visible on your dashboard.
      </p>

      {metrics.map((m) => (
        <div
          key={m.key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span>{m.label}</span>
          <input
            type="checkbox"
            checked={activeMetrics.includes(m.key)}
            onChange={() => handleToggle(m.key)}
          />
        </div>
      ))}
    </div>
  );
}
