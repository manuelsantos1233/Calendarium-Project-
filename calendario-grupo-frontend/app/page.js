'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // Estados para o cronómetro (dias, horas, minutos, segundos)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Estados para o formulário de login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();

  // Lógica do Cronómetro até ao dia 30 deste mês (Outubro de 2026)
  useEffect(() => {
    const targetDate = new Date('2026-10-30T23:59:59').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Função quando o utilizador clica em entrar
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'amigos123') {
      router.push('/dashboard');
    } else {
      alert('Wrong password!');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 font-sans antialiased">
      
      {/* Botão Superior (Get early access) */}
      <button className="absolute top-10 text-xs text-zinc-500 border border-zinc-700 px-4 py-1 rounded-full hover:text-white transition-colors">
        Get early access
      </button>

      {/* Conteúdo Central */}
      <div className="text-center w-full max-w-4xl flex flex-col items-center">
        
        {/* Título e Texto (Algo grande está para começar...) */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-tight">
          Something big is coming.
        </h1>
        <p className="text-zinc-400 text-base max-w-lg mb-16 leading-relaxed">
          Be the first to know when we launch. Sign up for our waitlist and join the movement.
        </p>

        {/* Temporizador Minimalista (como na imagem) */}
        <div className="flex gap-x-12 mb-20 text-center justify-center">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold tracking-tight text-white">{timeLeft.days}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-500 mt-2">DAYS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold tracking-tight text-white">{timeLeft.hours}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-500 mt-2">HOURS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold tracking-tight text-white">{timeLeft.minutes}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-500 mt-2">MIN</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold tracking-tight text-white">{timeLeft.seconds}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-500 mt-2">SEC</span>
          </div>
        </div>

        {/* Formulário de Login (como na imagem) */}
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/60 p-1 rounded-2xl shadow-xl">
          <form onSubmit={handleLogin} className="flex flex-col p-6 gap-3">
            <input 
              type="text" 
              placeholder="Your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              required
            />
            <input 
              type="password" 
              placeholder="Your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              required
            />
            
            <button 
              type="submit" 
              className="w-full mt-2 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-lg transition-colors active:scale-[0.99]"
            >
              Enter Gallery
            </button>
          </form>
          
          {/* Texto Inferior (Join 3 others) */}
          <div className="p-4 border-t border-zinc-800/60 text-center text-xs text-zinc-500">
            👥 Join 3 others
          </div>
        </div>

      </div>

    </main>
  );
}