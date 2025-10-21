import { useState } from "react";
import Papa from "papaparse";

export default function DataUploadPanel({ onDataUpload }) {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    setError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (!rows.length) {
          setError("The CSV file appears to be empty.");
          return;
        }

        // Basic validation for required fields
        const requiredCols = ["province", "year", "headcount"];
        const missingCols = requiredCols.filter((c) => !(c in rows[0]));
        if (missingCols.length) {
          setError(`Missing required columns: ${missingCols.join(", ")}`);
          return;
        }

        // Convert year/headcount values to numbers
        const cleaned = rows.map((r) => {
  const obj = {};
  for (const [key, val] of Object.entries(r)) {
    if (key === "province" || key === "spanOfControl") {
      obj[key] = val; // keep as string
    } else if (val === "" || val == null) {
      obj[key] = 0;
    } else {
      const num = Number(val);
      obj[key] = Number.isFinite(num) ? num : val;
    }
  }
  return obj;
});


        setPreview(cleaned.slice(0, 5)); // preview first 5 rows
        onDataUpload(cleaned);
      },
      error: (err) => {
        setError("Failed to parse CSV: " + err.message);
      },
    });
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
        backgroundColor: "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>Upload Data (CSV)</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ marginBottom: "0.5rem" }}
      />
      {fileName && <p style={{ fontSize: "0.85rem" }}>📄 {fileName}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {preview.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            ✅ Preview (first 5 rows)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontSize: "0.85rem",
              }}
            >
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th
                      key={key}
                      style={{
                        textAlign: "left",
                        padding: "0.25rem 0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                    }}
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderBottom: "1px solid #f3f4f6",
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
