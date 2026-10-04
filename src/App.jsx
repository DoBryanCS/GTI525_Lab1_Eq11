

function App() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-fit border">

        <header className="flex h-40">
          <div className="flex w-64 items-center justify-center border-r">
            <p className="text-2xl font-bold">Logo</p>
          </div>

          <div className="flex w-[1100px] items-center justify-center">
            <h1 className="text-3xl font-bold">
              Données météorologiques canadiennes
            </h1>
          </div>
        </header>

        <main className="flex border-t">

          <aside className="w-64 overflow-y-auto border-r p-4">
            <p>Menu des stations</p>
          </aside>

          <section className="min-h-[600px] w-[1100px] overflow-auto p-4">
            <p>Contenu principal</p>
          </section>

        </main>

        <footer className="border-t py-8 text-center">
          <p className="font-bold">Équipe 11</p>
          <p>Nom 1 — courriel</p>
          <p>Nom 2 — courriel</p>
        </footer>

      </div>
    </div>
  );
}

export default App;