// frontend/src/App.tsx
import { Calculator } from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-accent-buy">ownvsrent.io</h1>
          <p className="text-gray-400 mt-1">
            The rent vs. buy calculator that doesn't lie to you.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Calculator />
      </main>

      <footer className="border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>All calculations run locally. No data is stored.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
