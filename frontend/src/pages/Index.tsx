import React, { useState, useEffect } from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import QRCodeDisplay from "../components/QRCodeDisplay";
import QRCodeHistory from "../components/QRCodeHistory";
import { QrCode } from "lucide-react";

interface QRCodeHistoryItem {
  id: string;
  dataUrl: string;
  value: string;
  timestamp: number;
}

const STORAGE_KEY = "qrcode-history";

const Index = () => {
  const [currentQR, setCurrentQR] = useState<{
    dataUrl: string | null;
    value: string;
  }>({
    dataUrl: null,
    value: "",
  });
  
  const [history, setHistory] = useState<QRCodeHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleCodeGenerated = (dataUrl: string, value: string) => {
    setCurrentQR({ dataUrl, value });
    const newItem: QRCodeHistoryItem = {
      id: crypto.randomUUID(),
      dataUrl,
      value,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 20));
  };

  const handleSelectFromHistory = (item: QRCodeHistoryItem) => {
    setCurrentQR({
      dataUrl: item.dataUrl,
      value: item.value,
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1.5rem 1rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <QrCode style={{ width: "1.5rem", height: "1.5rem" }} />
          <h1 style={{ fontSize: "1.25rem", fontWeight: 500 }}>QR Code Generator</h1>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: "1rem" }}>
        <div className="layout-grid" style={{ gap: "1.5rem", height: "100%" }}>
          {/* Left Side: Generator and History */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "1.5rem", 
            maxWidth: "400px", 
            margin: "0 auto", 
            width: "100%" 
          }}>
            <QRCodeGenerator onCodeGenerated={handleCodeGenerated} />
            <QRCodeHistory 
              history={history} 
              onSelect={handleSelectFromHistory} 
              onClear={handleClearHistory} 
            />
          </div>

          {/* Right Side: QR Code Display */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%", 
            maxWidth: "500px", 
            margin: "0 auto", 
            width: "100%" 
          }}>
            <QRCodeDisplay 
              dataUrl={currentQR.dataUrl} 
              value={currentQR.value} 
            />
          </div>
        </div>
      </main>

      <footer style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
        <p>QR Code Generator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;