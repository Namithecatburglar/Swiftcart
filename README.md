# 🛒 SwiftCart — Vision-Aware, Emotion-Sensitive Checkout System

SwiftCart is a futuristic checkout experience that combines computer vision, emotional intelligence, and voice interaction to make shopping feel human again. Built with React + TypeScript, it’s modular, expressive, and demo-ready.

## 🧠 Features

### ✅ Working
- 📸 **Image Upload + Detection** — Upload grocery images and auto-identify items using YOLOv8 or mocked logic.
- 🛒 **Live Cart Updates** — Detected items populate the cart with name, quantity, and price.
- 🧹 **Cart Controls** — Replace image, clear cart, confirm detection.
- 💾 **Local Storage Persistence** — Cart survives refreshes and browser naps.
- 🎨 **Tailwind-Powered UI** — Styled with flair, fast to load, and easy on the eyes.

### ⚠️ Mocked / Partially Functional
- 🗣️ **Voice Assistant** — Button simulates “What’s in my cart?” via Web Speech API (speech playback pending).
- 📡 **Offline Mode** — Simulated banner and local cart logic (no real network detection yet).
- 🧠 **Gemini Product Suggestions** — Gemini API wired in, suggestions mocked.

## 🧩 Tech Stack

### Core Frontend
- **React** — Component-based UI with hooks (`useState`, `useEffect`, `useRef`)
- **TypeScript** — Static typing for robust development
- **HTML5 & CSS3** — Standard structure and styling

### Styling
- **Tailwind CSS** — Utility-first, CDN-loaded, rapid UI development

### AI & ML
- **Google Gemini API (`@google/genai`)** — Product suggestions, image identification
- **MediaPipe FaceLandmarker** — On-device emotion detection via webcam

### Browser APIs
- **WebRTC / MediaDevices (`getUserMedia`)** — Webcam access
- **Web Speech API** — `SpeechRecognition` + `SpeechSynthesis`
- **Local Storage API** — Persistent cart via `useLocalStorage` hook
- **ES Modules + Import Maps** — CDN-loaded modules, no bundler required

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/swiftcart.git
cd swiftcart
npm install
npm run dev
