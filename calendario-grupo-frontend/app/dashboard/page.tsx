'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Photo = {
  id: number;
  date: string;
  user: string;
  caption: string;
  url: string;
  uploadedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getToday() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [date, setDate] = useState('');
  const [user, setUser] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/photos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar as fotografias.');
        }
        return response.json() as Promise<Photo[]>;
      })
      .then((loadedPhotos) => {
        if (active) {
          setPhotos(loadedPhotos);
          setDate(getToday());
        }
      })
      .catch(() => {
        if (active) {
          setError('Não foi possível ligar ao servidor. Confirma que o backend está iniciado.');
        }
      })
      .finally(() => setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError('Seleciona uma fotografia.');
      return;
    }

    setUploading(true);
    setError('');
    setNotice('');
    const formData = new FormData();
    formData.set('date', date);
    formData.set('user', user);
    formData.set('caption', caption);
    formData.set('photo', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ?? body?.message ?? 'Não foi possível guardar a fotografia.');
      }

      const createdPhoto = (await response.json()) as Photo;
      setPhotos((currentPhotos) => [createdPhoto, ...currentPhotos].sort(
        (first, second) =>
          second.date.localeCompare(first.date)
          || second.uploadedAt.localeCompare(first.uploadedAt),
      ));
      setCaption('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setDate(getToday());
      setNotice('Fotografia guardada.');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Ocorreu um erro ao enviar a fotografia.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-2 text-sm text-indigo-300">Diário do grupo</p>
          <h1 className="text-3xl font-bold tracking-tight">Calendário de memórias</h1>
          <p className="mt-2 text-zinc-400">Partilha uma fotografia e guarda o momento.</p>
        </header>

        <section className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="mb-5 text-xl font-semibold">Adicionar fotografia</h2>
          <form onSubmit={handleUpload} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-zinc-300">
              Data
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Quem partilha?
              <input
                value={user}
                onChange={(event) => setUser(event.target.value)}
                maxLength={80}
                required
                placeholder="O teu nome"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300 sm:col-span-2">
              Legenda
              <input
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                maxLength={500}
                placeholder="Uma pequena descrição (opcional)"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300 sm:col-span-2">
              Fotografia (JPEG, PNG ou GIF; máximo 10 MB)
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                ref={fileInputRef}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                required
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-white"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={uploading || !date}
                className="rounded-lg bg-indigo-400 px-5 py-2.5 font-semibold text-zinc-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? 'A enviar…' : 'Guardar memória'}
              </button>
            </div>
          </form>
          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          {notice && <p role="status" className="mt-4 text-sm text-emerald-300">{notice}</p>}
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">Memórias partilhadas</h2>
          {loading ? (
            <p className="text-zinc-400">A carregar fotografias…</p>
          ) : photos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
              Ainda não há fotografias. Adiciona a primeira memória!
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <article key={photo.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                  <Image
                    src={`${API_BASE_URL}${photo.url}`}
                    alt={photo.caption || `Fotografia partilhada por ${photo.user}`}
                    width={800}
                    height={800}
                    unoptimized
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium">{photo.caption || 'Sem legenda'}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {new Date(`${photo.date}T00:00:00`).toLocaleDateString('pt-PT')} · {photo.user}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
