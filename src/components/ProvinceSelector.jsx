import { useState, useRef, useEffect } from "react";

export default function ProvinceSelector({ provinces, selectedProvinces, setSelectedProvinces }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProvince = (prov) => {
    if (prov === "All") {
      // toggle all provinces
      if (selectedProvinces.length === provinces.length) {
        setSelectedProvinces([]);
      } else {
        setSelectedProvinces(provinces);
      }
    } else {
      if (selectedProvinces.includes(prov)) {
        setSelectedProvinces(selectedProvinces.filter((p) => p !== prov));
      } else {
        setSelectedProvinces([...selectedProvinces, prov]);
      }
    }
  };

  const allSelected = selectedProvinces.length === provinces.length;

  return (
    <div style={{ position: "relative", width: "250px" }} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "0.4rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#fff",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {selectedProvinces.length > 0
          ? `${selectedProvinces.length} selected`
          : "Select jurisdictions"}
        <span style={{ float: "right" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

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
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => toggleProvince("All")}
            />
            <strong>Select All</strong>
          </label>
          {provinces.map((p) => (
            <label
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <input
                type="checkbox"
                checked={selectedProvinces.includes(p)}
                onChange={() => toggleProvince(p)}
              />
              {p}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
