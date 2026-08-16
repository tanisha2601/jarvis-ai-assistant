# 🤖 JARVIS AI Assistant

> A full-stack AI-powered personal assistant web application built with a JavaScript frontend, Python FastAPI backend, and Google Gemini API.

JARVIS is a personal AI assistant designed to provide an interactive web-based experience for communicating with an AI model, maintaining conversation history, and exposing assistant functionality through a REST API.

The project follows a simple full-stack architecture where the frontend communicates with a Python backend, and the backend securely handles communication with the Google Gemini API.

---

## ✨ Features

- 🤖 AI-powered conversational assistant
- 🧠 Google Gemini API integration
- 💬 Real-time chat interface
- 💾 Persistent conversation history
- 🎙️ Browser-based voice interaction
- ❤️ Backend health monitoring
- 🔌 REST API communication
- ⚡ FastAPI-powered backend
- 🌙 Modern dark-themed assistant interface
- 📱 Responsive web interface
- 🔐 Environment-based API key configuration
- 🧪 API and Gemini connectivity testing

---

## 🖥️ Application Preview

![JARVIS AI Assistant](jarvis.png)

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│            JARVIS FRONTEND          │
│                                     │
│      HTML + CSS + JavaScript        │
│                                     │
│         Port: 5500                  │
└──────────────────┬──────────────────┘
                   │
                   │ HTTP / REST API
                   ▼
┌─────────────────────────────────────┐
│          FASTAPI BACKEND            │
│                                     │
│            Python                   │
│                                     │
│         Port: 8000                  │
└──────────────────┬──────────────────┘
                   │
                   │ Gemini API
                   ▼
┌─────────────────────────────────────┐
│           GOOGLE GEMINI             │
│                                     │
│          Gemini 2.5 Flash            │
└─────────────────────────────────────┘
                   │
                   ▼
          Conversation History
             JSON Storage