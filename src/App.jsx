import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Dashboard />
      </main>
    </div>
  );
}
