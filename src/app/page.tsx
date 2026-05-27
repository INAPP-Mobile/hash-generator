"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Script from "next/script";
import {
  Copy,
  Check,
  Trash2,
  Star,
  History as HistoryIcon,
  Clock,
  Upload,
  FileText,
  X,
  Hash as HashIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  HistoryEntry,
  getHistory,
  addEntry,
  deleteEntry,
  clearHistory,
  togglePin,
} from "@/lib/history";

import {
  computeAllHashes,
  fileToText,
  ALGORITHM_LIST,
  type HashResults,
} from "@/lib/hash";

const firebaseConfig = {
  apiKey: "AIzaSyBTFYW79t3Hd8ldCfc6tw6VFG34FjsjGgU",
  authDomain: "freeq-one.firebaseapp.com",
  projectId: "freeq-one",
  storageBucket: "freeq-one.firebasestorage.app",
  messagingSenderId: "905128076747",
  appId: "1:905128076747:web:5c7e293432301f611b824e",
  measurementId: "G-DT3XNM6TPG",
};

const app = initializeApp(firebaseConfig);
export { app };

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len) + "...";
}

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<HashResults | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState<Record<string, "hex" | "base64" | null>>({});
  const [showCompare, setShowCompare] = useState(false);
  const [compareHash, setCompareHash] = useState("");
  const [compareAlgo, setCompareAlgo] = useState("md5");
  const [compareOutcome, setCompareOutcome] = useState<boolean | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return getHistory();
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    getAnalytics(app);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      toast.error("Please enter text to hash");
      return;
    }
    setIsHashing(true);
    try {
      const hashes = await computeAllHashes(input);
      setResults(hashes);
      const display = `MD5: ${truncate(hashes.md5.hex, 16)}`;
      const updated = addEntry(truncate(input, 60), "hash", display);
      setHistory(updated);
    } catch {
      toast.error("Failed to generate hashes");
    } finally {
      setIsHashing(false);
    }
  }, [input]);

  const handleCopy = useCallback(async (value: string, algo: string, type: "hex" | "base64") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied((prev) => ({ ...prev, [algo]: type }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [algo]: null })), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await fileToText(file);
      setInput(text);
      setIsHashing(true);
      const hashes = await computeAllHashes(text);
      setResults(hashes);
      const display = `MD5: ${truncate(hashes.md5.hex, 16)}`;
      const updated = addEntry(`file: ${file.name}`, "hash", display);
      setHistory(updated);
      toast.success(`Hashed file: ${file.name}`);
    } catch {
      toast.error("Failed to read file");
    } finally {
      setIsHashing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleCompare = useCallback(() => {
    if (!results || !compareHash.trim()) {
      toast.error("Generate hashes first and enter a hash to compare");
      return;
    }
    const algoResult = results[compareAlgo as keyof HashResults];
    if (!algoResult) return;
    const match =
      algoResult.hex.toLowerCase() === compareHash.trim().toLowerCase() ||
      algoResult.base64 === compareHash.trim();
    setCompareOutcome(match);
    const label = ALGORITHM_LIST.find((a) => a.key === compareAlgo)?.label || compareAlgo;
    const updated = addEntry(
      truncate(input, 40),
      "compare",
      `${label}: ${match ? "MATCH" : "NO MATCH"}`
    );
    setHistory(updated);
  }, [results, compareHash, compareAlgo, input]);

  const displayHistory = useMemo(() => {
    const pinned = history.filter((e) => e.pinned);
    const unpinned = history.filter((e) => !e.pinned);
    return [...pinned, ...unpinned];
  }, [history]);

  const handleHistoryTogglePin = useCallback((id: string) => {
    const result = togglePin(id);
    setHistory(result.entries);
    if (result.limitReached) {
      toast.warning("Maximum 10 pinned items");
    }
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    const updated = deleteEntry(id);
    setHistory(updated);
  }, []);

  const handleHistoryClear = useCallback(() => {
    const updated = clearHistory();
    setHistory(updated);
    toast.success("History cleared");
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    setResults(null);
    setFileName(null);
    setCompareHash("");
    setCompareOutcome(null);
    setCopied({});
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Hash Generator
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the{" "}
          <a
            href="https://freeq.one"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            freeq.one
          </a>{" "}
          tools suite.
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-gray-400" />
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Input Text
              </label>
              {fileName && (
                <span className="text-xs text-blue-400 ml-2">
                  ({fileName})
                </span>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={4}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
            />

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={handleGenerate}
                disabled={!input.trim() || isHashing}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm text-white font-medium transition-colors"
              >
                <HashIcon size={16} />
                {isHashing ? "Generating..." : "Generate Hashes"}
              </button>

              <label className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 font-medium transition-colors cursor-pointer">
                <Upload size={16} />
                Upload File
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {(input || results) && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-300 transition-colors"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {results && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                Generated Hashes
              </h2>
              <div className="space-y-3">
                {ALGORITHM_LIST.map((algo) => {
                  const algoResult = results[algo.key as keyof HashResults];
                  if (!algoResult) return null;
                  const isHexCopied = copied[algo.key] === "hex";
                  const isB64Copied = copied[algo.key] === "base64";
                  return (
                    <div
                      key={algo.key}
                      className="bg-gray-900/50 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          {algo.label}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {algoResult.hex.length / 2} bytes
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 w-10 shrink-0">HEX</span>
                          <code className="flex-1 text-xs text-green-300 font-mono break-all select-all">
                            {algoResult.hex}
                          </code>
                          <button
                            onClick={() => handleCopy(algoResult.hex, algo.key, "hex")}
                            className="shrink-0 p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            title="Copy HEX"
                          >
                            {isHexCopied ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 w-10 shrink-0">B64</span>
                          <code className="flex-1 text-xs text-yellow-300 font-mono break-all select-all">
                            {algoResult.base64}
                          </code>
                          <button
                            onClick={() => handleCopy(algoResult.base64, algo.key, "base64")}
                            className="shrink-0 p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            title="Copy Base64"
                          >
                            {isB64Copied ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {results && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <Copy size={14} />
                  Hash Comparison
                  <span className="text-gray-600 ml-1">{showCompare ? "▲" : "▼"}</span>
                </button>
              </div>
              {showCompare && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Paste a hash to compare
                      </label>
                      <input
                        type="text"
                        value={compareHash}
                        onChange={(e) => setCompareHash(e.target.value)}
                        placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Algorithm
                      </label>
                      <select
                        value={compareAlgo}
                        onChange={(e) => {
                          setCompareAlgo(e.target.value);
                          setCompareOutcome(null);
                        }}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {ALGORITHM_LIST.map((a) => (
                          <option key={a.key} value={a.key}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCompare}
                      disabled={!compareHash.trim()}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                    >
                      Compare
                    </button>
                    {compareOutcome !== null && (
                      <span
                        className={`flex items-center gap-1.5 text-sm font-bold ${
                          compareOutcome ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {compareOutcome ? "✓ Match" : "✗ No Match"}
                      </span>
                    )}
                    {compareOutcome !== null && (
                      <button
                        onClick={() => setCompareOutcome(null)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <HistoryIcon size={14} />
              History
            </h2>
            {displayHistory.length > 0 && (
              <button
                onClick={handleHistoryClear}
                className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            )}
          </div>

          {displayHistory.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              No history yet
            </div>
          ) : (
            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
              {displayHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-colors"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistoryTogglePin(entry.id);
                    }}
                    className="shrink-0 p-0.5 transition-colors"
                    title={entry.pinned ? "Unpin" : "Pin"}
                  >
                    <Star
                      size={14}
                      className={
                        entry.pinned
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500 hover:text-gray-300"
                      }
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-blue-900/50 text-blue-300">
                        HASH
                      </span>
                      <span className="text-[10px] text-gray-500 truncate">
                        {truncate(entry.input, 48)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-600">
                        {timeAgo(entry.timestamp)}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1">
                        → {truncate(entry.output, 36)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistoryDelete(entry.id);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600/30 rounded transition-all text-gray-500 hover:text-red-400 shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the{" "}
            <a
              href="https://freeq.one"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              freeq.one
            </a>{" "}
            tools suite.
          </p>
        </div>
      </div>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-971442831"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-971442831');
        gtag('event', 'conversion', {
            'send_to': 'AW-971442831/vGudCLGrjq4cEI-VnM8D',
            'value': 1.0,
            'currency': 'CAD'
        });
      `,
        }}
      />
    </main>
  );
}
