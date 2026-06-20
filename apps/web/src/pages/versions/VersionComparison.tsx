import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VersionComparison() {
  const { oldVersionId, newVersionId } = useParams<{ oldVersionId: string, newVersionId: string }>();
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <header className="flex items-center justify-between h-16 px-8 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-secondary hover:bg-surface-container p-2 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-primary">Version Comparison</h1>
        </div>
      </header>
      <main className="flex-1 p-8">
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">difference</span>
          <h2 className="font-headline-sm">Comparison Engine</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            Comparing <span className="font-mono font-bold">{oldVersionId}</span> with <span className="font-mono font-bold">{newVersionId}</span>.
            In a complete implementation, this view recursively compares the snapshot JSONs of the two versions to highlight differences in components, materials, and quantities.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#006a63]"></span> <span className="text-xs font-bold uppercase">Added</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error"></span> <span className="text-xs font-bold uppercase">Removed</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7f4025]"></span> <span className="text-xs font-bold uppercase">Modified</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}
