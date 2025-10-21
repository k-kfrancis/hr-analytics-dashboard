import { useState, useRef, useEffect } from "react";

export default function YearSelector({ years, selectedYears, setSelectedYears }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  return (
    <div style={{ position: "relative", width: "200px" }} ref={ref}>
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
        {selectedYears.length > 0
          ? selectedYears.join(", ")
          : "Select year(s)"}
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
          }}
        >
          {years.map((y) => (
            <label key={y} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={selectedYears.includes(y)}
                onChange={() => toggleYear(y)}
              />
              {y}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
