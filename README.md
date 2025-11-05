# Buildly - AI-Powered Website & Presentation Builder

**Build anything instantly with Gemini 2.5 Flash**

Buildly is a full-stack Next.js application that leverages Google's Gemini 2.5 Flash AI to instantly generate websites and presentations from simple text prompts.

## ✨ Features

### 🌐 Website Builder (`/build`)
- **AI Code Generation**: Generate responsive HTML + Tailwind CSS websites from text descriptions
- **Live Preview**: Real-time preview of generated code
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Download**: Export generated websites as ZIP files
- **Edit & Regenerate**: Modify code in real-time or regenerate with new prompts

### 📊 PPT Generator (`/ppt`)
- **AI Slide Creation**: Generate professional presentation outlines
- **Auto Image Integration**: Automatically fetches relevant images from Pexels
- **Preview Cards**: Visual preview of each slide with title, bullets, and thumbnail
- **PowerPoint Export**: Download as `.pptx` file using PptxGenJS

### 🔐 Authentication
- **Supabase Auth**: Secure user authentication
- **Animated Login/Signup**: Beautiful character-based login interface
- **API Key Management**: Users store their own Gemini API key securely

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- (Optional) Pexels API key from [Pexels](https://www.pexels.com/api/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
