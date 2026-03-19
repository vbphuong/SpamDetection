"use client";

import { useState } from "react";

export default function HomePage() {
  const [type, setType] = useState("text");
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const detect = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          scan_type: type,
          input_content: type === "file" ? file?.name : input,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Detection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScanIcon = (scanType: string) => {
    switch (scanType) {
      case "text":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "url":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case "file":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getResultColor = (label: string) => {
    if (label?.toLowerCase().includes("spam") || label?.toLowerCase().includes("malware")) {
      return "red";
    }
    return "green";
  };

  const getConfidenceWidth = (confidence: number) => {
    return `${confidence}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-12 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Spam & Malware Detection
          </h1>
          <p className="text-gray-600 text-lg">
            Protect yourself from malicious content with AI-powered detection
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 mb-6">
          {/* Type Selector */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Scan Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["text", "url", "file"].map((scanType) => (
                <button
                  key={scanType}
                  onClick={() => setType(scanType)}
                  className={`group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    type === scanType
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {getScanIcon(scanType)}
                  <span className="capitalize">{scanType}</span>
                  {type === scanType && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 blur transition-opacity group-hover:opacity-30" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {type === "text" ? "Enter Text" : type === "url" ? "Enter URL" : "Upload File"}
            </label>
            {type !== "file" ? (
              <textarea
                placeholder={
                  type === "text"
                    ? "Paste your message or email content here..."
                    : "Enter the URL you want to check..."
                }
                className="w-full h-40 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-gray-700 placeholder:text-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-40 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group"
                >
                  <svg
                    className="h-12 w-12 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {file ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, TXT up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Detect Button */}
          <button
            onClick={detect}
            disabled={loading || (type !== "file" && !input) || (type === "file" && !file)}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Start Detection
                </>
              )}
            </span>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                getResultColor(result.result) === "red"
                  ? "bg-red-100"
                  : "bg-green-100"
              }`}>
                {getResultColor(result.result) === "red" ? (
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detection Result</h3>
                <p className="text-sm text-gray-500">Analysis completed</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Label */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Classification</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  getResultColor(result.result) === "red"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {result.result}
                </div>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Confidence Score</span>
                  <span className="text-lg font-bold text-gray-900">
                    {result.confidence}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      getResultColor(result.result) === "red"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                    style={{ width: getConfidenceWidth(result.confidence) }}
                  />
                </div>
              </div>

              {/* Warning/Success Message */}
              <div className={`rounded-xl p-4 ${
                getResultColor(result.result) === "red"
                  ? "bg-red-50 border border-red-100"
                  : "bg-green-50 border border-green-100"
              }`}>
                <p className={`text-sm font-medium ${
                  getResultColor(result.result) === "red"
                    ? "text-red-800"
                    : "text-green-800"
                }`}>
                  {getResultColor(result.result) === "red"
                    ? "⚠️ This content appears to be malicious or spam. Please exercise caution."
                    : "✓ This content appears to be safe. No threats detected."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}