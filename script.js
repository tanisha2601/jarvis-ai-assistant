/**
 * JARVIS Ultra Pro — Frontend Application
 * Personal AI Productivity Assistant
 * Developed by Tanisha and Antim
 *
 * Architecture:
 *   CONFIG → STATE → DOM → STORAGE → API → TOAST → THEME →
 *   CHAT → VOICE → TASKS → NOTES → REMINDERS → HISTORY →
 *   SEARCH → SETTINGS → DASHBOARD → COMMANDS → EVENTS → INIT
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   1. CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  API_BASE: 'https://jarvis-ai-assistant-n3bf-eosin.vercel.app',
  FETCH_TIMEOUT_MS: 12000,
  HEALTH_INTERVAL:  15000,
  HEALTH_ON_START:  true,
  MAX_HISTORY_SAVE: 200,
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. STATE
   ═══════════════════════════════════════════════════════════════════════════ */
const STATE = {
  // Connection
  backendOnline:    false,
  healthTimer:      null,

  // Chat
  isSending:        false,
  chatMessages:     [],   // { role, text, time } objects in current session

  // Voice
  ttsEnabled:       true,
  speechRate:       1.0,
  speechVolume:     1.0,
  selectedVoice:    null,
  isListening:      false,
  recognition:      null,

  // Preferences
  enterToSend:      true,
  autoScroll:       true,
  currentSection:   'dashboard',

  // Retry
  lastUserMessage:  '',
};

/* ═══════════════════════════════════════════════════════════════════════════
   3. DOM REFERENCES
   ═══════════════════════════════════════════════════════════════════════════ */
