"""
Test script for Gemini API connectivity.
Usage: Set GEMINI_API_KEY in .env or environment, then run:
    python test_api.py
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

try:
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")
    response = model.generate_content(contents="Hello JARVIS! How are you today?")
    print("✅ API working fine!\n")
    print("Response:", response.text)
except Exception as e:
    print("❌ Error:", e)
