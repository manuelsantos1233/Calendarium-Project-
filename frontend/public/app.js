/**
 * Frontend JavaScript para o Calendário de Convívios
 * Comunica com o backend Java Spring Boot em http://localhost:8080/api
 */

let currentDate = new Date();
let photosData = {};

// Nomes dos meses em português
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Formata data para exibição
function formatDate(date) {
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} de ${date.getFullYear()}`;
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  loadPhotosAndRender();
  setupEventListeners();
});

// Carrega fotos do backend e renderiza calendário
async function loadPhotosAndRender() {
  try {
    const response = await fetch("http://localhost:8080/api/photos");
    if (response.ok) {
      photosData = await response.json();
    } else {
      photosData = {};
    }
  } catch (error) {
    console.error("Erro ao carregar fotos:", error);
    photosData = {};
  }
  renderCalendar();
}

// Configura listeners dos botões de navegação
function setupEventListeners() {
  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

// Renderiza a grelha do calendário
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthYearDisplay").innerText = `${monthNames[month]} de ${year}`;

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // 1 de cada mês começa em dia da semana específico
  const firstDay = new Date(year, month, 1).getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
  const offset = (firstDay + 6) % 7; // Ajustar para semana começar em Seg (índice 0)

  // Células vazias antes do dia 1
  for (let i = 0; i < offset; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "h-24 bg-gray-50/50 rounded-lg border border-transparent";
    grid.appendChild(emptyDiv);
  }

  // Dias do mês
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement("div");
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    dayDiv.className = `h-24 bg-white border border-gray-200 rounded-lg p-2 flex flex-col justify-between hover:border-indigo-500 cursor-pointer transition shadow-xs relative`;

    const hasPhotos = photosData[dateKey] && photosData[dateKey].length > 0;

    dayDiv.innerHTML = `
      <span class="font-bold text-sm ${hasPhotos ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit' : 'text-gray-600'}">
        ${day}
      </span>
      ${hasPhotos ? `
        <div class="text-xs text-indigo-700 font-medium truncate">
          📸 ${photosData[dateKey].length} foto(s)
        </div>
      ` : `
        <span class="text-xs text-gray-300">Sem convívio</span>
      `}
    `;

    dayDiv.addEventListener("click", () => openDayModal(dateKey));
    grid.appendChild(dayDiv);
  }
}

// Abre modal de convívio do dia
function openDayModal(dateKey) {
  document.getElementById("selectedDateInput").value = dateKey;
  document.getElementById("modalDateTitle").innerText = `Convívios de ${dateKey}`;
  document.getElementById("dayModal").classList.remove("hidden");

  renderPhotosList(dateKey);
}

// Fecha o modal
function closeModal() {
  document.getElementById("dayModal").classList.add("hidden");
  document.getElementById("uploadForm").reset();
}

// Renderiza a lista de fotos existentes para o dia selecionado
function renderPhotosList(dateKey) {
  const container = document.getElementById("photosContainer");
  container.innerHTML = "";

  const photos = photosData[dateKey] || [];

  if (photos.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-400 col-span-2 py-2">Ainda não há fotos para este dia. Sê o primeiro a adicionar!</p>`;
    return;
  }

  photos.forEach(p => {
    const card = document.createElement("div");
    card.className = "border rounded-lg overflow-hidden bg-gray-50 shadow-xs";
    card.innerHTML = `
      <a href="${p.url}" target="_blank">
        <img src="${p.url}" alt="Foto" class="h-28 w-full object-cover hover:opacity-90 transition">
      </a>
      <div class="p-2">
        <p class="text-xs font-bold text-gray-700">👤 ${escapeHtml(p.user)}</p>
        <p class="text-xs text-gray-500 truncate">${escapeHtml(p.caption || 'Sem legenda')}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Manipula o envio do formulário de upload
async function handleUpload(e) {
  e.preventDefault();

  const form = document.getElementById("uploadForm");
  const formData = new FormData(form);
  const dateKey = document.getElementById("selectedDateInput").value;

  try {
    const response = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      await loadPhotosAndRender();
      form.reset();
      document.getElementById("selectedDateInput").value = dateKey;
      renderPhotosList(dateKey);
    } else {
      alert("Erro ao enviar a foto. Tenta novamente.");
    }
  } catch (err) {
    console.error("Erro no upload:", err);
    alert("Erro de ligação ao servidor.");
  }
}

// Função auxiliar para escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fecha modal ao clicar no "x"
document.getElementById("closeModal").addEventListener("click", closeModal);

// Fecha modal ao clicar fora
document.getElementById("dayModal").addEventListener("click", (e) => {
  if (e.target.id === "dayModal") {
    closeModal();
  }
});