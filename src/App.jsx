import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import { metrics } from "./data/metricsConfig.js";
import MetricPrivacyControls from "./components/MetricPrivacyControls.jsx";


export default function App() {
  // Global metric visibility (shared between Dashboard & Settings)
  const [activeMetrics, setActiveMetrics] = useState(
    metrics.filter((m) => m.showOnChart).map((m) => m.key)
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1400px" }}>
          <Dashboard
            activeMetrics={activeMetrics}
            setActiveMetrics={setActiveMetrics}
          />
        </div>
      </main>

   <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
    >
      <MetricPrivacyControls
        activeMetrics={activeMetrics}
        setActiveMetrics={setActiveMetrics}
      />
   </SettingsModal>

    </div>
  );
}