const DOM = {
  // Status
  statusDot:       () => document.getElementById('statusDot'),
  statusText:      () => document.getElementById('statusText'),
  sidebarStatusDot:() => document.getElementById('sidebarStatusDot'),
  sidebarStatus:   () => document.getElementById('sidebarStatusLabel'),

  // Nav
  navItems:        () => document.querySelectorAll('.nav-item'),
  panels:          () => document.querySelectorAll('.panel'),

  // Sidebar
  sidebar:         () => document.getElementById('sidebar'),
  sidebarOverlay:  () => document.getElementById('sidebarOverlay'),
  sidebarToggle:   () => document.getElementById('sidebarToggle'),

  // Search
  globalSearch:    () => document.getElementById('globalSearch'),
  searchResults:   () => document.getElementById('searchResults'),

  // Theme
  themeToggle:     () => document.getElementById('themeToggle'),
  themeIcon:       () => document.getElementById('themeIcon'),
  themeSelect:     () => document.getElementById('themeSelect'),

  // Chat
  chatLog:         () => document.getElementById('chatLog'),
  userInput:       () => document.getElementById('userInput'),
  sendBtn:         () => document.getElementById('sendBtn'),
  micBtn:          () => document.getElementById('micBtn'),
  micIcon:         () => document.getElementById('micIcon'),
  ttsToggle:       () => document.getElementById('ttsToggle'),
  ttsIcon:         () => document.getElementById('ttsIcon'),
  typingIndicator: () => document.getElementById('typingIndicator'),
  clearChatBtn:    () => document.getElementById('clearChatBtn'),

  // Tasks
  taskList:        () => document.getElementById('taskList'),
  taskCountLabel:  () => document.getElementById('taskCountLabel'),
  tasksBadge:      () => document.getElementById('tasksBadge'),
  newTaskBtn:      () => document.getElementById('newTaskBtn'),
  taskModalBackdrop:() => document.getElementById('taskModalBackdrop'),
  taskModalTitle:  () => document.getElementById('taskModalTitle'),
  taskEditId:      () => document.getElementById('taskEditId'),
  taskTitle:       () => document.getElementById('taskTitle'),
  taskPriority:    () => document.getElementById('taskPriority'),
  taskDueDate:     () => document.getElementById('taskDueDate'),
  taskNotes:       () => document.getElementById('taskNotes'),
  saveTaskBtn:     () => document.getElementById('saveTaskBtn'),
  closeTaskModal:  () => document.getElementById('closeTaskModal'),
  cancelTaskModal: () => document.getElementById('cancelTaskModal'),

  // Notes
  noteGrid:        () => document.getElementById('noteGrid'),
  noteCountLabel:  () => document.getElementById('noteCountLabel'),
  newNoteBtn:      () => document.getElementById('newNoteBtn'),
  notesSearch:     () => document.getElementById('notesSearch'),
  noteModalBackdrop:() => document.getElementById('noteModalBackdrop'),
  noteModalTitle:  () => document.getElementById('noteModalTitle'),
  noteEditId:      () => document.getElementById('noteEditId'),
  noteTitle:       () => document.getElementById('noteTitle'),
  noteContent:     () => document.getElementById('noteContent'),
  notePin:         () => document.getElementById('notePin'),
  saveNoteBtn:     () => document.getElementById('saveNoteBtn'),
  closeNoteModal:  () => document.getElementById('closeNoteModal'),
  cancelNoteModal: () => document.getElementById('cancelNoteModal'),

  // Reminders
  reminderList:        () => document.getElementById('reminderList'),
  reminderCountLabel:  () => document.getElementById('reminderCountLabel'),
  remindersBadge:      () => document.getElementById('remindersBadge'),
  newReminderBtn:      () => document.getElementById('newReminderBtn'),
  reminderModalBackdrop:() => document.getElementById('reminderModalBackdrop'),
  reminderEditId:      () => document.getElementById('reminderEditId'),
  reminderTitle:       () => document.getElementById('reminderTitle'),
  reminderDate:        () => document.getElementById('reminderDate'),
  reminderTime:        () => document.getElementById('reminderTime'),
  reminderDesc:        () => document.getElementById('reminderDesc'),
  saveReminderBtn:     () => document.getElementById('saveReminderBtn'),
  closeReminderModal:  () => document.getElementById('closeReminderModal'),
  cancelReminderModal: () => document.getElementById('cancelReminderModal'),

  // History
  historyLog:      () => document.getElementById('historyLog'),
  clearHistoryBtn: () => document.getElementById('clearHistoryBtn'),

  // Dashboard
  dashStatusValue:    () => document.getElementById('dashStatusValue'),
  dashTasksValue:     () => document.getElementById('dashTasksValue'),
  dashNotesValue:     () => document.getElementById('dashNotesValue'),
  dashRemindersValue: () => document.getElementById('dashRemindersValue'),
  dashRecentTasks:    () => document.getElementById('dashRecentTasks'),

  // Settings
  voiceToggleSetting: () => document.getElementById('voiceToggleSetting'),
  voiceRate:          () => document.getElementById('voiceRate'),
  voiceRateVal:       () => document.getElementById('voiceRateVal'),
  voiceVolume:        () => document.getElementById('voiceVolume'),
  voiceVolumeVal:     () => document.getElementById('voiceVolumeVal'),
  voiceSelect:        () => document.getElementById('voiceSelect'),
  enterToSendToggle:  () => document.getElementById('enterToSend'),
  autoScrollToggle:   () => document.getElementById('autoScroll'),
  clearChatSettingBtn:() => document.getElementById('clearChatSettingBtn'),
  exportDataBtn:      () => document.getElementById('exportDataBtn'),
  importDataInput:    () => document.getElementById('importDataInput'),
  clearAllDataBtn:    () => document.getElementById('clearAllDataBtn'),

  // Confirm
  confirmModalBackdrop:() => document.getElementById('confirmModalBackdrop'),
  confirmModalTitle:   () => document.getElementById('confirmModalTitle'),
  confirmModalMsg:     () => document.getElementById('confirmModalMsg'),
  confirmOkBtn:        () => document.getElementById('confirmOkBtn'),
  confirmCancelBtn:    () => document.getElementById('confirmCancelBtn'),

  // Toasts
  toastContainer:  () => document.getElementById('toastContainer'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   4. STORAGE — localStorage abstraction
   ═══════════════════════════════════════════════════════════════════════════ */
const Storage = {
  PREFIX: 'jarvis_',

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[Storage] Write failed:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },

  export() {
    const data = {};
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => {
      try { data[k.slice(this.PREFIX.length)] = JSON.parse(localStorage.getItem(k)); }
      catch { data[k.slice(this.PREFIX.length)] = localStorage.getItem(k); }
    });
    return data;
  },

  import(data) {
    if (typeof data !== 'object' || !data) return false;
    Object.entries(data).forEach(([k, v]) => this.set(k, v));
    return true;
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   5. API — centralized fetch layer
   ═══════════════════════════════════════════════════════════════════════════ */
const API = {
  async request(path, options = {}) {
    const url = `${CONFIG.API_BASE}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });
      clearTimeout(timer);

      if (!res.ok) {
        let errMsg = `Server error ${res.status}`;
        try { const j = await res.json(); errMsg = j.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('Request timed out');
      throw err;
    }
  },

  health() {
    return this.request('/health');
  },

  chat(text) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  getHistory() {
    return this.request('/history');
  },

  saveHistory(messages) {
    return this.request('/history/save', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },

  clearHistory() {
    return this.request('/history/clear', { method: 'DELETE' });
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   6. TOAST NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const Toast = {
  _icons: {
    success: 'check-circle',
    error:   'x-circle',
    warning: 'alert-triangle',
    info:    'info',
  },

  show(message, type = 'info', duration = 3500) {
    const container = DOM.toastContainer();
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');

    const iconName = this._icons[type] || 'info';
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span class="toast-text">${message}</span>
      <button class="toast-close" aria-label="Dismiss">
        <i data-lucide="x"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons({ nodes: [toast] });

    toast.querySelector('.toast-close').addEventListener('click', () => this._remove(toast));

    setTimeout(() => this._remove(toast), duration);
  },

  _remove(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error', 5000); },
  warning(msg) { this.show(msg, 'warning', 4500); },
  info(msg)    { this.show(msg, 'info'); },
};

/* ═══════════════════════════════════════════════════════════════════════════
   7. CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════════════════════ */
const Confirm = {
  _resolve: null,

  show(message, title = 'Confirm') {
    return new Promise(resolve => {
      this._resolve = resolve;
      DOM.confirmModalTitle().textContent = title;
      DOM.confirmModalMsg().textContent   = message;
      DOM.confirmModalBackdrop().style.display = 'flex';
    });
  },

  _close(result) {
    DOM.confirmModalBackdrop().style.display = 'none';
    if (this._resolve) this._resolve(result);
    this._resolve = null;
  },

  init() {
    DOM.confirmOkBtn().addEventListener('click', () => this._close(true));
    DOM.confirmCancelBtn().addEventListener('click', () => this._close(false));
    DOM.confirmModalBackdrop().addEventListener('click', e => {
      if (e.target === DOM.confirmModalBackdrop()) this._close(false);
    });
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   8. THEME
   ═══════════════════════════════════════════════════════════════════════════ */
const Theme = {
  current: 'dark',

  init() {
    this.current = Storage.get('theme', 'dark');
    this.apply(this.current, false);
    const sel = DOM.themeSelect();
    if (sel) sel.value = this.current;
  },

  apply(theme, save = true) {
    this.current = theme;
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    document.body.setAttribute('data-theme', theme);

    const icon = DOM.themeIcon();
    if (icon) {
      icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) lucide.createIcons({ nodes: [icon.parentElement] });
    }

    const sel = DOM.themeSelect();
    if (sel) sel.value = theme;

    if (save) Storage.set('theme', theme);
  },

  toggle() {
    this.apply(this.current === 'dark' ? 'light' : 'dark');
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   9. BACKEND HEALTH
   ═══════════════════════════════════════════════════════════════════════════ */
const Health = {
  _lastOnline: null,

  async check() {
    this._setStatus('connecting');
    try {
      const data = await API.health();
      if (data && data.status === 'ok') {
        STATE.backendOnline = true;
        this._setStatus('online', data.ai_available);
        Dashboard.updateStatus(true, data.ai_available);
      } else {
        throw new Error('Unexpected health response');
      }
    } catch {
      STATE.backendOnline = false;
      this._setStatus('offline');
      Dashboard.updateStatus(false, false);
    }
  },

  _setStatus(state, aiAvailable) {
    const dot   = DOM.statusDot();
    const text  = DOM.statusText();
    const sDot  = DOM.sidebarStatusDot();
    const sText = DOM.sidebarStatus();

    if (!dot || !text) return;

    dot.className  = 'status-dot';
    if (sDot) sDot.className = 'status-dot';

    if (state === 'online') {
      dot.classList.add('online');
      if (sDot) sDot.classList.add('online');
      text.textContent = '🟢 JARVIS ONLINE';
      if (sText) sText.textContent = 'Connected';
      if (this._lastOnline === false) Toast.success('JARVIS backend connected!');
      this._lastOnline = true;
    } else if (state === 'offline') {
      dot.classList.add('offline');
      if (sDot) sDot.classList.add('offline');
      text.textContent = '🔴 Backend Offline';
      if (sText) sText.textContent = 'Offline';
      if (this._lastOnline === true) Toast.error('Backend offline — start the JARVIS server to continue.');
      this._lastOnline = false;
    } else {
      dot.classList.add('connecting');
      if (sDot) sDot.classList.add('connecting');
      text.textContent = '🟡 Connecting…';
      if (sText) sText.textContent = 'Connecting…';
    }
  },

  startPolling() {
    this.check();
    if (STATE.healthTimer) clearInterval(STATE.healthTimer);
    STATE.healthTimer = setInterval(() => this.check(), CONFIG.HEALTH_INTERVAL);
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   10. NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */
const Nav = {
  go(section) {
    STATE.currentSection = section;

    // Update nav items
    DOM.navItems().forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
      if (item.dataset.section === section) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    // Update panels
    DOM.panels().forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${section}`);
    });

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      DOM.sidebar().classList.remove('open');
      DOM.sidebarOverlay().classList.remove('active');
      DOM.sidebarToggle().setAttribute('aria-expanded', 'false');
    }

    // Section-specific init
    if (section === 'history') History.load();
    if (section === 'settings') Settings.populateVoices();
    if (section === 'dashboard') Dashboard.refresh();
  },

  toggleSidebar() {
    const sidebar = DOM.sidebar();
    const overlay = DOM.sidebarOverlay();
    const toggle  = DOM.sidebarToggle();
    const isOpen  = sidebar.classList.toggle('open');
    overlay.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   11. MARKDOWN-LIKE RENDERER (simple, safe)
   ═══════════════════════════════════════════════════════════════════════════ */
function renderMarkdown(text) {
  if (!text) return '';

  // Escape HTML first for security
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```[\s\S]*?```/g, match => {
    const code = match.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
    return `<pre><code>${code}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Unordered list items (lines starting with * or -)
  html = html.replace(/^[*\-] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Numbered list
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Paragraphs (double newline)
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  return `<p>${html}</p>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. CHAT
   ═══════════════════════════════════════════════════════════════════════════ */
const Chat = {
  init() {
    const log = DOM.chatLog();
    if (!log) return;
    // Show welcome if no current session messages
    if (STATE.chatMessages.length === 0) this.showEmpty();
  },

  showEmpty() {
    const log = DOM.chatLog();
    if (!log) return;
    log.innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <i data-lucide="message-circle" class="chat-empty-icon"></i>
        <h3>Start a conversation with JARVIS</h3>
        <p>Ask anything, manage your tasks, or try a voice command.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons({ nodes: [log] });
  },

  _removeEmpty() {
    const empty = document.getElementById('chatEmpty');
    if (empty) empty.remove();
  },

  appendMessage(role, text, isError = false) {
    this._removeEmpty();
    const log = DOM.chatLog();
    if (!log) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Store in session state
    STATE.chatMessages.push({ role, text, time: now.toISOString() });

    const wrapper = document.createElement('div');
    wrapper.className = `msg ${role === 'user' ? 'user-msg' : 'jarvis-msg'}`;
    wrapper.setAttribute('role', 'listitem');

    if (role === 'user') {
      wrapper.innerHTML = `
        <div class="msg-bubble">${this._escapeHTML(text)}</div>
        <div class="msg-meta">
          <span class="msg-time">${timeStr}</span>
        </div>
      `;
    } else {
      const content = isError
        ? `<span style="color:var(--error)">${this._escapeHTML(text)}</span>`
        : renderMarkdown(text);

      wrapper.innerHTML = `
        <div class="msg-bubble">${content}</div>
        <div class="msg-meta">
          <span class="msg-time">JARVIS · ${timeStr}</span>
          <button class="msg-copy-btn" title="Copy response" aria-label="Copy JARVIS response">
            <i data-lucide="copy"></i>
          </button>
          ${isError ? `<button class="msg-retry-btn" title="Retry" aria-label="Retry last message">↺ Retry</button>` : ''}
        </div>
      `;

      if (window.lucide) lucide.createIcons({ nodes: [wrapper] });

      wrapper.querySelector('.msg-copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => Toast.success('Copied to clipboard')).catch(() => {});
      });

      if (isError) {
        wrapper.querySelector('.msg-retry-btn').addEventListener('click', () => {
          if (STATE.lastUserMessage) this.send(STATE.lastUserMessage);
        });
      }
    }

    log.appendChild(wrapper);
    if (STATE.autoScroll) log.scrollTop = log.scrollHeight;
  },

  _escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  setTyping(visible) {
    const ind = DOM.typingIndicator();
    if (!ind) return;
    ind.style.display = visible ? 'flex' : 'none';
    if (visible && STATE.autoScroll) {
      const log = DOM.chatLog();
      if (log) log.scrollTop = log.scrollHeight;
    }
  },

  setSending(sending) {
    STATE.isSending = sending;
    const btn = DOM.sendBtn();
    if (btn) btn.disabled = sending;
    const input = DOM.userInput();
    if (input) input.disabled = sending;
  },

  async send(text) {
    text = text || (DOM.userInput()?.value || '').trim();
    if (!text || STATE.isSending) return;

    // Check for client-side commands first
    if (Commands.handle(text)) {
      if (DOM.userInput()) DOM.userInput().value = '';
      this._autoResize();
      return;
    }

    STATE.lastUserMessage = text;
    if (DOM.userInput()) DOM.userInput().value = '';
    this._autoResize();

    this.appendMessage('user', text);
    this.setSending(true);
    this.setTyping(true);

    if (!STATE.backendOnline) {
      this.setTyping(false);
      this.setSending(false);
      this.appendMessage('bot', 'Backend is offline. Start the JARVIS server and try again.', true);
      return;
    }

    try {
      const data = await API.chat(text);
      this.setTyping(false);
      this.setSending(false);

      const reply = data?.text || 'I received your message but had no response.';
      this.appendMessage('bot', reply);

      if (STATE.ttsEnabled) Voice.speak(reply);
      this._autoSaveHistory();
    } catch (err) {
      this.setTyping(false);
      this.setSending(false);
      const msg = err.message?.includes('timed out')
        ? 'Request timed out. JARVIS is taking too long — try again.'
        : `Could not reach JARVIS: ${err.message}`;
      this.appendMessage('bot', msg, true);
    }
  },

  async _autoSaveHistory() {
    if (!STATE.backendOnline) return;
    const toSave = STATE.chatMessages.slice(-CONFIG.MAX_HISTORY_SAVE).map(m => ({
      sender: m.role === 'user' ? 'user' : 'bot',
      text: m.text,
      timestamp: m.time,
    }));
    try { await API.saveHistory(toSave); } catch {}
  },

  clear(confirm = true) {
    if (confirm && STATE.chatMessages.length === 0) return;
    STATE.chatMessages = [];
    this.showEmpty();
    if (STATE.backendOnline) API.clearHistory().catch(() => {});
    Toast.info('Conversation cleared');
  },

  _autoResize() {
    const ta = DOM.userInput();
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   13. VOICE
   ═══════════════════════════════════════════════════════════════════════════ */
const Voice = {
  _synth: window.speechSynthesis,
  _voices: [],

  initSpeech() {
    if (!this._synth) return;
    const load = () => {
      this._voices = this._synth.getVoices();
      Settings.populateVoices();
    };
    load();
    this._synth.onvoiceschanged = load;
  },

  speak(text) {
    if (!STATE.ttsEnabled || !this._synth) return;
    if (!text?.trim()) return;

    // Cap TTS length to avoid reading huge walls of text
    const truncated = text.length > 500 ? text.slice(0, 500) + '…' : text;

    this._synth.cancel();
    const utt = new SpeechSynthesisUtterance(truncated);
    utt.rate   = STATE.speechRate;
    utt.volume = STATE.speechVolume;
    utt.pitch  = 0.95;

    if (STATE.selectedVoice) {
      const v = this._voices.find(v => v.name === STATE.selectedVoice);
      if (v) utt.voice = v;
    }

    this._synth.speak(utt);
  },

  stopSpeaking() {
    if (this._synth) this._synth.cancel();
  },

  startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Toast.warning('Voice recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (STATE.isListening) {
      this.stopListening();
      return;
    }

    try {
      STATE.recognition = new SpeechRecognition();
      STATE.recognition.lang       = 'en-US';
      STATE.recognition.continuous = false;
      STATE.recognition.interimResults = false;

      STATE.isListening = true;
      this._updateMicUI(true);

      STATE.recognition.onresult = e => {
        const transcript = e.results[0][0].transcript;
        const input = DOM.userInput();
        if (input) input.value = transcript;
        Chat.send(transcript);
        this.stopListening();
      };

      STATE.recognition.onerror = err => {
        const msgs = {
          'not-allowed':   'Microphone access denied. Allow microphone permission and try again.',
          'no-speech':     'No speech detected. Please speak clearly.',
          'network':       'Network error during voice recognition.',
        };
        Toast.error(msgs[err.error] || `Voice error: ${err.error}`);
        this.stopListening();
      };

      STATE.recognition.onend = () => {
        if (STATE.isListening) this.stopListening();
      };

      STATE.recognition.start();
    } catch (e) {
      Toast.error('Failed to start voice recognition.');
      this.stopListening();
    }
  },

  stopListening() {
    STATE.isListening = false;
    this._updateMicUI(false);
    try { if (STATE.recognition) STATE.recognition.stop(); } catch {}
    STATE.recognition = null;
  },

  _updateMicUI(listening) {
    const btn  = DOM.micBtn();
    const icon = DOM.micIcon();
    if (!btn || !icon) return;

    if (listening) {
      btn.classList.add('active');
      icon.setAttribute('data-lucide', 'mic-off');
      btn.setAttribute('title', 'Stop listening');
    } else {
      btn.classList.remove('active');
      icon.setAttribute('data-lucide', 'mic');
      btn.setAttribute('title', 'Voice input');
    }
    if (window.lucide) lucide.createIcons({ nodes: [btn] });
  },

  toggleTTS() {
    STATE.ttsEnabled = !STATE.ttsEnabled;
    Storage.set('ttsEnabled', STATE.ttsEnabled);
    this._syncTTSUI();
    if (!STATE.ttsEnabled) this.stopSpeaking();
  },

  // Sync the TTS button/icon/settings-checkbox UI to current STATE.ttsEnabled
  // without flipping the state value (used when state was already changed externally)
  _syncTTSUI() {
    const toggle  = DOM.ttsToggle();
    const icon    = DOM.ttsIcon();
    const setting = DOM.voiceToggleSetting();

    if (icon) {
      icon.setAttribute('data-lucide', STATE.ttsEnabled ? 'volume-2' : 'volume-x');
      if (window.lucide && toggle) lucide.createIcons({ nodes: [toggle] });
    }
    if (toggle) {
      toggle.classList.toggle('tts-on',  STATE.ttsEnabled);
      toggle.classList.toggle('tts-off', !STATE.ttsEnabled);
    }
    if (setting) setting.checked = STATE.ttsEnabled;
  },
};


/* ═══════════════════════════════════════════════════════════════════════════
   14. TASKS
   ═══════════════════════════════════════════════════════════════════════════ */
const Tasks = {
  _filter: 'all',
  _priorityFilter: null,

  getAll() { return Storage.get('tasks', []); },
  save(tasks) { Storage.set('tasks', tasks); },

  get(id) { return this.getAll().find(t => t.id === id); },

  create(data) {
    const tasks = this.getAll();
    const task = {
      id:        Date.now().toString(),
      title:     data.title.trim(),
      priority:  data.priority || 'medium',
      dueDate:   data.dueDate || null,
      notes:     data.notes || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(task);
    this.save(tasks);
    this.render();
    Dashboard.refresh();
    return task;
  },

  update(id, data) {
    const tasks = this.getAll();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx] = { ...tasks[idx], ...data };
    this.save(tasks);
    this.render();
    Dashboard.refresh();
  },

  delete(id) {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.save(tasks);
    this.render();
    Dashboard.refresh();
  },

  toggle(id) {
    const task = this.get(id);
    if (!task) return;
    this.update(id, { completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null });
  },

  render() {
    const container = DOM.taskList();
    if (!container) return;

    let tasks = this.getAll();

    // Filter by status
    if (this._filter === 'pending')   tasks = tasks.filter(t => !t.completed);
    if (this._filter === 'completed') tasks = tasks.filter(t => t.completed);

    // Filter by priority
    if (this._priorityFilter) tasks = tasks.filter(t => t.priority === this._priorityFilter);

    // Update label
    const all    = this.getAll();
    const pending = all.filter(t => !t.completed).length;
    const label  = DOM.taskCountLabel();
    if (label) label.textContent = all.length === 0 ? 'No tasks yet' : `${pending} pending · ${all.length - pending} completed`;

    // Badge
    const badge = DOM.tasksBadge();
    if (badge) {
      if (pending > 0) { badge.textContent = pending; badge.style.display = 'inline'; }
      else badge.style.display = 'none';
    }

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="check-square"></i>
          <h3>No tasks</h3>
          <p>${this._filter === 'all' ? "You're all clear. Create your first task." : `No ${this._filter} tasks.`}</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [container] });
      return;
    }

    container.innerHTML = tasks.map(task => this._taskHTML(task)).join('');
    if (window.lucide) lucide.createIcons({ nodes: [container] });

    // Wire up checkboxes
    container.querySelectorAll('.task-check').forEach(cb => {
      cb.addEventListener('change', () => this.toggle(cb.dataset.id));
    });
    container.querySelectorAll('[data-edit-task]').forEach(btn => {
      btn.addEventListener('click', () => TaskModal.open(btn.dataset.editTask));
    });
    container.querySelectorAll('[data-delete-task]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ok = await Confirm.show('Delete this task? This cannot be undone.', 'Delete Task');
        if (ok) { this.delete(btn.dataset.deleteTask); Toast.success('Task deleted'); }
      });
    });
  },

  _taskHTML(task) {
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
    const dueLabel  = task.dueDate ? new Date(task.dueDate + 'T00:00').toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';
    return `
      <div class="task-item ${task.completed ? 'completed' : ''}" role="listitem">
        <input type="checkbox" class="task-check" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task complete" />
        <div class="task-body">
          <div class="task-title">${this._escape(task.title)}</div>
          <div class="task-meta">
            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            ${dueLabel ? `<span class="task-due ${isOverdue ? 'overdue' : ''}">📅 ${dueLabel}${isOverdue ? ' — overdue' : ''}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="task-action-btn" data-edit-task="${task.id}" title="Edit task" aria-label="Edit task"><i data-lucide="pencil"></i></button>
          <button class="task-action-btn delete" data-delete-task="${task.id}" title="Delete task" aria-label="Delete task"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `;
  },

  _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
};

const TaskModal = {
  open(editId = null) {
    const modal = DOM.taskModalBackdrop();
    DOM.taskModalTitle().textContent = editId ? 'Edit Task' : 'New Task';
    DOM.taskEditId().value = editId || '';
    DOM.taskTitle().value  = '';
    DOM.taskPriority().value = 'medium';
    DOM.taskDueDate().value  = '';
    DOM.taskNotes().value    = '';

    if (editId) {
      const task = Tasks.get(editId);
      if (task) {
        DOM.taskTitle().value    = task.title;
        DOM.taskPriority().value = task.priority;
        DOM.taskDueDate().value  = task.dueDate || '';
        DOM.taskNotes().value    = task.notes || '';
      }
    }

    modal.style.display = 'flex';
    setTimeout(() => DOM.taskTitle().focus(), 50);
  },

  close() {
    DOM.taskModalBackdrop().style.display = 'none';
  },

  save() {
    const title = DOM.taskTitle().value.trim();
    if (!title) { Toast.warning('Please enter a task title.'); DOM.taskTitle().focus(); return; }

    const data = {
      title:    title,
      priority: DOM.taskPriority().value,
      dueDate:  DOM.taskDueDate().value || null,
      notes:    DOM.taskNotes().value,
    };

    const editId = DOM.taskEditId().value;
    if (editId) {
      Tasks.update(editId, data);
      Toast.success('Task updated');
    } else {
      Tasks.create(data);
      Toast.success('Task created');
    }
    this.close();
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   15. NOTES
   ═══════════════════════════════════════════════════════════════════════════ */
const Notes = {
  _query: '',

  getAll() { return Storage.get('notes', []); },
  save(notes) { Storage.set('notes', notes); },

  get(id) { return this.getAll().find(n => n.id === id); },

  create(data) {
    const notes = this.getAll();
    const note = {
      id:        Date.now().toString(),
      title:     data.title.trim(),
      content:   data.content || '',
      pinned:    !!data.pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(note);
    this.save(notes);
    this.render();
    Dashboard.refresh();
    return note;
  },

  update(id, data) {
    const notes = this.getAll();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return;
    notes[idx] = { ...notes[idx], ...data, updatedAt: new Date().toISOString() };
    this.save(notes);
    this.render();
    Dashboard.refresh();
  },

  delete(id) {
    this.save(this.getAll().filter(n => n.id !== id));
    this.render();
    Dashboard.refresh();
  },

  render() {
    const grid = DOM.noteGrid();
    if (!grid) return;

    let notes = this.getAll();

    // Sort: pinned first
    notes = [...notes.filter(n => n.pinned), ...notes.filter(n => !n.pinned)];

    // Filter by search
    if (this._query) {
      const q = this._query.toLowerCase();
      notes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    // Update label
    const all = this.getAll();
    const lbl = DOM.noteCountLabel();
    if (lbl) lbl.textContent = all.length === 0 ? 'No notes yet' : `${all.length} note${all.length !== 1 ? 's' : ''}`;

    if (notes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <i data-lucide="file-text"></i>
          <h3>${this._query ? 'No notes match your search' : 'No notes yet'}</h3>
          <p>${this._query ? 'Try a different search term.' : 'Your workspace is empty. Create a note to get started.'}</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [grid] });
      return;
    }

    grid.innerHTML = notes.map(n => this._noteHTML(n)).join('');
    if (window.lucide) lucide.createIcons({ nodes: [grid] });

    grid.querySelectorAll('[data-edit-note]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); NoteModal.open(btn.dataset.editNote); });
    });
    grid.querySelectorAll('[data-delete-note]').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const ok = await Confirm.show('Delete this note? This cannot be undone.', 'Delete Note');
        if (ok) { this.delete(btn.dataset.deleteNote); Toast.success('Note deleted'); }
      });
    });
    grid.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', () => NoteModal.open(card.dataset.noteId));
    });
  },

  _noteHTML(note) {
    const preview = note.content.slice(0, 150) + (note.content.length > 150 ? '…' : '');
    const dateStr = new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `
      <div class="note-card ${note.pinned ? 'pinned' : ''}" data-note-id="${note.id}" role="listitem" tabindex="0" aria-label="Note: ${this._escape(note.title)}">
        <div class="note-card-header">
          <span class="note-title">${this._escape(note.title)}</span>
          ${note.pinned ? '<i data-lucide="pin" class="note-pin-icon"></i>' : ''}
        </div>
        ${preview ? `<p class="note-preview">${this._escape(preview)}</p>` : ''}
        <div class="note-footer">
          <span class="note-date">${dateStr}</span>
          <div class="note-actions">
            <button class="note-action-btn" data-edit-note="${note.id}" title="Edit note" aria-label="Edit note"><i data-lucide="pencil"></i></button>
            <button class="note-action-btn delete" data-delete-note="${note.id}" title="Delete note" aria-label="Delete note"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
      </div>
    `;
  },

  _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
};

const NoteModal = {
  open(editId = null) {
    DOM.noteModalTitle().textContent = editId ? 'Edit Note' : 'New Note';
    DOM.noteEditId().value  = editId || '';
    DOM.noteTitle().value   = '';
    DOM.noteContent().value = '';
    DOM.notePin().checked   = false;

    if (editId) {
      const note = Notes.get(editId);
      if (note) {
        DOM.noteTitle().value   = note.title;
        DOM.noteContent().value = note.content;
        DOM.notePin().checked   = note.pinned;
      }
    }

    DOM.noteModalBackdrop().style.display = 'flex';
    setTimeout(() => DOM.noteTitle().focus(), 50);
  },

  close() { DOM.noteModalBackdrop().style.display = 'none'; },

  save() {
    const title = DOM.noteTitle().value.trim();
    if (!title) { Toast.warning('Please enter a note title.'); DOM.noteTitle().focus(); return; }

    const data = {
      title:   title,
      content: DOM.noteContent().value,
      pinned:  DOM.notePin().checked,
    };

    const editId = DOM.noteEditId().value;
    if (editId) { Notes.update(editId, data); Toast.success('Note saved'); }
    else        { Notes.create(data);         Toast.success('Note created'); }
    this.close();
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   16. REMINDERS
   ═══════════════════════════════════════════════════════════════════════════ */
const Reminders = {
  _notifGranted: false,

  getAll() { return Storage.get('reminders', []); },
  save(r)  { Storage.set('reminders', r); },

  get(id) { return this.getAll().find(r => r.id === id); },

  async requestNotifications() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') { this._notifGranted = true; return; }
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      this._notifGranted = perm === 'granted';
    }
  },

  create(data) {
    const items = this.getAll();
    const item = {
      id:          Date.now().toString(),
      title:       data.title.trim(),
      date:        data.date,
      time:        data.time,
      description: data.description || '',
      createdAt:   new Date().toISOString(),
    };
    items.push(item);
    items.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    this.save(items);
    this.render();
    Dashboard.refresh();
    return item;
  },

  delete(id) {
    this.save(this.getAll().filter(r => r.id !== id));
    this.render();
    Dashboard.refresh();
  },

  render() {
    const container = DOM.reminderList();
    if (!container) return;

    const now     = new Date();
    const items   = this.getAll();
    const upcoming = items.filter(r => new Date(`${r.date}T${r.time}`) >= now);
    const overdue  = items.filter(r => new Date(`${r.date}T${r.time}`) < now);

    // Label
    const lbl = DOM.reminderCountLabel();
    if (lbl) lbl.textContent = items.length === 0 ? 'No reminders set' : `${upcoming.length} upcoming · ${overdue.length} overdue`;

    // Badge
    const badge = DOM.remindersBadge();
    if (badge) {
      const total = overdue.length;
      if (total > 0) { badge.textContent = total; badge.style.display = 'inline'; }
      else badge.style.display = 'none';
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="bell"></i>
          <h3>No reminders</h3>
          <p>Create a reminder to stay on track.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [container] });
      return;
    }

    const all = [...overdue, ...upcoming];
    container.innerHTML = all.map(r => this._reminderHTML(r, now)).join('');
    if (window.lucide) lucide.createIcons({ nodes: [container] });

    container.querySelectorAll('[data-delete-reminder]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ok = await Confirm.show('Delete this reminder?', 'Delete Reminder');
        if (ok) { this.delete(btn.dataset.deleteReminder); Toast.success('Reminder deleted'); }
      });
    });
  },

  _reminderHTML(item, now) {
    const dt       = new Date(`${item.date}T${item.time}`);
    const isOverdue = dt < now;
    const isSoon   = !isOverdue && (dt - now) < 3600000; // within 1 hour
    const dateStr  = dt.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr  = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cls      = isOverdue ? 'overdue' : (isSoon ? 'soon' : '');

    return `
      <div class="reminder-item ${cls}" role="listitem">
        <div class="reminder-icon"><i data-lucide="${isOverdue ? 'bell-off' : 'bell'}"></i></div>
        <div class="reminder-body">
          <div class="reminder-title">${this._escape(item.title)}</div>
          ${item.description ? `<div class="reminder-desc">${this._escape(item.description)}</div>` : ''}
          <div class="reminder-time">${isOverdue ? '⚠️ Overdue · ' : ''}${dateStr} at ${timeStr}</div>
        </div>
        <div class="reminder-actions">
          <button class="reminder-action-btn delete" data-delete-reminder="${item.id}" title="Delete" aria-label="Delete reminder">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
  },

  _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  // Poll for due reminders every minute
  startChecking() {
    setInterval(() => {
      const now = new Date();
      this.getAll().forEach(r => {
        const dt = new Date(`${r.date}T${r.time}`);
        const diff = dt - now;
        if (diff >= 0 && diff < 60000) {
          // Due within 60 seconds
          if (this._notifGranted) {
            new Notification('⏰ JARVIS Reminder', { body: r.title, icon: 'jarvis.png' });
          } else {
            Toast.warning(`⏰ Reminder: ${r.title}`);
          }
        }
      });
    }, 60000);
  },
};

