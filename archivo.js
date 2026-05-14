// archivo.js - Funciones auxiliares para toda la aplicación

function togglePasswordVisibility(inputId, buttonElement) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
  if (buttonElement) {
    const icon = buttonElement.querySelector('i');
    if (icon) {
      icon.className = type === 'password' ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    }
  }
}

function toggleFavorite(buttonElement) {
  if (!buttonElement) return;
  buttonElement.classList.toggle('active');
  const icon = buttonElement.querySelector('i');
  if (icon) {
    icon.className = buttonElement.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }
}

function enviarMensaje(chatInputId, messagesContainerId) {
  const input = document.getElementById(chatInputId);
  const container = document.getElementById(messagesContainerId);
  if (!input || !container) return;
  const text = input.value.trim();
  if (text === '') return;
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message sent';
  messageDiv.innerHTML = `${text}<div class="message-time">Ahora</div>`;
  container.appendChild(messageDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'message received';
    replyDiv.innerHTML = `Gracias por tu mensaje, te responderé pronto.<div class="message-time">Ahora</div>`;
    container.appendChild(replyDiv);
    container.scrollTop = container.scrollHeight;
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFavorite(btn);
    });
  });
  document.querySelectorAll('.toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-target') || (btn.parentElement?.querySelector('input')?.id);
      if (inputId) togglePasswordVisibility(inputId, btn);
    });
  });
});