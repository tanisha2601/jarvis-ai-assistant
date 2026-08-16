"""
JARVIS Ultra Pro — Backend Server
FastAPI backend with Gemini AI integration.


Run: uvicorn backend:app --host 127.0.0.1 --port 8000 --reload
"""

import os
import json
import logging
import datetime
import webbrowser
import subprocess
import threading
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


# ─── Load environment variables ──────────────────────────────────────────────
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ─── Logging setup ───────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("jarvis")

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
HISTORY_FILE = BASE_DIR / "chat_history.json"

# ─── Gemini AI Setup ──────────────────────────────────────────────────────────
gemini_available = False
model = None

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        gemini_available = True
        log.info("✅ Gemini AI initialized (gemini-2.5-flash)")
    except ImportError:
        log.warning("⚠️  google-generativeai not installed. Run: pip install google-generativeai")
    except Exception as e:
        log.error(f"❌ Gemini initialization failed: {e}")
else:
    log.warning("⚠️  GEMINI_API_KEY not set in .env — AI responses will be limited")

# ─── Optional pyttsx3 TTS (server-side) ──────────────────────────────────────
# Server-side TTS is disabled for web interface; browser handles speech synthesis.
# Uncomment below to re-enable server-side TTS if needed.
# tts_engine = None
# try:
#     import pyttsx3
#     tts_engine = pyttsx3.init()
#     voices = tts_engine.getProperty("voices")
#     if voices:
#         tts_engine.setProperty("voice", voices[0].id)
#     tts_engine.setProperty("rate", 175)
#     log.info("✅ pyttsx3 TTS engine initialized")
# except Exception as e:
#     log.warning(f"⚠️  pyttsx3 TTS unavailable: {e}")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("=" * 50)
    log.info("  JARVIS Ultra Pro — Backend Server Starting")
    log.info("  Developed by Tanisha and Antim")
    log.info("=" * 50)
    log.info(f"  AI Status : {'✅ Gemini Connected' if gemini_available else '❌ AI Unavailable'}")
    log.info(f"  History   : {HISTORY_FILE}")
    log.info("  Endpoints : GET /health | POST /chat | GET /history")
    log.info("=" * 50)
    yield
    log.info("JARVIS backend shutting down gracefully.")

# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="JARVIS Ultra Pro",
    description="Personal AI Productivity Assistant by Tanisha and Antim",
    version="7.0.0",
    lifespan=lifespan,
)


app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/app")
async def serve_frontend():
    return FileResponse("index.html")




@app.get("/")
async def root():
    return {
        "message": "JARVIS Ultra Pro API is running 🚀",
        "status": "online",
        "docs": "/docs"
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Open for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Data Models ──────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    text: str

    @field_validator("text")
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()


class HistorySaveRequest(BaseModel):
    messages: list


# ─── Chat History Helpers ─────────────────────────────────────────────────────
def load_history() -> list:
    """Load chat history from file, returning empty list on any failure."""
    try:
        if HISTORY_FILE.exists():
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
    except (json.JSONDecodeError, OSError) as e:
        log.warning(f"⚠️  Could not load chat history: {e}")
    return []


def save_history(messages: list) -> bool:
    """Persist chat history to file. Returns True on success."""
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)
        return True
    except OSError as e:
        log.error(f"❌ Could not save chat history: {e}")
        return False


