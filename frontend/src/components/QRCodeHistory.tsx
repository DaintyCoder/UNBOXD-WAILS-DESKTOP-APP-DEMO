import React from "react";
import { HistoryIcon, TrashIcon } from "lucide-react";

interface QRCodeHistoryItem {
  id: string;
  dataUrl: string;
  value: string;
  timestamp: number;
}

interface QRCodeHistoryProps {
  history: QRCodeHistoryItem[];
  onSelect: (item: QRCodeHistoryItem) => void;
  onClear: () => void;
}

const QRCodeHistory: React.FC<QRCodeHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return (
      <div 
        className="glass animate-in"
        style={{ 
          padding: "1.5rem", 
          minHeight: "200px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        <HistoryIcon style={{ width: "2rem", height: "2rem", color: "#64748b", opacity: 0.4, marginBottom: "0.5rem" }} />
        <p style={{ color: "#64748b", fontSize: "0.875rem", textAlign: "center" }}>
          Your QR code history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass animate-in" style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Recent QR Codes</h3>
        <button 
          onClick={onClear}
          style={{ padding: "0.25rem", width: "1.75rem", height: "1.75rem" }}
        >
          <TrashIcon style={{ width: "0.875rem", height: "0.875rem" }} />
        </button>
      </div>

      <div style={{ maxHeight: "200px", overflowY: "auto", paddingRight: "0.75rem" }}>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem",
              borderRadius: "6px",
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "#fff", border: "1px solid #e2e8f0" }}>
              <img src={item.dataUrl} alt="QR Code" style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.value}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QRCodeHistory;