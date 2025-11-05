# 🚀 Quick Start Guide for Buildly

## What You Have Now

A complete AI-powered platform that:
- Generates websites from text prompts
- Creates PowerPoint presentations automatically
- Has user authentication and secure API key storage
- Features a beautiful dark-themed UI

## Immediate Next Steps

### 1. Setup Supabase (5 minutes)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: Buildly
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait 2 minutes for setup to complete

5. Get your credentials:
   - Click "Project Settings" (gear icon)
   - Go to "API" section
   - Copy `URL` and `anon public` key

6. Setup the database:
   - Click "SQL Editor" in sidebar
   - Click "New Query"
   - Copy everything from `supabase-setup.sql`
   - Paste and click "Run"

### 2. Configure Environment Variables (1 minute)

Open `.env.local` and update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key-here
NEXT_PUBLIC_PEXELS_API_KEY=your-pexels-key-here
```

For Pexels key (optional):
- Go to https://www.pexels.com/api/
- Sign up for free
- Get your API key

### 3. Run the App (30 seconds)

```powershell
cd c:\Users\mrkri\Desktop\Buildlyv2\buildly
npm run dev
```

Open http://localhost:3000

### 4. Test It Out

1. Click **"Signup"** in the navbar
2. Create an account (use any email/password)
3. Get a FREE Gemini API key:
   - Visit https://aistudio.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy it
4. Enter the API key in the modal that appears
5. Try building something:
   - Enter: "Make me a portfolio website with a hero section"
   - Click "Generate"
   - Watch the magic! ✨

## What Each Page Does

### Home Page (`/`)
- Beautiful animated hero section
- Input prompt to generate websites
- Redirects to login if not authenticated

### Build Page (`/build`)
- Left: Monaco code editor (like VS Code)
- Right: Live preview of your website
- Toolbar: Regenerate, Clear, Download ZIP

### PPT Generator (`/ppt`)
- Enter any topic
- AI generates professional slides
- Auto-adds relevant images
- Download as PowerPoint

## Tips for Best Results

### Website Generation Prompts:
- "Make me a landing page for a fitness app"
- "Create a blog homepage with dark mode"
- "Build a restaurant menu page"
- "Design a portfolio website with animations"

### PPT Topic Ideas:
- "Introduction to Machine Learning"
- "Climate Change Overview"
- "Company Product Launch"
- "Marketing Strategy 2025"

## Troubleshooting

**Issue**: Can't connect to Supabase
→ Check `.env.local` has correct URL and key
→ Restart the dev server (`Ctrl+C` then `npm run dev`)

**Issue**: "API key invalid" error
→ Get a new key from https://aistudio.google.com/app/apikey
→ Make sure you copied the full key

**Issue**: Images not loading in PPT
→ Add Pexels API key to `.env.local`
→ PPTs work without images too!

## Project Structure

```
buildly/
├── app/              # Pages (Next.js App Router)
├── components/       # UI components
├── lib/              # Helper functions (AI, DB, etc.)
├── .env.local        # Your API keys (DON'T commit!)
└── supabase-setup.sql  # Database schema
```

## Important Files

- **`.env.local`** - Your API keys
- **`supabase-setup.sql`** - Database setup
- **`SETUP.md`** - Detailed setup guide
- **`PROJECT-SUMMARY.md`** - Complete feature list

## Features Implemented

✅ User authentication (Supabase)
✅ Animated login/signup pages
✅ API key management
✅ Website code generation (Gemini 2.5 Flash)
✅ Monaco code editor
✅ Live preview
✅ ZIP download
✅ PPT generation
✅ Auto image integration
✅ PowerPoint export
✅ Responsive design
✅ Dark theme
✅ Navigation bar
✅ Footer branding

## Ready to Deploy?

When you're ready to go live:

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repo
5. Add environment variables in Vercel
6. Deploy!

Your app will be live at `your-project.vercel.app`

## Get Help

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs

---

## 🎉 You're All Set!

Your Buildly platform is ready to generate websites and presentations with AI!

**Start building something amazing! 🚀**
