// ================================================================
// main.js — JavaScript untuk LIA (Legal Information Assistant)
// Hubungkan ke index.html dengan: <script src="main.js"></script>
// Letakkan tag <script> tepat sebelum </body> supaya DOM sudah siap
// ================================================================


// ================================================================
// JS #1 — TYPEWRITER EFFECT
// Konsep: String indexing, setInterval, clearInterval, textContent
// ================================================================
(function typewriterEffect() {
  const el = document.getElementById('hero-title');
  if (el) {
    //jalankan efek typewriter
  }
  const text = 'Pahami Hak Hukum Anda bersama LIA';
  let i = 0;

  // setInterval → jalankan fungsi setiap 45 milidetik
  const interval = setInterval(function () {
    el.textContent += text[i]; // tambah 1 karakter ke elemen
    i++;
    if (i >= text.length) clearInterval(interval); // berhenti setelah selesai
  }, 45);
})();

// ================================================================
// JS #3 — AI CHATBOT WIDGET
// Konsep: Fetch API, async/await, DOM manipulation, event handling
// API: Google Gemini API
// Dapatkan API key gratis di: https://aistudio.google.com/apikey
// ================================================================
(function aiChatbot() {
  // ⚠️  GANTI dengan API key Gemini kamu dari https://aistudio.google.com/apikey
  const GEMINI_API_KEY = "AQ.Ab8RN6KVs09alkWDEzBTalEqEh9TtjJ-f553Y8SK5UtW3vfJ-w";
  const GEMINI_MODEL = "gemini-2.5-flash";
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const SYSTEM_PROMPT = `Kamu adalah LIA (Legal Information Assistant).

LIA merupakan AI Assistant yang membantu masyarakat Indonesia
memahami informasi hukum secara sederhana,
cepat,
dan mudah dipahami.

================================================

FOKUS LIA

================================================

1. Hak Perempuan

2. Perlindungan Anak

3. UMKM

4. Hukum Perdata

5. Hukum Keluarga

6. Perjanjian

7. Kontrak

8. Perlindungan Konsumen

9. Legalitas Usaha

10. Perizinan

================================================

CARA MENJAWAB

================================================

Gunakan Bahasa Indonesia.

Gunakan bahasa yang sederhana.

Hindari istilah hukum yang rumit.

Jika harus menggunakan istilah hukum,
berikan penjelasan artinya.

Selalu gunakan format berikut.

Ringkasan

Dasar Hukum

Penjelasan

Langkah yang Dapat Dilakukan

Disclaimer

================================================

ATURAN

================================================

Jangan membuat informasi palsu.

Jangan memberikan putusan hukum.

Jangan menyatakan seseorang pasti menang di pengadilan.

Jika informasi belum pasti,
katakan bahwa pengguna perlu berkonsultasi dengan advokat
atau lembaga bantuan hukum.

Jika pengguna bertanya di luar topik hukum,
jawab dengan sopan bahwa LIA hanya membantu
informasi hukum mengenai perempuan,
anak,
UMKM,
dan hukum perdata.

================================================

DISCLAIMER

================================================

Jawaban LIA merupakan informasi hukum umum
dan bukan merupakan nasihat hukum yang mengikat.

`;
  const toggleBtn = document.getElementById('chat-toggle');
  const chatBox = document.getElementById('chat-box');
  const closeBtn = document.getElementById('chat-close');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const badgeEl = document.getElementById('chat-badge');
  const suggestionsEl = document.getElementById('chat-suggestions');
  if (
    !toggleBtn ||
    !chatBox ||
    !messagesEl ||
    !inputEl ||
    !sendBtn
) {

    console.error("Elemen chatbot tidak ditemukan.");

    return;

}


  let isOpen = false;
  let isLoading = false;
  let history = []; // Gemini format: [{ role: 'user'|'model', parts: [{ text }] }]
  appendMessage(
    "ai",
    `
<b>👋 Halo, saya LIA.</b><br><br>

Saya siap membantu menjawab pertanyaan hukum mengenai:

• Hak Perempuan

• Perlindungan Anak

• UMKM

• Perjanjian

• Kontrak

Silakan tuliskan pertanyaan Anda.
`
);

  history.push({
    role: "model",
    parts: [{
      text: "Halo, saya LIA."
    }]
  });

  // --- Toggle open/close ---
  function openChat() {
    isOpen = true;
    chatBox.classList.add('open');
    chatBox.setAttribute('aria-hidden', 'false');
    badgeEl.style.display = 'none';
    inputEl.focus();
  }

  function closeChat() {
    isOpen = false;
    chatBox.classList.remove('open');
    chatBox.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', function () {
    isOpen ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  // --- Suggestion chips ---
  suggestionsEl.addEventListener('click', function (e) {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip) return;
    inputEl.value = chip.dataset.prompt;
    suggestionsEl.style.display = 'none';
    sendMessage();
  });

  // --- Send on Enter (Shift+Enter = newline) ---
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  sendBtn.addEventListener('click', sendMessage);

  // --- Append message bubble to DOM ---
  function appendMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg ' + role;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = content;

    const time = document.createElement('p');
    time.className = 'msg-time';
    const now = new Date();
    time.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // --- Typing indicator ---
  function showTyping() {

    const wrapper = document.createElement("div");

    wrapper.className = "chat-msg ai";

    wrapper.id = "chat-typing";

    const bubble = document.createElement("div");

    bubble.className = "msg-bubble";

    bubble.innerHTML = `
        <div class="lia-loading">

            <div class="loading-icon">
                ⚖️🤖
            </div>

            <strong>LIA sedang menganalisis pertanyaan Anda...</strong>

            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    `;

    wrapper.appendChild(bubble);

    messagesEl.appendChild(wrapper);

    messagesEl.scrollTop = messagesEl.scrollHeight;

}

  function removeTyping() {
    const typing = document.getElementById("chat-typing");

    if (typing) {

        typing.remove();

    }

}

  // --- Format markdown-lite → HTML ---
  function formatReply(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px">$1</code>')
      .replace(/\n/g, '<br>');
  }

  // --- Main send function (Gemini API) ---
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    // Tambahkan pesan user ke DOM & history (format Gemini)
    appendMessage('user', text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    history.push({ role: 'user', parts: [{ text: text }] });
    inputEl.value = '';
    inputEl.style.height = 'auto';

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      // Gemini API: system instruction + conversation history
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: history,
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 4096,
           
          }
        })
      });

      const data = await response.json();
      console.log("Status:", response.status);
      console.log(JSON.stringify(data, null, 2));
      removeTyping();

      // Ekstrak teks dari response Gemini
      const reply =
        data?.candidates &&
          data.candidates[0] &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0].text
          ? data.candidates[0].content.parts[0].text
          : (data.error ? `⚠️ Error: ${data.error.message}` : 'Maaf, saya mengalami gangguan. Coba lagi ya! 🙏');

      // Simpan balasan ke history (role 'model' = format Gemini)
      history.push({ role: 'model', parts: [{ text: reply }] });
      removeTyping();
      appendMessage("ai", reply);

      // Badge unread jika chat sedang tertutup
      if (badgeEl) {
        badgeEl.style.display = 'flex';
      }

    } catch (err) {

    removeTyping();

    appendMessage(
        "ai",
        `
        ⚠️ <b>LIA tidak dapat terhubung ke layanan AI.</b><br><br>

        Silakan coba kembali beberapa saat lagi.
        `
    );
    console.error("Gemini chat error:", err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  // Tampilkan badge setelah 3 detik untuk menarik perhatian
  setTimeout(function () {
    if (!isOpen && badgeEl) badgeEl.style.display = 'flex';
  }, 3000);
})();

// ================================================================
// JS #2 — BACK TO TOP BUTTON
// Konsep: window scroll event, scrollY, scrollTo, display toggle
// ================================================================
(function backToTop() {
  const btn = document.getElementById('back-to-top');

  // Pantau posisi scroll halaman
  window.addEventListener('scroll', function () {
    // Ternary: tampilkan tombol jika sudah scroll > 300px
    btn.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
  });

  // Klik → scroll halus ke paling atas
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
