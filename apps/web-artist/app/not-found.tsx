export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '60ch' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Page introuvable</h1>
        <p style={{ lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)' }}>
          Nous n’avons pas trouvé cette page. Vérifiez l’URL ou retournez à l’accueil de l’artiste.
        </p>
      </div>
    </main>
  );
}
