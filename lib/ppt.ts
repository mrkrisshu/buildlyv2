/**
 * PptxGenJS Integration
 * Generates PowerPoint presentations
 */

import pptxgen from 'pptxgenjs';
import { PexelsImage } from './pexels';

export interface Slide {
  title: string;
  bullets: string[];
  image?: PexelsImage;
}

export async function generatePPTX(
  topic: string,
  slides: Slide[]
): Promise<Blob> {
  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = 'Buildly';
  pptx.company = 'Buildly';
  pptx.subject = topic;
  pptx.title = topic;

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '0F172A' }; // Dark background
  titleSlide.addText(topic, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });
  titleSlide.addText('Powered by Gemini 2.5 Flash × Buildly', {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: 'A0AEC0',
    align: 'center',
  });

  // Content slides
  for (const slide of slides) {
    const contentSlide = pptx.addSlide();
    contentSlide.background = { color: '1E293B' };

    // Add title
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: 'FFFFFF',
    });

    // Add image if available
    if (slide.image?.src?.medium) {
      try {
        // Fetch image as base64
        const response = await fetch(slide.image.src.medium);
        const blob = await response.blob();
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            contentSlide.addImage({
              data: base64data,
              x: 6.5,
              y: 1.5,
              w: 3,
              h: 2,
            });
            resolve(null);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error adding image to slide:', error);
      }
    }

    // Add bullets
    const bulletPoints = slide.bullets.map(bullet => ({ text: bullet }));
    contentSlide.addText(bulletPoints, {
      x: 0.5,
      y: 1.8,
      w: slide.image ? 5.5 : 9,
      h: 4,
      fontSize: 18,
      color: 'E2E8F0',
      bullet: { code: '2022' }, // Bullet point
    });
  }

  // Generate blob
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  return blob;
}
