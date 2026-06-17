# 🏛️ Council

A webapp that lets you assemble a "board of directors" with different personas and worldviews to help you make better decisions.

## Features

- ✅ Create multiple councils (boards)
- ✅ Add board members with different perspectives (Elon Musk, Jesus, Ronaldo, etc.)
- ✅ Ask your council questions and get responses from each member's perspective
- ✅ Data stored locally in browser (localStorage)
- ✅ Powered by Google's Gemini API
- ✅ Mobile-friendly UI

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Google Gemini API key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/peaceanifowose005-ux/council.git
cd council
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Create a Council** - Give it a name and description
2. **Add Board Members** - Add personas with their worldviews (e.g., "Elon Musk - Tech innovator and visionary")
3. **Ask Questions** - Present decisions or questions to your board
4. **Get Perspectives** - Each member provides their worldview on the question

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **AI**: Google Gemini API
- **Storage**: Browser localStorage
- **Deployment**: Vercel
- **Styling**: CSS-in-JS

## Deployment to Vercel

1. Push your code to GitHub (already done)
2. Go to [Vercel](https://vercel.com)
3. Import the `peaceanifowose005-ux/council` repository
4. Add environment variable: `GEMINI_API_KEY` with your API key
5. Deploy!

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `NEXT_PUBLIC_API_URL` - API URL for the app (defaults to localhost in dev)

## Data Storage

All council data is stored in your browser's localStorage. This means:
- ✅ No backend database needed
- ✅ Data persists between sessions on the same device
- ❌ Data doesn't sync across devices (can be added later)

## Future Enhancements

- Cloud sync across devices
- User authentication
- Share councils with others
- Custom prompt templates
- Export council discussions
- More AI model options

## License

MIT

## Support

For issues or questions, open a GitHub issue on the repository.
