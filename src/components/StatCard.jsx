function StatCard({ title, value, note }) {
  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      padding: "1rem",
      textAlign: "center"
    }}>
      <h3 style={{ color: "#6b7280", fontSize: "0.9rem" }}>{title}</h3>
      <p style={{ color: "#4F46E5", fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0" }}>
        {value}
      </p>
      {note && <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{note}</p>}
    </div>
  );
}

export default StatCard;
