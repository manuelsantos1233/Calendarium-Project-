let currentDate = new Date();
let photosData = {};

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

document.addEventListener("DOMContentLoaded", () => {
    loadPhotosAndRender();

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById("closeModal").addEventListener("click", closeModal);

    document.getElementById("uploadForm").addEventListener("submit", handleUpload);
});

async function loadPhotosAndRender() {
    try {
        const response = await fetch("/api/photos");
        photosData = await response.json();
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        photosData = {};
    }
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("monthYearDisplay").innerText = `${monthNames[month]} de ${year}`;

    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const firstDayIndex = new Date(year, month, 1).getDay();
    // Ajustar para começar na Segunda-feira (0 = Segunda, 6 = Domingo)
    const adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Câululas vazias antes do dia 1
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "h-24 bg-slate-50/50 rounded-lg border border-transparent";
        grid.appendChild(emptyDiv);
    }

    // Dias do mês
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement("div");
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;

        dayDiv.className = "h-24 bg-white border border-slate-200 rounded-lg p-2 flex flex-col justify-between hover:border-indigo-500 cursor-pointer transition shadow-2xs relative";

        const hasPhotos = photosData[dateKey] && photosData[dateKey].length > 0;

        dayDiv.innerHTML = `
            <span class="font-bold text-sm ${hasPhotos ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit' : 'text-slate-600'}">${day}</span>
            ${hasPhotos ? `<div class="text-xs text-indigo-700 font-medium truncate">📸 ${photosData[dateKey].length} foto(s)</div>` : `<span class="text-xs text-slate-300">Sem convívio</span>`}
        `;

        dayDiv.addEventListener("click", () => openDayModal(dateKey));
        grid.appendChild(dayDiv);
    }
}

function openDayModal(dateKey) {
    document.getElementById("selectedDateInput").value = dateKey;
    document.getElementById("modalDateTitle").innerText = `Convívios de ${dateKey}`;
    document.getElementById("dayModal").classList.remove("hidden");

    renderPhotosList(dateKey);
}

function closeModal() {
    document.getElementById("dayModal").classList.add("hidden");
    document.getElementById("uploadForm").reset();
}

function renderPhotosList(dateKey) {
    const container = document.getElementById("photosContainer");
    container.innerHTML = "";

    const photos = photosData[dateKey] || [];

    if (photos.length === 0) {
        container.innerHTML = `<p class="text-sm text-slate-400 col-span-2 py-2">Ainda não há fotos para este dia. Sê o primeiro a adicionar!</p>`;
        return;
    }

    photos.forEach(p => {
        const card = document.createElement("div");
        card.className = "border rounded-lg overflow-hidden bg-slate-50 shadow-2xs";
        card.innerHTML = `
            <a href="${p.url}" target="_blank">
                <img src="${p.url}" alt="Foto" class="h-28 w-full object-cover hover:opacity-90 transition">
            </a>
            <div class="p-2">
                <p class="text-xs font-bold text-slate-700">👤 ${escapeHtml(p.user)}</p>
                <p class="text-xs text-slate-500 truncate">${escapeHtml(p.caption || 'Sem legenda')}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

async function handleUpload(e) {
    e.preventDefault();
    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);
    const dateKey = document.getElementById("selectedDateInput").value;

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            await loadPhotosAndRender();
            form.reset();
            document.getElementById("selectedDateInput").value = dateKey; // manter data selecionada
            renderPhotosList(dateKey);
        } else {
            alert("Erro ao enviar a foto.");
        }
    } catch (err) {
        console.error("Erro no upload:", err);
        alert("Erro de ligação ao servidor.");
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
