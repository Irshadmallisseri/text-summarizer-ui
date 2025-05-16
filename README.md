# AI Summarizer (React + FastAPI)

A modern web app for summarizing **text** and **audio** using a FastAPI backend and a Bootstrap-powered React frontend.

---

## 🚀 Features

- 📝 Paste or type text to summarize instantly.
- 🎙 Upload audio (MP3, WAV, etc.) and receive a transcription + summary.
- ⚡ Smooth animated UI with Framer Motion.
- 📁 Download the summary or copy it to clipboard.
- 🌐 Backend integration using environment variables.

---

## 🛠 Tech Stack

- **Frontend**: React, Bootstrap, Framer Motion, Axios
- **Backend**: FastAPI
- **API**:
  - `POST /api/v1/summarize-text` — JSON: `{ text: "..." }`
  - `POST /api/v1/transcribe-audio` — FormData: `{ file }`

---

## 📦 Setup Instructions

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd summarizer-app
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run the App
```bash
npm run dev
```

---

## 🧪 Usage

- Choose **Enter Text** or **Upload Audio**
- Input text or select an audio file
- Click **Summarize**
- View, copy, or download your summary

---

## 📂 File Structure
- `App.jsx` – main React component
- `.env` – stores API URL
- `vite.config.js` – Vite config

---

## 📄 License

MIT
