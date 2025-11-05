"use client";

import { HeroWave } from "@/components/ai-input-hero";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser, getUserGeminiKey, saveUserGeminiKey } from "@/lib/supabase";
import { ApiKeyModal } from "@/components/ui/api-key-modal";

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needApiKey = searchParams.get("needApiKey");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, [needApiKey]);

  const checkAuthStatus = async () => {
    const user = await getCurrentUser();
    
    if (user) {
      setIsAuthenticated(true);
      setUserId(user.id);
      
      // Check if user has API key
      const apiKey = await getUserGeminiKey(user.id);
      if (!apiKey || needApiKey) {
        setShowApiKeyModal(true);
      }
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!userId) return;

    // Check if user has API key
    const apiKey = await getUserGeminiKey(userId);
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    // Navigate to build page with prompt
    router.push(`/build?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleSaveApiKey = async (apiKey: string) => {
    if (!userId) return;
    
    const success = await saveUserGeminiKey(userId, apiKey);
    if (!success) {
      throw new Error("Failed to save API key");
    }
  };

  return (
    <>
      <HeroWave 
        title="Build with AI."
        subtitle="The AI Fullstack Engineer powered by Gemini 2.5 Flash. Build prototypes, apps, and websites instantly."
        placeholder="Describe what you want to create..."
        buttonText={isAuthenticated ? "Generate" : "Login to Start"}
        onPromptSubmit={handlePromptSubmit}
      />
      
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-3 bg-slate-900/20 backdrop-blur-sm border-t border-slate-800 text-center z-10">
        <p className="text-sm text-gray-400">
          Developed with <span className="text-red-500">❤️</span> By{" "}
          <a 
            href="https://krishnabantola.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-blue-400 transition-colors"
          >
            Krishna Bantola
          </a>
        </p>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-slate-950">
          <p className="text-white text-sm">Loading...</p>
        </div>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
