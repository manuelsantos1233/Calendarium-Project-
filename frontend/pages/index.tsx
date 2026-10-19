/** @type NextConfig */
import "./globals.css";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-indigo-600 text-white shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📅 Calendário de Convívios
          </h1>
          <p className="text-sm bg-indigo-700 py-1 px-3 rounded-full">
            Equipa: 2 Agentes Java + 1 Aluno + 1 Agente Next.js
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Controle de navegação */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setMonth(prev)}
              className="bg-white rounded-lg px-4 py-2 text-indigo-600 hover:bg-indigo-50 transition"
            >
              Mês Anterior
            </button>
            <h2 className="text-xl font-bold text-indigo-900">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={() => setMonth(next)}
              className="bg-white rounded-lg px-4 py-2 text-indigo-600 hover:bg-indigo-50 transition"
            >
              Próximo Mês
            </button>
          </div>

          {/* Grelha dos Dias */}
          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-400 mb-2">
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>

          <div id="calendarGrid" className="grid grid-cols-7 gap-2">
            {/* Será preenchido dinamicamente */}
          </div>
        </div>
      </main>
    </main>
  );
}