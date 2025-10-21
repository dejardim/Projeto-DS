// ============================
// SCRIPT PRINCIPAL - NUMO
// ============================

// Seletores principais
const btnDashboard = document.getElementById('btn-dashboard');
const btnChat = document.getElementById('btn-chat');
const dashboardScreen = document.getElementById('dashboard-screen');
const chatDashboardScreen = document.getElementById('chat-dashboard-screen');
const saldoMesEl = document.getElementById('saldo-mes');
const statusIcon = document.getElementById('status-icon');
const saldoStatus = document.getElementById('saldo-status');

// ============================
// FUNÇÃO: Atualizar status de saldo
// ============================
function atualizarStatusSaldo() {
  if (!saldoMesEl || !statusIcon || !saldoStatus) return;

  // Caminho base das imagens dos ícones
  const ICONS_BASE = '/assets/imagens/';

  const valorTexto = saldoMesEl.textContent
    .replace(/[^\d,-]/g, '')
    .replace(',', '.');
  const valor = parseFloat(valorTexto) || 0;

  if (valor >= 0) {
    statusIcon.src = ICONS_BASE + 'saldo_positivo.png';
    saldoStatus.textContent = 'Saldo Positivo';
    saldoStatus.style.color = '#2F4F4F';
  } else {
    statusIcon.src = ICONS_BASE + 'saldo_negativo.png';
    saldoStatus.textContent = 'Saldo Negativo';
    saldoStatus.style.color = '#6B2929';
  }
}

// Executa ao carregar
atualizarStatusSaldo();

// ============================
// FUNÇÕES DE TRANSIÇÃO ENTRE TELAS
// ============================

const DURATION = 280;

// utilitário p/ limpar classes de animação
function resetAnim(el) {
  el.classList.remove(
    'fade-in','fade-out',
    'slide-in-left','slide-in-right',
    'slide-out-left','slide-out-right',
    'hidden','active'
  );
}

// transição genérica
function transition(fromEl, toEl, outClasses, inClasses) {
  // prepara
  fromEl.classList.remove('hidden');
  toEl.classList.remove('hidden');

  // reseta estados
  resetAnim(fromEl);
  resetAnim(toEl);

  // estados de partida
  fromEl.classList.add('active');
  toEl.classList.add('active');

  // aplica animações
  fromEl.classList.add('fade-out', ...outClasses);
  toEl.classList.add('fade-in', ...inClasses);

  // finaliza após a duração
  setTimeout(() => {
    fromEl.classList.add('hidden');
    // limpa classes transitórias
    fromEl.classList.remove('fade-out', ...outClasses, 'active');
    toEl.classList.remove('fade-in', ...inClasses);
  }, DURATION);
}

// mostrar apenas Dashboard
function mostrarDashboard() {
  transition(chatDashboardScreen, dashboardScreen, ['slide-out-left'], ['slide-in-right']);
  btnDashboard.classList.add('active');
  btnChat.classList.remove('active');
}

// mostrar Chat + Dashboard
function mostrarChat() {
  transition(dashboardScreen, chatDashboardScreen, ['slide-out-right'], ['slide-in-left']);
  btnChat.classList.add('active');
  btnDashboard.classList.remove('active');
}

// Alterna entre Chat e Dashboard ao clicar no botão de Chat
btnChat.addEventListener('click', () => {
  if (btnChat.classList.contains('active')) {
    mostrarDashboard();   // segundo clique no Chat → volta ao dashboard
  } else {
    mostrarChat();        // primeiro clique → abre chat
  }
});

btnDashboard.addEventListener('click', mostrarDashboard);

// Estado inicial
mostrarDashboard();

// ============================
// PLACEHOLDER DE CHAT ESTÁTICO
// ============================
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatBody = document.getElementById('chat-body');

chatSend.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (!msg) return;

  const userMsg = document.createElement('div');
  userMsg.classList.add('chat-message');
  userMsg.textContent = msg;
  chatBody.appendChild(userMsg);

  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;
});

// ============================
// CLONAR DASHBOARD PRINCIPAL PARA CHAT+DASHBOARD
// ============================
window.addEventListener('load', () => {
  const originalDashboard = document.querySelector('#dashboard-screen .dashboard-main');
  const cloneTarget = document.getElementById('dashboard-body-clone');

  if (!originalDashboard || !cloneTarget) return;

  const clone = originalDashboard.cloneNode(true);
  cloneTarget.innerHTML = '';
  cloneTarget.appendChild(clone);
});

// ============================
// CHAT: helpers de UI
// ============================
function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.classList.add('chat-message', 'user');
  if (role === 'assistant') msg.classList.add('assistant');
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
  return msg;
}

let typingEl = null;
function showTyping() {
  typingEl = addMessage('assistant', 'Digitando...');
  typingEl.style.opacity = 0.6;
  typingEl.style.fontStyle = 'italic';
}
function hideTyping() {
  if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
  typingEl = null;
}

function setDisabled(sending) {
  chatInput.disabled = sending;
  chatSend.disabled  = sending;
}

// ============================
// CHAT: Envio e chamada de API
// ============================
const CHAT_ENDPOINT = '/api/chat';

// Histórico simples em memória
const history = [];

async function sendToApi(message, historySnapshot) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Enviamos a msg e o histórico
    body: JSON.stringify({ message, history: historySnapshot }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(`Erro ${res.status}: ${txt || res.statusText}`);
  }

  // Espera um JSON no formato { reply: "texto da IA" }
  const data = await res.json();
  if (!data || typeof data.reply !== 'string') {
    throw new Error('Resposta inválida do servidor.');
  }
  return data.reply;
}

// ============================
// CHAT: Wire-up dos eventos
// ============================

async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  // UI imediata
  addMessage('user', text);
  chatInput.value = '';
  setDisabled(true);
  showTyping();

  // Atualiza histórico local
  history.push({ role: 'user', content: text });

  try {
    const reply = await sendToApi(text, history.slice(-10));
    hideTyping();
    addMessage('assistant', reply);
    history.push({ role: 'assistant', content: reply });
  } catch (err) {
    hideTyping();
    addMessage('assistant', '⚠️ Ocorreu um erro ao falar com o Numo.');
    console.error(err);
  } finally {
    setDisabled(false);
    chatInput.focus();
  }
}

chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
