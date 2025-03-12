import React from "react";
import { Download, Share2 } from "lucide-react";

interface QRCodeDisplayProps {
  dataUrl: string | null;
  value: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ dataUrl, value }) => {
  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${new Date().getTime()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!dataUrl || !value) return;
    if (navigator.share) {
      await navigator.share({
        title: "QR Code",
        text: value,
        url: value.startsWith("http") ? value : undefined,
      });
    } else {
      alert("Sharing is not supported on this device");
    }
  };

  return (
    <div 
      className="glass animate-scale-in"
      style={{ 
        padding: "2rem", 
        textAlign: "center", 
        width: "100%", 
        maxWidth: "400px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {dataUrl ? (
        <>
          <div style={{ 
            marginBottom: "1.5rem", 
            background: "#fff", 
            borderRadius: "8px", 
            overflow: "hidden", 
            padding: "1rem",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)"
          }}>
            <img src={dataUrl} alt="QR Code" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
          
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button onClick={handleDownload} style={{ flex: 1, padding: "0.5rem 1rem" }}>
              <Download size={16} style={{ marginRight: "0.5rem" }} /> Save
            </button>
            <button onClick={handleShare} style={{ flex: 1, padding: "0.5rem 1rem" }}>
              <Share2 size={16} style={{ marginRight: "0.5rem" }} /> Share
            </button>
          </div>
          
          {value && (
            <div style={{ 
              marginTop: "1.5rem", 
              fontSize: "0.875rem", 
              color: "#64748b", 
              wordBreak: "break-all", 
              padding: "0.5rem",
              background: "#f8fafc",
              borderRadius: "4px"
            }}>
              {value.length > 40 ? `${value.substring(0, 37)}...` : value}
            </div>
          )}
        </>
      ) : (
        <div style={{ 
          minHeight: "260px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#64748b", 
          fontSize: "1rem",
          fontStyle: "italic"
        }}>
          Your generated QR code will appear here
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;