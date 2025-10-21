export default function SettingsModal({ isOpen, onClose, children }) {
  // If closed, keep the drawer off-screen
  const panelWidth = "400px";

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* Slide-In Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: isOpen ? panelWidth : 0,
          backgroundColor: "white",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          overflowX: "hidden",
          transition: "width 0.3s ease-in-out",
          zIndex: 1000,
          padding: isOpen ? "2rem" : "0",
        }}
      >
        {isOpen && (
          <>
            <h2 style={{ marginBottom: "1rem" }}>Settings ⚙️</h2>

            {/* Content Slot */}
            <div>{children}</div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                marginTop: "2rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </>
  );
}
