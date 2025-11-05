"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserGeminiKey } from "@/lib/supabase";
import { generateCodeWithGemini } from "@/lib/gemini";
import { createCodeZip, downloadBlob } from "@/lib/zip";
import Link from "next/link";

export default function BuildPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (initialPrompt && apiKey) {
      generateCode(initialPrompt);
    }
  }, [apiKey]);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const key = await getUserGeminiKey(user.id);
    if (!key) {
      router.push("/?needApiKey=true");
      return;
    }

    setApiKey(key);
  };

  const generateCode = async (promptText: string) => {
    if (!apiKey) return;
    if (!promptText.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const generatedCode = await generateCodeWithGemini(promptText, apiKey);
      setCode(generatedCode);
    } catch {
      setError("Failed to generate code. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (prompt) {
      generateCode(prompt);
    }
  };

  const handleClear = () => {
    setCode("");
    setPrompt("");
  };

  const handleDownload = async () => {
    if (!code) {
      setError("No code to download");
      return;
    }

    try {
      const blob = await createCodeZip(code);
      downloadBlob(blob, "buildly-website.zip");
    } catch {
      setError("Failed to create download");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Minimal Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="absolute w-1 h-1 rounded-full bg-gray-300 top-0 left-1/2 transform -translate-x-1/2"></span>
            <span className="absolute w-1 h-1 rounded-full bg-gray-300 left-0 top-1/2 transform -translate-y-1/2"></span>
            <span className="absolute w-1 h-1 rounded-full bg-gray-300 right-0 top-1/2 transform -translate-y-1/2"></span>
            <span className="absolute w-1 h-1 rounded-full bg-gray-300 bottom-0 left-1/2 transform -translate-x-1/2"></span>
          </div>
          <span className="text-sm font-medium text-gray-300">Buildly</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/ppt">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-200 hover:bg-slate-800/50"
            >
              PPT Generator
            </Button>
          </Link>
          <Button
            onClick={handleDownload}
            disabled={!code || loading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-xs"
          >
            Download ZIP
          </Button>
        </div>
      </div>

      {/* Full Page Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className={`flex-1 flex flex-col ${code ? 'border-r border-slate-800' : ''}`}>
          {code && (
            <div className="px-3 py-2 bg-slate-900/30 border-b border-slate-800">
              <span className="text-xs font-medium text-gray-400">Code Editor</span>
            </div>
          )}
          <div className="flex-1 relative bg-slate-950">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                <p className="text-white text-sm">Generating...</p>
              </div>
            ) : !code ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-8">
                <p className="text-sm">Start from the landing page to generate code</p>
              </div>
            ) : null}
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 flex flex-col">
          {code && (
            <div className="px-3 py-2 bg-slate-900/30 border-b border-slate-800">
              <span className="text-xs font-medium text-gray-400">Preview</span>
            </div>
          )}
          <div className={`flex-1 relative ${code ? 'bg-white' : 'bg-slate-950'}`}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                <p className="text-white text-sm">Loading preview...</p>
              </div>
            ) : code ? (
              <iframe
                srcDoc={code}
                title="preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <p className="text-sm">Preview appears here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="px-4 py-1.5 bg-slate-900/50 border-t border-slate-800 text-center">
        <p className="text-xs text-gray-500">
          Developed with <span className="text-red-500">❤️</span> By{" "}
          <a 
            href="https://krishnabantola.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Krishna Bantola
          </a>
        </p>
      </div>
    </div>
  );
}
