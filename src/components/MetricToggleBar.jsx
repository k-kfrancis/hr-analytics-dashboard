import { useState, useRef, useEffect } from "react";
import { metrics } from "../data/metricsConfig.js";

export default function MetricToggleBar({ activeMetrics, setActiveMetrics }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Toggle metric selection ---
  const handleToggle = (key) => {
    if (activeMetrics.includes(key)) {
      setActiveMetrics(activeMetrics.filter((k) => k !== key));
    } else {
      setActiveMetrics([...activeMetrics, key]);
    }
  };

  // --- Remove tag directly ---
  const handleRemoveTag = (key) => {
    setActiveMetrics(activeMetrics.filter((k) => k !== key));
  };

  return (
    <div style={{ position: "relative", width: "340px" }} ref={dropdownRef}>
      {/* --- Dropdown Trigger --- */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          minHeight: "2.5rem",
          padding: "0.4rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.3rem",
          cursor: "pointer",
        }}
      >
        {/* --- Tags for selected metrics --- */}
        {activeMetrics.length > 0 ? (
          activeMetrics.map((key) => {
            const metric = metrics.find((m) => m.key === key);
            return (
              <span
                key={key}
                style={{
                  backgroundColor: "#eef2ff",
                  color: "#3730a3",
                  border: "1px solid #c7d2fe",
                  borderRadius: "12px",
                  padding: "2px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.85rem",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(key);
                }}
              >
                {metric?.label}
                <span
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  ×
                </span>
              </span>
            );
          })
        ) : (
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Select metrics...
          </span>
        )}
        <span style={{ marginLeft: "auto" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* --- Dropdown List --- */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 100,
            padding: "0.5rem",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {metrics.map((m) => (
            <label
              key={m.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={activeMetrics.includes(m.key)}
                onChange={() => handleToggle(m.key)}
              />
              {m.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
