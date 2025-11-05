/**
 * Pexels API Integration
 * Fetches relevant images for PPT slides
 */

export interface PexelsImage {
  id: number;
  url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
}

export async function searchPexelsImages(
  query: string,
  count: number = 2
): Promise<PexelsImage[]> {
  const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  
  if (!apiKey) {
    console.warn("Pexels API key not configured");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return [];
  }
}
