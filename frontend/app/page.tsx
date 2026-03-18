"use client";

import { useState } from "react";

export default function HomePage() {
  const [type, setType] = useState("text");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const detect = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        scan_type: type,
        input_content: input,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ maxWidth: 700, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Spam / Malware Detection</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setType("text")}>Text</button>
        <button onClick={() => setType("url")}>URL</button>
        <button onClick={() => setType("file")}>File</button>
      </div>

      {type !== "file" ? (
        <textarea
          placeholder="Enter text or URL..."
          style={{ width: "100%", height: 120 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      ) : (
        <input type="file" />
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={detect}>Detect</button>
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Result</h3>
          <p>Label: {result.result}</p>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}