# ─── Command Processor ────────────────────────────────────────────────────────
def process_command(user_text: str) -> str | None:
    """
    Check if the message matches a built-in command.
    Returns a reply string if matched, None if it should fall through to AI.
    """
    text = user_text.lower()

    # Web launchers
    if "open youtube" in text:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube for you! 🎬"

    if "open spotify" in text:
        webbrowser.open("https://open.spotify.com")
        return "Opening Spotify! 🎵"

    if "open whatsapp" in text:
        webbrowser.open("https://web.whatsapp.com")
        return "Opening WhatsApp Web! 💬"

    if "open google" in text:
        webbrowser.open("https://www.google.com")
        return "Opening Google! 🔍"

    if "open github" in text:
        webbrowser.open("https://www.github.com")
        return "Opening GitHub! 🐙"

    if text.startswith("search "):
        query = user_text[7:].strip()
        if query:
            webbrowser.open(f"https://www.google.com/search?q={query}")
            return f'Searching Google for "{query}"! 🔍'

    # System apps (Windows)
    if "open notepad" in text:
        try:
            subprocess.Popen(["notepad.exe"])
            return "Opening Notepad! 📝"
        except Exception:
            return "Couldn't open Notepad on this system."

    if "open calculator" in text:
        try:
            subprocess.Popen(["calc.exe"])
            return "Opening Calculator! 🔢"
        except Exception:
            return "Couldn't open Calculator on this system."

    # Date and time
    if "what time" in text or ("tell" in text and "time" in text) or text == "time":
        now = datetime.datetime.now()
        return f"The current time is {now.strftime('%I:%M %p')}. ⏰"

    if "what date" in text or ("tell" in text and "date" in text) or text == "date":
        now = datetime.datetime.now()
        return f"Today is {now.strftime('%A, %d %B %Y')}. 📅"

    if "day" in text and ("what" in text or "today" in text):
        now = datetime.datetime.now()
        return f"Today is {now.strftime('%A')}. 📅"

    # Identity
    if any(phrase in text for phrase in ["who are you", "introduce yourself", "what are you", "about yourself"]):
        return (
            "I'm JARVIS Ultra Pro — your personal AI productivity assistant! 🤖\n\n"
            "I was created by Tanisha and Antim. I can:\n"
            "• Chat and answer questions using Gemini AI\n"
            "• Help you manage tasks, notes, and reminders\n"
            "• Open apps and websites for you\n"
            "• Search Google, check time and date\n"
            "• Respond to voice commands\n\n"
            "How can I assist you today?"
        )

    # No built-in command matched
    return None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Returns backend status. Frontend polls this to show connection indicator."""
    return {
        "status": "ok",
        "service": "JARVIS Ultra Pro",
        "version": "7.0.0",
        "ai_available": gemini_available,
        "timestamp": datetime.datetime.now().isoformat(),
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    """Main AI chat endpoint. Processes commands first, then falls back to Gemini."""
    user_text = request.text
    log.info(f"User: {user_text}")

    reply = ""

    # 1. Try built-in commands first
    command_reply = process_command(user_text)
    if command_reply:
        reply = command_reply
    # 2. Fall back to Gemini AI
    elif gemini_available and model:
        try:
            system_prompt = (
                "You are JARVIS Ultra Pro, a helpful, friendly, and concise personal AI assistant "
                "created by Tanisha and Antim. Keep responses clear and well-structured. "
                "Use markdown formatting (bold, lists, code blocks) where it improves readability."
            )
            response = model.generate_content(f"{system_prompt}\n\nUser: {user_text}")
            reply = response.text
        except Exception as e:
            log.error(f"Gemini error: {e}")
            reply = "I'm having trouble connecting to my AI brain right now. Please try again in a moment. 🔄"
    else:
        reply = (
            "My Gemini AI connection isn't configured. "
            "Please set your GEMINI_API_KEY in the .env file to enable AI responses. "
            "I can still help with commands like opening websites, checking time, and more!"
        )

    log.info(f"JARVIS: {reply[:80]}{'...' if len(reply) > 80 else ''}")
    return {"text": reply}


@app.get("/history")
async def get_history():
    """Returns chat history."""
    return {"messages": load_history()}


@app.post("/history/save")
async def save_chat_history(request: HistorySaveRequest):
    """Saves current chat messages to persistent storage."""
    success = save_history(request.messages)
    if success:
        return {"status": "saved", "count": len(request.messages)}
    raise HTTPException(status_code=500, detail="Failed to save history")


@app.delete("/history/clear")
async def clear_history():
    """Clears all chat history."""
    success = save_history([])
    if success:
        return {"status": "cleared"}
    raise HTTPException(status_code=500, detail="Failed to clear history")


# ─── Error Handlers ───────────────────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status": exc.status_code},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    log.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status": 500},
    )



# ─── Direct run support ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend:app", host=host, port=port, reload=True)
