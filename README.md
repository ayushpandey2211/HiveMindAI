# HiveMind AI

> **Attribution.** HiveMind AI is a renamed, extended fork of
> [sarthak6137/EusocialAI](https://github.com/sarthak6137/EusocialAI) by **sarthak6137**
> (the project was originally called *EusocialAI*). The original architecture and code are theirs. My changes and extensions are listed under
> [My contributions](#my-contributions).
>
> **License status:** the upstream repository did not include a LICENSE file when forked
> (commit `50bc2be`). Until the original author grants a license or permission, treat the
> upstream code as all-rights-reserved. Reuse here is for coursework, with credit. TODO: ask the
> author for permission or a license and record it here.

## What it does
A multi-LLM "consensus" chat app. Each non-trivial question runs through a pipeline of
Groq-hosted Llama models:

1. **Classifier** (`backend/utils/classifier.js`): greetings take a fast single-call path.
2. **Logic agent** (llama-3.1-8b) and **Creative agent** (llama-3.3-70b) answer in parallel.
3. **Critic** (8b) reviews both answers.
4. **Debate** (70b) merges logic + creative + critique into a best answer.
5. **Judge** (70b) returns JSON `{final_answer, confidence, reasoning}`; falls back to the debate output if the JSON is unparseable.

Orchestration lives in `backend/services/llmService.js`.

## Stack
- **Backend:** Node.js, Express 5, Mongoose 9 (MongoDB), JWT auth, bcryptjs, Groq API via axios
- **Frontend:** React 19, Vite 8, Tailwind 4, framer-motion, react-markdown

## One-click launcher (Windows)
Double-click **`Start HiveMind AI.bat`**. It checks your `backend\.env`, installs packages on the first run,
starts the server, waits until it is ready and opens http://localhost:5000. Keep its window open; close it to stop.
For a desktop icon: right-click the file > Send to > Desktop (create shortcut).

## Easiest way to run (backend serves the website)
Requires Node 20+, a MongoDB URI (free [Atlas](https://www.mongodb.com/atlas)) and a free [Groq](https://console.groq.com) key.

```bash
cd backend
npm install
copy .env.example .env        # (macOS/Linux: cp)  then fill MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm start                     # open http://localhost:5000
```
The backend automatically serves the built website from `frontend/dist` when that folder exists. To rebuild it after changing the frontend: `cd frontend && npm install && set VITE_API_URL=/api && npm run build` (macOS/Linux: `VITE_API_URL=/api npm run build`).

## Developer mode (hot reload)
```bash
docker compose up -d      # optional local MongoDB
npm run setup             # installs everything, creates .env files with a random JWT secret
# edit backend/.env -> paste GROQ_API_KEY
npm run dev               # API on :5000, web on http://localhost:5173
```
If something is missing, the backend exits with a message naming the env var.

## Deploy (free, stays live): Render + MongoDB Atlas
1. Push this repo to GitHub (private is fine; secrets are never committed: `.env` is git-ignored).
2. In Atlas: Network Access must allow `0.0.0.0/0` (hosts use changing IPs).
3. On [render.com](https://render.com): **New + > Blueprint**, pick this repo. `render.yaml` sets the build (`npm run render-build`) and start (`npm start`) commands.
4. Fill the two secrets Render asks for: `MONGO_URI` and `GROQ_API_KEY` (`JWT_SECRET` is generated automatically).
5. Open the `https://<name>.onrender.com` URL when the deploy finishes. Health check: `/api/health`.
Free instances sleep after ~15 min idle (first request takes ~30-60 s). Ping `/api/health` every 5 min with a free monitor (e.g. UptimeRobot) to keep it awake.

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | no | server check |
| POST | `/api/auth/signup` | no | `{name,email,password}` -> user + JWT |
| POST | `/api/auth/login` | no | `{email,password}` -> user + JWT |
| POST | `/api/chat` | Bearer JWT | `{message}` -> `{final_answer,confidence,reasoning}` |

## Changes from upstream
- Removed unused `mongodb@2.2.12` (old driver clashing with Mongoose 9's) and unused `@google/generative-ai`; track `package-lock.json`.
- **Bug:** `Hero.jsx` imported lucide's `Infinity` icon, shadowing the global, so `repeat: Infinity` animations received an object. Removed the import.
- **Bug:** `callGroq` swallowed every error and returned `""`, so a bad key produced blank answers. It now throws; the API returns 401-key hints as 502, rate limits as 429; the critic stage degrades gracefully; the chat UI shows the reason.
- Backend exits at startup naming any missing env var (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`); CORS configurable via `CLIENT_ORIGIN`.
- Frontend lint now clean (29 -> 0): `Math.random()` moved out of render (`LaunchReveal`, `Particles`), `Node` hoisted out of `NetworkNodes`, `AuthContext` restores session without setState-in-effect (hook split into `context/authContext.js`), ESLint config recognises `motion.*` JSX usage.
- Renamed the project from EusocialAI to HiveMind AI (UI text, package names, DB name `hivemind-ai`, page title).
- Added `docker-compose.yml`, root `package.json` scripts, `scripts/init-env.js`, `.env.example` files, this README.

## Remaining limitations
- Not tested against a live MongoDB/Groq in my sandbox; auth + chat pipeline were verified with both stubbed.
- Frontend bundle is ~1.2 MB (no code-splitting yet).
- Chat history is one growing document per user with no read endpoint.

## My contributions
_List what you add here, with file paths, as you build it._
