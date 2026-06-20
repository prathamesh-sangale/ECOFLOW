import React, { useState, useEffect, useRef } from 'react';
import { api } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (link: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(link);
  };

  return (
    <div className="relative flex-1 max-w-md" ref={ref}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
      <input 
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm" 
        placeholder="Search products, BOMs, ECOs..." 
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => { if (query.length > 0) setIsOpen(true); }}
      />
      
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No results found for "{query}"</div>
          ) : (
            <div className="py-2">
              {results.map((result, idx) => (
                <button 
                  key={`${result.type}-${result.id}-${idx}`}
                  onClick={() => handleSelect(result.link)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{result.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{result.subtitle}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    result.type === 'Product' ? 'bg-indigo-100 text-indigo-700' :
                    result.type === 'BOM' ? 'bg-emerald-100 text-emerald-700' :
                    result.type === 'ECO' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
