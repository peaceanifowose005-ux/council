"use client";
import { useState } from "react";

export default function CouncilRoom() {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const consultBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    setResponses([]); 
    setError("");

    try {
      const res = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      
      if (data.boardResponses) {
        setResponses(data.boardResponses);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to connect to the board. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif", backgroundColor: "#0a0a0a", color: "#ededed", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px", color: "#ffffff", fontWeight: "bold" }}>The Council</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "24px", fontSize: "16px" }}>
          Consult your personal board of directors: Elon Musk, Cristiano Ronaldo, and Jesus.
        </p>
        
        <form onSubmit={consultBoard} style={{ marginBottom: "32px" }}>
          <textarea 
            style={{ 
              width: "100%", 
              padding: "16px", 
              borderRadius: "12px", 
              marginBottom: "16px", 
              backgroundColor: "#171717", 
              color: "#ffffff", 
              border: "1px solid #333", 
              fontSize: "16px",
              resize: "vertical"
            }}
            rows={4}
            placeholder="What dilemma do you need advice on?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "14px 24px", 
              borderRadius: "12px", 
              backgroundColor: loading ? "#3f3f46" : "#2563eb", 
              color: "#ffffff", 
              border: "none", 
              fontWeight: "600", 
              fontSize: "16px", 
              width: "100%",
            }}
          >
            {loading ? "The Board is deliberating..." : "Consult the Board"}
          </button>
        </form>

        {error && (
          <div style={{ padding: "16px", backgroundColor: "#450a0a", color: "#fca5a5", borderRadius: "12px", marginBottom: "24px", border: "1px solid #7f1d1d" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {responses.map((resp: any, index) => (
            <div key={index} style={{ backgroundColor: "#171717", padding: "24px", borderRadius: "12px", border: "1px solid #262626" }}>
              <h3 style={{ color: "#60a5fa", marginTop: 0, marginBottom: "12px", fontSize: "20px", fontWeight: "600" }}>
                {resp.name}
              </h3>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: "#d4d4d8", margin: 0 }}>
                {resp.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
