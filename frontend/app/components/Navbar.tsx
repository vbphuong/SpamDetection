"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.sub);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserName(null);
  };

  return (
    <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <a href="/">Spam Detection</a>

      {userName ? (
        <>
          <a href="/history">History</a>
          <span>Hello, {userName}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}