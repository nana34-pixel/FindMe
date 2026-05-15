    function showToast(message, iconClass = 'fa-solid fa-check-circle') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div'); toast.className = 'toast';
      toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, 3000);
    }
    const inputMsg = document.getElementById('messageInput'); const sendBtn = document.getElementById('sendBtn');
    function scrollToBottom() { const m = document.getElementById('messages'); m.scrollTop = m.scrollHeight; }
    function appendMessage(text, sent = true) {
      const m = document.getElementById('messages'); const bubble = document.createElement('div');
      bubble.className = `message ${sent ? 'sent' : 'received'}`; bubble.innerHTML = `${text}<div class="message-time">Ahora</div>`;
      m.appendChild(bubble); scrollToBottom();
    }
    function sendMessage() {
      const text = inputMsg.value.trim(); if (!text) return;
      appendMessage(text, true); inputMsg.value = '';
      setTimeout(() => appendMessage('👍 Perfecto, ¿te parece si nos vemos en un punto público cercano?', false), 1200);
    }
    sendBtn.addEventListener('click', sendMessage); inputMsg.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    document.querySelectorAll('.reply-chip').forEach(chip => chip.addEventListener('click', () => { inputMsg.value = chip.textContent.trim(); inputMsg.focus(); }));
    scrollToBottom();