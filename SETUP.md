# Buildly Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies ✅
Already completed! All packages are installed.

### 2. Setup Supabase

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details
   - Wait for project to be ready

2. **Get your Supabase credentials**:
   - Go to Project Settings → API
   - Copy the `Project URL` and `anon/public` key

3. **Run the database setup**:
   - Go to SQL Editor in Supabase dashboard
   - Open `supabase-setup.sql` from the project
   - Copy and paste the SQL code
   - Click "Run"

4. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_PEXELS_API_KEY=your-pexels-key-here
   ```

### 3. Get API Keys

1. **Gemini API Key** (Required):
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with Google account
   - Click "Create API Key"
   - **Note**: Each user will enter their own Gemini key in the app

2. **Pexels API Key** (Optional - for PPT images):
   - Visit [Pexels API](https://www.pexels.com/api/)
   - Sign up for free
   - Get your API key
   - Add to `.env.local`

### 4. Run the Application

```powershell
cd c:\Users\mrkri\Desktop\Buildlyv2\buildly
npm run dev
```

Visit: http://localhost:3000

### 5. Test the Features

1. **Sign up** at `/signup`
2. **Enter your Gemini API key** (one-time setup)
3. **Try the website builder**:
   - Enter a prompt like "Make me a portfolio website"
   - Wait for code generation
   - Edit the code
   - Download as ZIP

4. **Try the PPT generator** at `/ppt`:
   - Enter a topic like "Introduction to AI"
   - Generate slides
   - Download as PowerPoint

## Troubleshooting

### Issue: Supabase connection error
- Double-check your `.env.local` file
- Make sure the Supabase URL and key are correct
- Restart the dev server

### Issue: Gemini API errors
- Verify your Gemini API key is valid
- Check you have API quota remaining
- Ensure you're using the correct model endpoint

### Issue: Images not loading in PPT
- Check your Pexels API key
- The PPT will still work without images
- Images are optional

## Features Checklist

- ✅ Supabase Authentication (Login/Signup)
- ✅ API Key Management
- ✅ Website Code Generation
- ✅ Monaco Code Editor
- ✅ Live Preview
- ✅ ZIP Download
- ✅ PPT Generation
- ✅ Pexels Image Integration
- ✅ PowerPoint Export
- ✅ Responsive Design
- ✅ Dark Theme
- ✅ Navigation Bar

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Support

For issues, check:
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Gemini API docs: https://ai.google.dev/docs

---

**Happy Building with Buildly! 🚀**