const ReminderModal = {
  open() {
    DOM.reminderEditId().value  = '';
    DOM.reminderTitle().value   = '';
    DOM.reminderDate().value    = '';
    DOM.reminderTime().value    = '';
    DOM.reminderDesc().value    = '';

    // Default date = today
    const today = new Date().toISOString().split('T')[0];
    DOM.reminderDate().value = today;

    DOM.reminderModalBackdrop().style.display = 'flex';
    setTimeout(() => DOM.reminderTitle().focus(), 50);
  },

  close() { DOM.reminderModalBackdrop().style.display = 'none'; },

  save() {
    const title = DOM.reminderTitle().value.trim();
    const date  = DOM.reminderDate().value;
    const time  = DOM.reminderTime().value;
    if (!title) { Toast.warning('Please enter a reminder title.'); DOM.reminderTitle().focus(); return; }
    if (!date)  { Toast.warning('Please choose a date.'); return; }
    if (!time)  { Toast.warning('Please choose a time.'); return; }

    Reminders.create({ title, date, time, description: DOM.reminderDesc().value });
    Toast.success('Reminder set!');
    this.close();
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   17. HISTORY
   ═══════════════════════════════════════════════════════════════════════════ */
const History = {
  async load() {
    const container = DOM.historyLog();
    if (!container) return;

    container.innerHTML = '<div class="empty-state-mini">Loading…</div>';

    if (!STATE.backendOnline) {
      container.innerHTML = '<div class="empty-state-mini">Backend offline — history unavailable.</div>';
      return;
    }

    try {
      const data = await API.getHistory();
      const messages = data?.messages || [];
      this.render(messages);
    } catch {
      container.innerHTML = '<div class="empty-state-mini">Could not load history from server.</div>';
    }
  },

  render(messages) {
    const container = DOM.historyLog();
    if (!container) return;

    if (!messages || messages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="clock"></i>
          <h3>No conversation history</h3>
          <p>Your chat history will appear here once you start talking to JARVIS.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [container] });
      return;
    }

    container.innerHTML = messages.map(m => {
      const isUser = m.sender === 'user';
      const time   = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return `
        <div class="history-msg">
          <span class="history-sender ${isUser ? 'user' : ''}">${isUser ? 'You' : 'JARVIS'}</span>
          <span class="history-text">${this._escape(m.text)}</span>
          ${time ? `<span class="history-time">${time}</span>` : ''}
        </div>
      `;
    }).join('');
  },

  async clear() {
    if (!STATE.backendOnline) { Toast.error('Backend offline — cannot clear server history.'); return; }
    const ok = await Confirm.show('Clear all conversation history from the server? This cannot be undone.', 'Clear History');
    if (!ok) return;
    try {
      await API.clearHistory();
      Chat.clear(false);
      this.render([]);
      Toast.success('History cleared');
    } catch {
      Toast.error('Failed to clear history');
    }
  },

  _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   18. SEARCH
   ═══════════════════════════════════════════════════════════════════════════ */
const Search = {
  _timer: null,

  query(q) {
    clearTimeout(this._timer);
    const results = DOM.searchResults();
    if (!results) return;

    if (!q.trim()) { results.style.display = 'none'; return; }

    this._timer = setTimeout(() => {
      const q2 = q.toLowerCase();
      const hits = [];

      // Tasks
      Tasks.getAll().forEach(t => {
        if (t.title.toLowerCase().includes(q2)) {
          hits.push({ type: 'task', icon: 'check-square', text: t.title, action: () => { Nav.go('tasks'); } });
        }
      });

      // Notes
      Notes.getAll().forEach(n => {
        if (n.title.toLowerCase().includes(q2) || n.content.toLowerCase().includes(q2)) {
          hits.push({ type: 'note', icon: 'file-text', text: n.title, action: () => { Nav.go('notes'); NoteModal.open(n.id); } });
        }
      });

      // Chat history (current session)
      STATE.chatMessages.forEach(m => {
        if (m.text.toLowerCase().includes(q2)) {
          const preview = m.text.slice(0, 80) + (m.text.length > 80 ? '…' : '');
          hits.push({ type: 'chat', icon: 'message-circle', text: preview, action: () => Nav.go('chat') });
        }
      });

      if (hits.length === 0) {
        results.innerHTML = `<div class="search-no-results">No results for "${this._escape(q)}"</div>`;
      } else {
        results.innerHTML = hits.slice(0, 12).map((h, i) => `
          <div class="search-result-item" data-idx="${i}" tabindex="0" role="option">
            <i data-lucide="${h.icon}" class="search-result-icon"></i>
            <span class="search-result-type">${h.type}</span>
            <span class="search-result-text">${this._escape(h.text)}</span>
          </div>
        `).join('');
        if (window.lucide) lucide.createIcons({ nodes: [results] });
        results.querySelectorAll('.search-result-item').forEach((el, i) => {
          el.addEventListener('click', () => { hits[i].action(); results.style.display = 'none'; DOM.globalSearch().value = ''; });
        });
      }

      results.style.display = 'block';
    }, 250);
  },

  _escape(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   19. DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
const Dashboard = {
  refresh() {
    const tasks     = Tasks.getAll();
    const notes     = Notes.getAll();
    const reminders = Reminders.getAll();
    const now       = new Date();

    // Stats
    const pending   = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const upcoming  = reminders.filter(r => new Date(`${r.date}T${r.time}`) >= now).length;

    const el = id => document.getElementById(id);
    if (el('dashTasksValue'))     el('dashTasksValue').textContent     = tasks.length === 0 ? '—' : `${completed}/${tasks.length}`;
    if (el('dashNotesValue'))     el('dashNotesValue').textContent     = notes.length === 0 ? '—' : String(notes.length);
    if (el('dashRemindersValue')) el('dashRemindersValue').textContent = String(upcoming) || '—';

    // Recent tasks preview
    const recent = DOM.dashRecentTasks();
    if (recent) {
      const top = tasks.slice(0, 4);
      if (top.length === 0) {
        recent.innerHTML = '<div class="empty-state-mini">No tasks yet — create one above</div>';
      } else {
        recent.innerHTML = top.map(t => `
          <div class="dash-task-item">
            <input type="checkbox" style="width:14px;height:14px;accent-color:var(--success);border-radius:50%;cursor:pointer" ${t.completed ? 'checked' : ''} disabled />
            <span style="font-size:0.875rem;color:${t.completed ? 'var(--text-muted)' : 'var(--text)'};${t.completed ? 'text-decoration:line-through' : ''};flex:1">${Tasks._escape(t.title)}</span>
            <span class="priority-badge priority-${t.priority}">${t.priority}</span>
          </div>
        `).join('');
      }
    }
  },

  updateStatus(online, aiAvailable) {
    const el = DOM.dashStatusValue();
    if (!el) return;
    if (online) {
      el.textContent = aiAvailable ? 'ONLINE · AI READY' : 'ONLINE · NO AI';
      el.style.color = 'var(--success)';
    } else {
      el.textContent = 'OFFLINE';
      el.style.color = 'var(--error)';
    }
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   20. COMMANDS — client-side intent parsing
   ═══════════════════════════════════════════════════════════════════════════ */
const Commands = {
  handle(text) {
    const t = text.toLowerCase().trim();

    // Navigation
    if (t === 'show tasks'   || t === 'my tasks')   { Nav.go('tasks');     Chat._appendInfo('Opening Tasks.'); return true; }
    if (t === 'show notes'   || t === 'my notes')   { Nav.go('notes');     Chat._appendInfo('Opening Notes.'); return true; }
    if (t === 'show reminders')                     { Nav.go('reminders'); Chat._appendInfo('Opening Reminders.'); return true; }
    if (t === 'show history' || t === 'history')    { Nav.go('history');   Chat._appendInfo('Opening History.'); return true; }
    if (t === 'dashboard')                          { Nav.go('dashboard'); return true; }
    if (t === 'settings')                           { Nav.go('settings');  return true; }

    // Actions
    if (t === 'clear chat')   { Chat.clear(); return true; }
    if (t === 'stop speaking'){ Voice.stopSpeaking(); return true; }
    if (t === 'start voice mode' || t === 'voice mode') { Voice.startListening(); return true; }
    if (t === 'new task')     { Nav.go('tasks'); TaskModal.open(); return true; }
    if (t === 'new note')     { Nav.go('notes'); NoteModal.open(); return true; }
    if (t === 'new reminder') { Nav.go('reminders'); ReminderModal.open(); return true; }

    // Add task from text
    const addTaskMatch = t.match(/^(?:add|create)\s+task\s+(.+)$/);
    if (addTaskMatch) {
      const title = addTaskMatch[1];
      Tasks.create({ title, priority: 'medium' });
      Chat.appendMessage('bot', `✅ Task created: "${title}"`);
      return true;
    }

    // Create note from text
    const addNoteMatch = t.match(/^(?:add|create)\s+note\s+(.+)$/);
    if (addNoteMatch) {
      const title = addNoteMatch[1];
      Notes.create({ title, content: '' });
      Chat.appendMessage('bot', `📝 Note created: "${title}"`);
      return true;
    }

    return false;
  },
};

// Extend Chat with a helper for command feedback
Chat._appendInfo = function(msg) {
  this.appendMessage('bot', msg);
};

/* ═══════════════════════════════════════════════════════════════════════════
   21. SETTINGS
   ═══════════════════════════════════════════════════════════════════════════ */
const Settings = {
  load() {
    STATE.ttsEnabled   = Storage.get('ttsEnabled', true);
    STATE.speechRate   = Storage.get('speechRate', 1.0);
    STATE.speechVolume = Storage.get('speechVolume', 1.0);
    STATE.selectedVoice= Storage.get('selectedVoice', null);
    STATE.enterToSend  = Storage.get('enterToSend', true);
    STATE.autoScroll   = Storage.get('autoScroll', true);

    const vt = DOM.voiceToggleSetting(); if (vt) vt.checked = STATE.ttsEnabled;
    const vr = DOM.voiceRate();          if (vr) vr.value   = STATE.speechRate;
    const vv = DOM.voiceVolume();        if (vv) vv.value   = STATE.speechVolume;
    const es = DOM.enterToSendToggle();  if (es) es.checked = STATE.enterToSend;
    const as = DOM.autoScrollToggle();   if (as) as.checked = STATE.autoScroll;

    const rvl = DOM.voiceRateVal();   if (rvl) rvl.textContent = STATE.speechRate.toFixed(1) + '×';
    const vvl = DOM.voiceVolumeVal(); if (vvl) vvl.textContent = Math.round(STATE.speechVolume * 100) + '%';

    // TTS toggle button in chat
    const ttsBtn = DOM.ttsToggle();
    if (ttsBtn) ttsBtn.classList.toggle('tts-on', STATE.ttsEnabled);
  },

  populateVoices() {
    const sel = DOM.voiceSelect();
    if (!sel || !window.speechSynthesis) return;
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    sel.innerHTML = '<option value="">Default</option>';
    voices
      .filter(v => v.lang.startsWith('en'))
      .forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        if (v.name === STATE.selectedVoice) opt.selected = true;
        sel.appendChild(opt);
      });
  },

  export() {
    const data = Storage.export();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `jarvis-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast.success('Data exported');
  },

  import(file) {
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const data = JSON.parse(e.target.result);
        const ok = await Confirm.show('Import will overwrite your current data. Continue?', 'Import Data');
        if (!ok) return;
        Storage.import(data);
        this.load();
        Tasks.render();
        Notes.render();
        Reminders.render();
        Dashboard.refresh();
        Toast.success('Data imported successfully');
      } catch {
        Toast.error('Invalid file. Could not import data.');
      }
    };
    reader.readAsText(file);
  },

  async clearAll() {
    const ok = await Confirm.show('This will permanently delete all your tasks, notes, reminders, and preferences. This cannot be undone!', 'Clear All Data');
    if (!ok) return;
    Storage.clear();
    this.load();
    Tasks.render();
    Notes.render();
    Reminders.render();
    Dashboard.refresh();
    Chat.clear(false);
    Toast.success('All data cleared');
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   22. EVENT LISTENERS
   ═══════════════════════════════════════════════════════════════════════════ */
function bindEvents() {
  // ── Navigation ──────────────────────────────────────────────────────────
  DOM.navItems().forEach(item => {
    item.addEventListener('click', () => Nav.go(item.dataset.section));
  });

  // Dashboard stat cards
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => Nav.go(el.dataset.nav));
  });

  // Quick actions
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.dataset.action;
      if (a === 'new-task')     { Nav.go('tasks');     TaskModal.open(); }
      if (a === 'new-note')     { Nav.go('notes');     NoteModal.open(); }
      if (a === 'ask-jarvis')   { Nav.go('chat');      setTimeout(() => DOM.userInput()?.focus(), 50); }
      if (a === 'voice-mode')   { Nav.go('chat');      Voice.startListening(); }
      if (a === 'new-reminder') { Nav.go('reminders'); ReminderModal.open(); }
      if (a === 'view-history') { Nav.go('history'); }
    });
  });

  // Section links (handled in stat-cards binding above — de-duped here)

  // ── Sidebar toggle (mobile) ──────────────────────────────────────────────
  DOM.sidebarToggle().addEventListener('click', Nav.toggleSidebar.bind(Nav));
  DOM.sidebarOverlay().addEventListener('click', Nav.toggleSidebar.bind(Nav));

  // ── Theme ────────────────────────────────────────────────────────────────
  DOM.themeToggle().addEventListener('click', () => Theme.toggle());
  DOM.themeSelect()?.addEventListener('change', e => Theme.apply(e.target.value));

  // ── Global Search ────────────────────────────────────────────────────────
  DOM.globalSearch()?.addEventListener('input', e => Search.query(e.target.value));
  DOM.globalSearch()?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { DOM.searchResults().style.display = 'none'; DOM.globalSearch().value = ''; }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.topbar-search') && !e.target.closest('.search-results')) {
      DOM.searchResults().style.display = 'none';
    }
  });

  // ── Chat ─────────────────────────────────────────────────────────────────
  DOM.sendBtn()?.addEventListener('click', () => Chat.send());

  DOM.userInput()?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (STATE.enterToSend) {
        e.preventDefault();
        Chat.send();
      }
    }
  });
  DOM.userInput()?.addEventListener('input', () => Chat._autoResize());

  DOM.micBtn()?.addEventListener('click', () => Voice.startListening());
  DOM.ttsToggle()?.addEventListener('click', () => Voice.toggleTTS());
  DOM.clearChatBtn()?.addEventListener('click', async () => {
    if (STATE.chatMessages.length === 0) return;
    const ok = await Confirm.show('Clear the current conversation?', 'Clear Chat');
    if (ok) Chat.clear(false);
  });

  // ── Tasks ─────────────────────────────────────────────────────────────────
  DOM.newTaskBtn()?.addEventListener('click', () => TaskModal.open());
  DOM.saveTaskBtn()?.addEventListener('click', () => TaskModal.save());
  DOM.closeTaskModal()?.addEventListener('click', () => TaskModal.close());
  DOM.cancelTaskModal()?.addEventListener('click', () => TaskModal.close());
  DOM.taskModalBackdrop()?.addEventListener('click', e => { if (e.target === DOM.taskModalBackdrop()) TaskModal.close(); });
  DOM.taskTitle()?.addEventListener('keydown', e => { if (e.key === 'Enter') TaskModal.save(); });

  // Task filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.filter !== undefined) {
        document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Tasks._filter = btn.dataset.filter;
        Tasks.render();
      }
      if (btn.dataset.priority !== undefined) {
        const alreadyActive = btn.classList.contains('active');
        document.querySelectorAll('.filter-btn[data-priority]').forEach(b => b.classList.remove('active'));
        Tasks._priorityFilter = alreadyActive ? null : btn.dataset.priority;
        if (!alreadyActive) btn.classList.add('active');
        Tasks.render();
      }
    });
  });

  // ── Notes ─────────────────────────────────────────────────────────────────
  DOM.newNoteBtn()?.addEventListener('click', () => NoteModal.open());
  DOM.saveNoteBtn()?.addEventListener('click', () => NoteModal.save());
  DOM.closeNoteModal()?.addEventListener('click', () => NoteModal.close());
  DOM.cancelNoteModal()?.addEventListener('click', () => NoteModal.close());
  DOM.noteModalBackdrop()?.addEventListener('click', e => { if (e.target === DOM.noteModalBackdrop()) NoteModal.close(); });
  DOM.notesSearch()?.addEventListener('input', e => { Notes._query = e.target.value; Notes.render(); });

  // ── Reminders ─────────────────────────────────────────────────────────────
  DOM.newReminderBtn()?.addEventListener('click', () => ReminderModal.open());
  DOM.saveReminderBtn()?.addEventListener('click', () => ReminderModal.save());
  DOM.closeReminderModal()?.addEventListener('click', () => ReminderModal.close());
  DOM.cancelReminderModal()?.addEventListener('click', () => ReminderModal.close());
  DOM.reminderModalBackdrop()?.addEventListener('click', e => { if (e.target === DOM.reminderModalBackdrop()) ReminderModal.close(); });

  // ── History ───────────────────────────────────────────────────────────────
  DOM.clearHistoryBtn()?.addEventListener('click', () => History.clear());

  // ── Settings ──────────────────────────────────────────────────────────────
  DOM.voiceToggleSetting()?.addEventListener('change', e => {
    STATE.ttsEnabled = e.target.checked;
    Storage.set('ttsEnabled', STATE.ttsEnabled);
    Voice._syncTTSUI(); // only sync UI, don't re-flip state
    if (!STATE.ttsEnabled) Voice.stopSpeaking();
  });

  DOM.voiceRate()?.addEventListener('input', e => {
    STATE.speechRate = parseFloat(e.target.value);
    Storage.set('speechRate', STATE.speechRate);
    DOM.voiceRateVal().textContent = STATE.speechRate.toFixed(1) + '×';
  });

  DOM.voiceVolume()?.addEventListener('input', e => {
    STATE.speechVolume = parseFloat(e.target.value);
    Storage.set('speechVolume', STATE.speechVolume);
    DOM.voiceVolumeVal().textContent = Math.round(STATE.speechVolume * 100) + '%';
  });

  DOM.voiceSelect()?.addEventListener('change', e => {
    STATE.selectedVoice = e.target.value;
    Storage.set('selectedVoice', STATE.selectedVoice);
  });

  DOM.enterToSendToggle()?.addEventListener('change', e => {
    STATE.enterToSend = e.target.checked;
    Storage.set('enterToSend', STATE.enterToSend);
  });

  DOM.autoScrollToggle()?.addEventListener('change', e => {
    STATE.autoScroll = e.target.checked;
    Storage.set('autoScroll', STATE.autoScroll);
  });

  DOM.clearChatSettingBtn()?.addEventListener('click', async () => {
    if (STATE.chatMessages.length === 0) { Toast.info('Chat is already empty.'); return; }
    const ok = await Confirm.show('Clear the current conversation?', 'Clear Chat');
    if (ok) Chat.clear(false);
  });

  DOM.exportDataBtn()?.addEventListener('click', () => Settings.export());
  DOM.importDataInput()?.addEventListener('change', e => {
    if (e.target.files[0]) { Settings.import(e.target.files[0]); e.target.value = ''; }
  });
  DOM.clearAllDataBtn()?.addEventListener('click', () => Settings.clearAll());

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    // Ctrl+K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      DOM.globalSearch()?.focus();
    }
    // Ctrl+Enter → send chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (STATE.currentSection === 'chat') { e.preventDefault(); Chat.send(); }
    }
    // Escape → close modals / search
    if (e.key === 'Escape') {
      DOM.searchResults().style.display = 'none';
      TaskModal.close();
      NoteModal.close();
      ReminderModal.close();
      if (STATE.isListening) Voice.stopListening();
    }
    // Ctrl+N → new item based on current section
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      const modal = { tasks: TaskModal, notes: NoteModal, reminders: ReminderModal }[STATE.currentSection];
      if (modal) { e.preventDefault(); modal.open(); }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   23. INITIALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */
function init() {
  // Init Lucide icons
  if (window.lucide) lucide.createIcons();

  // Theme
  Theme.init();

  // Confirm dialog
  Confirm.init();

  // Load saved settings
  Settings.load();

  // Voice synthesis
  Voice.initSpeech();

  // Render productivity data
  Tasks.render();
  Notes.render();
  Reminders.render();
  Dashboard.refresh();

  // Initialize chat
  Chat.init();

  // Request notification permission for reminders
  Reminders.requestNotifications();
  Reminders.startChecking();

  // Bind all events
  bindEvents();

  // Start backend health polling
  Health.startPolling();

  // Default to dashboard
  Nav.go('dashboard');

  console.log('%cJARVIS Ultra Pro', 'color:#00d4ff;font-family:monospace;font-size:1.2em;font-weight:bold');
  console.log('Developed by Tanisha and Antim');
  console.log(`API Base: ${CONFIG.API_BASE}`);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
