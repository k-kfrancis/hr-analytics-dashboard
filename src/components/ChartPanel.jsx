import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import data from "../data/workforce.json";

function ChartPanel() {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Vacancy Rate by Province</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="province" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="vacancyRate" fill="#4F46E5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartPanel;
