/**
 * JSZip Integration
 * Creates downloadable ZIP files for generated code
 */

import JSZip from 'jszip';

export async function createCodeZip(htmlContent: string): Promise<Blob> {
  const zip = new JSZip();
  
  // Add main HTML file
  zip.file('index.html', htmlContent);
  
  // Add a README
  zip.file('README.md', `# Buildly Generated Website

This website was generated using Buildly powered by Gemini 2.5 Flash.

## How to use:
1. Open index.html in your browser
2. The Tailwind CSS is loaded via CDN
3. Customize as needed!

Built with ❤️ by Buildly
`);

  // Generate the ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
