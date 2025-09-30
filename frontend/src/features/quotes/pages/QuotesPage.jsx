import { useGetQuotesQuery, useCreateQuoteMutation } from '../quoteApi';
import { useState } from 'react';

export default function QuotesPage() {
  const { data = [], isLoading, isError } = useGetQuotesQuery();
  const [createQuote, { isLoading: saving }] = useCreateQuoteMutation();
  const [title, setTitle] = useState('');

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createQuote({ title }).unwrap();
      setTitle('');
    } catch (e) {
      // sin backend aún, puede fallar: lo mostramos amable
      alert('API no disponible todavía. (Levanta el backend)');
    }
  };

  if (isError) return <p className="text-red-600">API no disponible (levanta el backend).</p>;

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la cotización"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" disabled={saving}>
          {saving ? 'Guardando…' : 'Agregar'}
        </button>
      </form>

      {isLoading ? (
        <p>Cargando…</p>
      ) : (
        <ul className="bg-white border rounded divide-y">
          {data.map((q) => (
            <li key={q.id} className="p-3">{q.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
