import './App.css'
import QuotesPage from './features/quotes/pages/QuotesPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="rounded-xl border bg-white p-8 shadow space-y-6">
        <h1 className="text-xl font-semibold">SGALT + Tailwind ✅</h1>
        <QuotesPage />
      </div>
    </div>
  );
}

