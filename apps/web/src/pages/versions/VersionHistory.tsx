import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';

export default function VersionHistory() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [productId]);

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/versions/product/${productId}`);
      setVersions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="flex items-center justify-between h-16 px-8 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-secondary hover:bg-surface-container p-2 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-primary">Version History</h1>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        {loading ? (
          <div className="text-on-surface-variant">Loading versions...</div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Version</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Created Date</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Created By</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Related ECO</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {versions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-6 text-on-surface-variant">No versions generated yet.</td></tr>
                ) : (
                  versions.map((v: any, index: number) => (
                    <tr key={v.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#006a63]">{v.version_number}</td>
                      <td className="px-6 py-4 text-body-md">{new Date(v.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-body-md">{v.creator?.full_name}</td>
                      <td className="px-6 py-4 font-semibold">{v.eco?.eco_number || 'Initial'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${v.is_active ? 'bg-[#006a63]/20 text-[#006a63]' : 'bg-surface-container text-on-surface-variant'}`}>
                          {v.is_active ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* We could compare with the previous version if it exists */}
                        {index < versions.length - 1 && (
                          <button onClick={() => navigate(`/versions/compare/${versions[index+1].id}/${v.id}`)} className="text-primary font-bold hover:underline">
                            Compare Prev
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
