"""
Lists available Gemini models for the configured API key.
Usage: Set GEMINI_API_KEY in .env or environment, then run:
    python check_model.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ GEMINI_API_KEY not set. Add it to your .env file.")
    exit(1)

import google.generativeai as genai

genai.configure(api_key=api_key)

print("🔍 Fetching available models...\n")

try:
    models = genai.list_models()
    for m in models:
        if "generateContent" in m.supported_generation_methods:
            print("✅", m.name)
except Exception as e:
    print("❌ Error:", e)
