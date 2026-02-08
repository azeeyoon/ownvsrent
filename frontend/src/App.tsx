// frontend/src/App.tsx
import { Calculator } from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">ownvsrent.io</h1>
          <p className="text-gray-500 mt-1 text-sm">
            The rent vs. buy calculator that doesn't lie to you.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Calculator />
      </main>

      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-400 text-sm">
          <p>All calculations run locally. No data is stored.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
