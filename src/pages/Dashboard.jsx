import { useState, useMemo, useEffect } from "react";
import StatCard from "../components/StatCard.jsx";
import MetricToggleBar from "../components/MetricToggleBar.jsx";
import YearSelector from "../components/YearSelector.jsx";
import ProvinceSelector from "../components/ProvinceSelector.jsx";
import ChartPanel from "../components/ChartPanel.jsx";
import DataUploadPanel from "../components/DataUploadPanel.jsx";
import data from "../data/workforce.json";
import { metrics } from "../data/metricsConfig.js";
import { formatValue } from "../utils/format.js";

export default function Dashboard() {
  // --- Uploaded CSV data with localStorage persistence ---
const [uploadedData, setUploadedData] = useState(() => {
  const saved = localStorage.getItem("uploadedData");
  return saved ? JSON.parse(saved) : [];
});

// Save uploads to localStorage whenever they change
useEffect(() => {
  localStorage.setItem("uploadedData", JSON.stringify(uploadedData));
}, [uploadedData]);

// --- Combine built-in dataset with uploaded rows ---
const mergedData = useMemo(() => {
  // When no uploaded data, start empty instead of using base file
  if (uploadedData.length === 0) return [];
  return [...uploadedData];
}, [uploadedData]);



  // --- Derived lists for dropdowns ---
 const allYears = [...new Set(mergedData.map((d) => d.year))].sort();
const allProvinces = [...new Set(mergedData.map((d) => d.province))].sort();

// Safe defaults even if dataset is empty
const [selectedYears, setSelectedYears] = useState(
  allYears.length ? [Math.max(...allYears)] : []
);
const [selectedProvinces, setSelectedProvinces] = useState(
  allProvinces.length ? allProvinces : []
);

  const [activeMetrics, setActiveMetrics] = useState(["headcount"]);

  // --- Summary averages for StatCards ---
  const summary = useMemo(() => {
    return metrics
      .filter((m) => m.showOnCard)
      .map((m) => {
        const filtered = mergedData.filter(
          (d) =>
            selectedYears.includes(d.year) &&
            (selectedProvinces.length === 0 ||
              selectedProvinces.includes(d.province))
        );
        const sum = filtered.reduce((acc, d) => acc + (Number(d[m.key]) || 0), 0);
        const avg = filtered.length ? sum / filtered.length : 0;

        let roundedAvg = avg;
        if (
          [
            "permEmployeeRate",
            "nonPermRate",
            "unionRate",
            "retirementEligibility",
            "seniorMgmtRate",
            "executiveRate",
            "yearsOfService",
          ].includes(m.key)
        ) {
          roundedAvg = parseFloat(avg.toFixed(2));
        } else if (m.key === "headcount") {
          roundedAvg = parseFloat(avg.toFixed(1));
        }

        return { key: m.key, label: m.label, avg: roundedAvg };
      });
  }, [mergedData, selectedYears, selectedProvinces]);

  // --- Filtered data for chart + table ---
  const filteredData = useMemo(() => {
    return mergedData.filter(
      (d) =>
        selectedYears.includes(d.year) &&
        (selectedProvinces.length === 0 ||
          selectedProvinces.includes(d.province))
    );
  }, [mergedData, selectedYears, selectedProvinces]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* --- STAT CARDS --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {summary.slice(0, 4).map((s) => (
          <StatCard
            key={s.key}
            title={s.label}
            value={s.avg}
            note={`National Avg (${formatValue(s.key, s.avg)})`}
          />
        ))}
      </div>

      {/* --- FILTER CONTROLS --- */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "0.25rem" }}>Select Year(s):</h3>
          <YearSelector
            years={allYears}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "0.25rem" }}>Select Jurisdictions:</h3>
          <ProvinceSelector
            provinces={allProvinces}
            selectedProvinces={selectedProvinces}
            setSelectedProvinces={setSelectedProvinces}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "0.25rem" }}>Select Metrics:</h3>
          <MetricToggleBar
            activeMetrics={activeMetrics}
            setActiveMetrics={setActiveMetrics}
          />
        </div>
      </div>

      {/* --- UPLOAD PANEL --- */}
      <DataUploadPanel onDataUpload={setUploadedData} />
        <button
  onClick={() => {
    // Clear saved uploads from localStorage
    localStorage.removeItem("uploadedData");
    // Reset state to built-in dataset
    setUploadedData([]);
    // Optional: reset filters to defaults
    setSelectedYears([Math.max(...allYears)]);
    setSelectedProvinces(allProvinces);
    setActiveMetrics(["headcount"]);
  }}
  style={{
    marginTop: "0.5rem",
    background: "#DC2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    alignSelf: "flex-start",
  }}
>
  🗑️ Clear Uploaded Data
</button>


      {/* --- CHART PANEL --- */}
      <ChartPanel
      activeMetrics={activeMetrics}
      selectedYears={selectedYears}
      selectedProvinces={selectedProvinces}
      data={filteredData} // Pass actual merged data to chart
      />


      {/* --- DATA TABLE --- */}
      <div>
        <h3 style={{ marginBottom: "0.5rem" }}>Data Table</h3>
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Province
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Year
                </th>
                {activeMetrics.map((key) => {
                  const m = metrics.find((x) => x.key === key);
                  return (
                    <th
                      key={key}
                      style={{
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {m?.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, i) => (
                <tr
                  key={`${row.province}-${row.year}-${i}`}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f3f4f6",
                  }}
                >
                  <td style={{ padding: "0.5rem 0.75rem" }}>{row.province}</td>
                  <td style={{ padding: "0.5rem 0.75rem" }}>{row.year}</td>
                  {activeMetrics.map((key) => (
                    <td
                      key={key}
                      style={{
                        padding: "0.5rem 0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatValue(key, row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.8rem",
          marginTop: "0.5rem",
        }}
      >
        Data shown is mock data for prototype demonstration only.
      </p>
    </div>
  );
}
