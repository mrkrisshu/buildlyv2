/**
 * Gemini 2.5 Flash API Integration
 * Handles code generation for website building
 */

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateCodeWithGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Generate responsive HTML + Tailwind CSS for this description. Output clean editable code only. Include inline Tailwind CDN in the HTML. Make it beautiful and functional.

IMPORTANT - For Images:
1. Use https://source.unsplash.com/800x600/?[keyword] for relevant images (replace [keyword] with topic like "fitness", "technology", "business", "food", etc.)
2. For hero sections: Use 1920x1080 resolution
3. For cards/thumbnails: Use 400x300 resolution
4. For profile images: Use 200x200 resolution
5. Add proper alt text for all images
6. Examples:
   - Fitness app: https://source.unsplash.com/800x600/?fitness
   - Restaurant: https://source.unsplash.com/800x600/?restaurant,food
   - Tech startup: https://source.unsplash.com/800x600/?technology,startup

Description: ${prompt}

Provide only the complete HTML code with embedded Tailwind CSS classes and proper images. No explanations, just code.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract code from markdown code blocks if present
    const codeMatch = generatedText.match(/```html\n([\s\S]*?)\n```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }

    // If no code block, return the text (it might be raw HTML)
    return generatedText.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function generatePPTOutline(
  topic: string,
  apiKey: string
): Promise<Array<{ title: string; bullets: string[] }>> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Create a professional, engaging presentation outline for: "${topic}"

IMPORTANT REQUIREMENTS:
1. Create 5-8 slides with compelling content
2. Add relevant emojis to slide titles (e.g., 💡 Introduction, 📊 Data Analysis, 🎯 Goals, ✨ Features, 🚀 Future Trends)
3. Use descriptive, professional titles
4. Each slide should have 3-5 clear, concise bullet points
5. Make bullets informative and actionable

FORMAT - Return ONLY a JSON array:
[
  {
    "title": "💡 Introduction to [Topic]",
    "bullets": [
      "Clear overview point",
      "Key definition or concept",
      "Why this topic matters"
    ]
  }
]

STYLE GUIDE:
- Titles: Use emojis that match the content (📈 for data, 🎨 for design, 💻 for technology, 🌟 for highlights, ⚡ for quick facts, 🔍 for analysis)
- Bullets: Start with action words when possible
- Content: Professional but engaging tone
- Length: Keep bullets concise (10-15 words each)

Return ONLY the JSON array with no markdown formatting or explanations.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from markdown code blocks if present
    const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || generatedText.match(/\[[\s\S]*\]/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : generatedText;

    return JSON.parse(jsonText.trim());
  } catch (error) {
    console.error("Error generating PPT outline:", error);
    throw error;
  }
}
