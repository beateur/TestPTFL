export default function UnresolvedTenant() {
  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '56ch' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Site indisponible</h1>
        <p style={{ lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)' }}>
          Nous ne parvenons pas à résoudre ce domaine vers un portfolio actif. Vérifiez la configuration DNS ou contactez le
          support.
        </p>
      </div>
    </main>
  );
}
