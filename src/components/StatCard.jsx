import { formatValue } from "../utils/format.js";

export default function StatCard({ title, value, note }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
        {formatValue(title.toLowerCase().replace(/ /g, ""), value)}
      </p>
      {note && (
        <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
          {note}
        </p>
      )}
    </div>
  );
}

