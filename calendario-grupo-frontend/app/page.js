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

    // Lógica do Cronómetro até ao dia 30 de Outubro
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

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'amigos123') {
            router.push('/dashboard');
        } else {
            alert('Wrong password!');
        }
    };

    // Lista de imagens para a colagem estilo Polaroid
    // Lista com as tuas imagens do ImBB para a colagem estilo Polaroid
    const polaroids = [
        { src: "https://i.ibb.co/R4Nb96yy/c4bcc0c2-4522-4c4f-90bf-74178035aff2.jpg", style: "top-[-2%] left-[-2%] -rotate-12 w-44 md:w-56" },
        { src: "https://i.ibb.co/XvmGP3y/8d1e80fa-791c-4ad3-924d-2b1f6d2f1a67.jpg", style: "top-[15%] left-[8%] rotate-6 w-40 md:w-52" },
        { src: "https://i.ibb.co/chH6jyz2/af5bd82e-aaf4-400a-8052-34fbd23aa082.jpg", style: "bottom-[20%] left-[-3%] -rotate-6 w-48 md:w-60" },
        { src: "https://i.ibb.co/rfmfJq5P/6ae30f45-dd06-4f22-9ba2-a4b8a3b566b7.jpg", style: "bottom-[-4%] left-[10%] rotate-12 w-44 md:w-56" },
        { src: "https://i.ibb.co/tpfTxbt5/9c9028b1-bade-4a8d-a01b-92cc88cb0b61.jpg", style: "top-[-5%] right-[2%] rotate-12 w-44 md:w-56" },
        { src: "https://i.ibb.co/tpTwDY67/c32bbd75-15ad-4f26-bb75-64c94d64f187.jpg", style: "top-[20%] right-[10%] -rotate-12 w-40 md:w-52" },
        { src: "https://i.ibb.co/5dby6p3/e9b42225-4123-435d-acaf-7ac342fe8f43.jpg", style: "bottom-[25%] right-[-2%] rotate-6 w-48 md:w-60" },
        { src: "https://i.ibb.co/wZsz7c9b/a82ce58f-3748-4c07-823d-af3936643d88.jpg", style: "bottom-[-2%] right-[12%] -rotate-12 w-44 md:w-56" },
    ];

    return (
        <main className="relative min-h-screen bg-black text-white font-sans antialiased overflow-hidden flex flex-col items-center justify-center px-6 py-20">

            {/* 1. BARRA SUPERIOR (NAVBAR) */}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 flex items-center justify-between px-6 py-3 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl">
                <div className="font-semibold text-lg tracking-tight text-white">
                    DayByPic
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-colors">
                        Sign in
                    </button>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.6-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* 2. FOTOS ESPALHADAS ESTILO POLAROID */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {polaroids.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute p-2.5 pb-7 bg-white shadow-2xl rounded-sm transition-transform duration-300 hover:scale-105 pointer-events-auto ${item.style}`}
                    >
                        <div className="overflow-hidden bg-zinc-100 aspect-square">
                            <img
                                src={item.src}
                                alt="Memory"
                                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. CONTEÚDO CENTRAL */}
            <div className="relative z-10 text-center w-full max-w-4xl flex flex-col items-center mt-12">

                {/* Distintivo de Acesso Antecipado */}
                <button className="mb-6 text-xs text-zinc-400 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full hover:text-white transition-colors">
                    Get early access
                </button>

                {/* Título Principal */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-none text-white drop-shadow-md">
                    Something big is coming.
                </h1>
                <p className="text-zinc-400 text-sm md:text-base max-w-md mb-12 leading-relaxed">
                    Be the first to know when we launch. Sign up for our waitlist and join the movement.
                </p>

                {/* Temporizador Minimalista */}
                <div className="flex gap-x-8 md:gap-x-12 mb-12 text-center justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{timeLeft.days}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2">DAYS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{timeLeft.hours}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2">HOURS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{timeLeft.minutes}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2">MIN</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{timeLeft.seconds}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mt-2">SEC</span>
                    </div>
                </div>

                {/* Caixas de Texto e Botão de Registo */}
                <div className="w-full max-w-sm bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 p-6 rounded-3xl shadow-2xl">
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="you@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                            required
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full mt-2 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-xl transition-all active:scale-[0.99]"
                        >
                            Register to galery
                        </button>
                    </form>

                </div>

            </div>

        </main>
    );
}