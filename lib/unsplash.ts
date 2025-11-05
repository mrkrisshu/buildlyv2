/**
 * Unsplash API Integration for free high-quality images
 * Using Unsplash Source API (no API key required)
 */

export function getUnsplashImageUrl(
  query: string,
  width: number = 800,
  height: number = 600
): string {
  // Unsplash Source API - free, no API key needed
  const encodedQuery = encodeURIComponent(query);
  return `https://source.unsplash.com/${width}x${height}/?${encodedQuery}`;
}

export function getRandomUnsplashImage(
  width: number = 800,
  height: number = 600
): string {
  return `https://source.unsplash.com/random/${width}x${height}`;
}

export function getUnsplashImagesByCategory(
  category: 'nature' | 'technology' | 'business' | 'food' | 'fitness' | 'architecture' | 'people' | 'animals',
  width: number = 800,
  height: number = 600
): string {
  return `https://source.unsplash.com/${width}x${height}/?${category}`;
}

// Generate placeholder images using Lorem Picsum (another free service)
export function getPlaceholderImage(
  width: number = 800,
  height: number = 600,
  seed?: string
): string {
  const seedParam = seed ? `?random=${seed}` : '?blur';
  return `https://picsum.photos/${width}/${height}${seedParam}`;
}
