export default function Navbar({ onOpenSettings }) {
  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#4F46E5",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Public Sector HR Insights
        </h1>

        <button
          onClick={onOpenSettings}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.6)",
            color: "white",
            padding: "0.4rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Settings ⚙️
        </button>
      </div>
    </header>
  );
}
