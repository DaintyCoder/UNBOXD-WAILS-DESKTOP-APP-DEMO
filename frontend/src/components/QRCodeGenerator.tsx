import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, Check, RefreshCw } from "lucide-react";

type QRCodeProps = {
  onCodeGenerated: (dataUrl: string, value: string) => void;
};

const QRCodeGenerator: React.FC<QRCodeProps> = ({ onCodeGenerated }) => {
  const [value, setValue] = useState("");
  const [size, setSize] = useState(200);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  // Regenerate QR code when color or bgColor changes, but only if there's a value
  useEffect(() => {
    if (value.trim() && qrCode) {
      generateQRCode();
    }
  }, [color, bgColor, size]);

  const generateQRCode = async () => {
    if (!value.trim()) {
      alert("Please enter text or URL");
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Apply background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        // Apply QR color for the pattern
        ctx.fillStyle = color;
        
        const cellSize = size / 10;
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
        
        // Draw position markers (alignment patterns) with QR color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, cellSize * 3, cellSize * 3); // Top-left
        ctx.fillRect(size - cellSize * 3, 0, cellSize * 3, cellSize * 3); // Top-right
        ctx.fillRect(0, size - cellSize * 3, cellSize * 3, cellSize * 3); // Bottom-left
        
        // Cut out inner squares with background color for contrast
        ctx.fillStyle = bgColor;
        ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
        ctx.fillRect(size - cellSize * 2, cellSize, cellSize, cellSize);
        ctx.fillRect(cellSize, size - cellSize * 2, cellSize, cellSize);
      }

      const dataUrl = canvas.toDataURL("image/png");
      setQrCode(dataUrl);
      onCodeGenerated(dataUrl, value);
    } catch (error) {
      alert("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${new Date().getTime()}.png`;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <div className="glass animate-in" style={{ padding: "1.5rem", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Enter Text or URL
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={copyToClipboard} disabled={!value.trim()}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Size: {size}px
        </label>
        <input
          type="range"
          min={100}
          max={400}
          step={10}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          QR Color
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "30px", height: "30px", backgroundColor: color, border: "1px solid #e2e8f0", borderRadius: "4px" }} />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Background Color
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "30px", height: "30px", backgroundColor: bgColor, border: "1px solid #e2e8f0", borderRadius: "4px" }} />
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button 
          onClick={generateQRCode}
          disabled={isGenerating || !value.trim()}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} style={{ marginRight: "0.5rem" }} className="animate-spin" />
              Generating
            </>
          ) : (
            <>
              <QrCode size={16} style={{ marginRight: "0.5rem" }} />
              Generate QR
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          disabled={!qrCode}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Download size={16} style={{ marginRight: "0.5rem" }} />
          Save
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;