import ChartPanel from "../components/ChartPanel.jsx";
import StatCard from "../components/StatCard.jsx";
import data from "../data/workforce.json";

export default function Dashboard() {
  const avgVacancy = (data.reduce((a, b) => a + b.vacancyRate, 0) / data.length).toFixed(1);
  const avgAge = (data.reduce((a, b) => a + b.avgAge, 0) / data.length).toFixed(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard title="Avg. Vacancy Rate" value={`${avgVacancy}%`} />
        <StatCard title="Avg. Employee Age" value={`${avgAge}`} note="years" />
        <StatCard title="Jurisdictions" value={data.length} />
        <StatCard title="Hybrid Adoption" value="68%" note="sample metric" />
      </section>

      <ChartPanel />

      <footer style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center", paddingTop: "2rem" }}>
        Mock data for prototype demonstration only — FOIP compliant demo.
      </footer>
    </div>
  );
}
