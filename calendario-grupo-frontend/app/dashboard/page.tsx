export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📸 Nosso Diário Visual</h1>
      <p>O espaço do nosso grupo para recordar todos os momentos.</p>
      
      {/* Aqui vai ficar o componente do calendário */}
      <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>🗓️ Calendário de Memórias</h2>
        <p>Selecione um dia para ver as fotos!</p>
      </div>
    </main>
  );
}