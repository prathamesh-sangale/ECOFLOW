import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-600 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          <span className="material-symbols-outlined text-[20px]">home</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
