import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem" 
    }}>
      <div className="glass animate-scale-in" style={{ 
        maxWidth: "400px", 
        width: "100%", 
        padding: "2rem", 
        textAlign: "center" 
      }}>
        <FileQuestion style={{ width: "4rem", height: "4rem", margin: "0 auto 1.5rem", color: "#64748b", opacity: 0.5 }} />
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>404</h1>
        <p style={{ fontSize: "1.125rem", color: "#64748b", marginBottom: "1.5rem" }}>
          The page you're looking for doesn't exist
        </p>
        <button>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>Return to Home</a>
        </button>
      </div>
    </div>
  );
};

export default NotFound;