"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, getUserGeminiKey } from "@/lib/supabase";
import { generatePPTOutline } from "@/lib/gemini";
import { searchPexelsImages } from "@/lib/pexels";
import { generatePPTX, Slide } from "@/lib/ppt";
import { downloadBlob } from "@/lib/zip";
import { Edit2, Plus, Trash2, Download, Sparkles } from "lucide-react";

export default function PPTPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBullets, setEditedBullets] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

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

  const handleGenerate = async () => {
    if (!apiKey) return;
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setSlides([]);

    try {
      // Generate outline with Gemini
      const outline = await generatePPTOutline(topic, apiKey);

      // Fetch images for each slide
      const slidesWithImages: Slide[] = await Promise.all(
        outline.map(async (slide) => {
          const images = await searchPexelsImages(slide.title, 1);
          return {
            ...slide,
            image: images[0] || undefined,
          };
        })
      );

      setSlides(slidesWithImages);
    } catch {
      setError("Failed to generate presentation outline");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPPT = async () => {
    if (slides.length === 0) return;

    setGenerating(true);
    try {
      const blob = await generatePPTX(topic, slides);
      downloadBlob(blob, `${topic.replace(/\s+/g, "-")}.pptx`);
    } finally {
      setGenerating(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingSlide(index);
    setEditedTitle(slides[index].title);
    setEditedBullets([...slides[index].bullets]);
  };

  const saveEdit = () => {
    if (editingSlide === null) return;
    
    const updatedSlides = [...slides];
    updatedSlides[editingSlide] = {
      ...updatedSlides[editingSlide],
      title: editedTitle,
      bullets: editedBullets.filter(b => b.trim() !== ''),
    };
    setSlides(updatedSlides);
    setEditingSlide(null);
  };

  const cancelEdit = () => {
    setEditingSlide(null);
  };

  const addBullet = () => {
    setEditedBullets([...editedBullets, '']);
  };

  const updateBullet = (index: number, value: string) => {
    const updated = [...editedBullets];
    updated[index] = value;
    setEditedBullets(updated);
  };

  const deleteBullet = (index: number) => {
    setEditedBullets(editedBullets.filter((_, i) => i !== index));
  };

  const deleteSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const addNewSlide = () => {
    const newSlide: Slide = {
      title: "New Slide",
      bullets: ["Add your content here"],
    };
    setSlides([...slides, newSlide]);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-200 hover:bg-slate-800/50"
            >
              Web Generator
            </Button>
          </Link>
          <Button
            onClick={handleDownloadPPT}
            disabled={slides.length === 0 || generating}
            size="sm"
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-xs"
          >
            <Download className="w-3 h-3 mr-1.5" />
            Download PPT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter presentation topic (e.g., 'Introduction to Machine Learning')"
                  className="flex-1 bg-slate-800 border-slate-700 text-white text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerate();
                  }}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !topic}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-xs"
                >
                  {loading ? "Generating..." : "Generate Slides"}
                </Button>
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* Slides Preview */}
            {slides.length > 0 && (
              <>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Your Presentation ({slides.length} slides)
                  </h2>
                  <Button
                    onClick={addNewSlide}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    Add Slide
                  </Button>
                </div>

              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all shadow-lg"
                  >
                    {editingSlide === index ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
                            {index + 1}
                          </span>
                          <div className="flex-1 relative">
                            <Input
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white text-base font-semibold pr-24"
                              placeholder="Add emoji + title (e.g., 💡 Introduction)"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 text-base">
                              {['💡', '📊', '🎯', '✨', '🚀', '📈', '🎨', '💻'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setEditedTitle(emoji + ' ' + editedTitle.replace(/^[^\w\s]+\s*/, ''))}
                                  className="hover:scale-110 transition-transform cursor-pointer"
                                  title="Add emoji"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 ml-10">
                          {editedBullets.map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="flex items-start gap-2">
                              <Input
                                value={bullet}
                                onChange={(e) => updateBullet(bulletIndex, e.target.value)}
                                className="flex-1 bg-slate-800 border-slate-600 text-white text-sm"
                                placeholder="Bullet point"
                              />
                              <Button
                                onClick={() => deleteBullet(bulletIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={addBullet}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-blue-400 hover:bg-blue-950/30 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Bullet
                          </Button>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                          <Button onClick={cancelEdit} variant="ghost" size="sm" className="text-gray-400 text-xs">
                            Cancel
                          </Button>
                          <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
                              {index + 1}
                            </span>
                            <h3 className="text-lg font-bold text-white">
                              {slide.title}
                            </h3>
                          </div>
                          <ul className="space-y-2 text-gray-200 ml-10">
                            {slide.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="flex items-start group">
                                <span className="text-blue-400 mr-2 text-base">•</span>
                                <span className="text-sm">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {slide.image && (
                          <div className="md:w-48 h-32 md:h-auto rounded-lg overflow-hidden shadow-xl">
                            <img
                              src={slide.image.src.medium}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {editingSlide !== index && (
                      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-700/50">
                        <Button
                          onClick={() => startEditing(index)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-blue-400 hover:bg-blue-950/30 flex items-center gap-1 text-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteSlide(index)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-red-400 hover:bg-red-950/30 flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

            {/* Empty State */}
            {!loading && slides.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-slate-900/50 rounded-full mb-3">
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  Enter a topic above to generate your presentation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 bg-slate-900/50 border-t border-slate-800 text-center">
        <p className="text-xs text-gray-500">
          Developed with <span className="text-red-500">❤️</span> By{" "}
          <a 
            href="https://krishnabantola.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-gray-400 hover:text-blue-400 transition-colors"
          >
            Krishna Bantola
          </a>
        </p>
      </div>
    </div>
  );
}
