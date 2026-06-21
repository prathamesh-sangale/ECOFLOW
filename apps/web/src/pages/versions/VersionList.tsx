import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../store/AuthContext';

export default function VersionList() {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await api.get('/dashboard/production');
        setVersions(res.data.activeProductVersions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, []);

  return (
    <div className="flex flex-col h-full gap-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline-lg text-on-surface flex items-center gap-3">Active Versions</h2>
          <p className="text-body-md text-on-surface-variant mt-1">View the current active production versions of all products.</p>
        </div>
      </header>

      {loading ? (
        <div className="text-on-surface-variant">Loading versions...</div>
      ) : (
        <section className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
            <h2 className="font-title-lg text-title-lg text-on-surface">Current Production Versions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <tr>
                  <th className="px-lg py-4 font-medium">Product Line</th>
                  <th className="px-lg py-4 font-medium">Active Version</th>
                  <th className="px-lg py-4 font-medium">Status</th>
                  <th className="px-lg py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-md">
                {versions.map((version) => (
                  <tr key={version.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-lg py-4 flex items-center gap-md">
                      <div className="w-2 h-8 bg-primary rounded-full"></div>
                      <div>
                        <div className="font-bold text-on-surface">{(version.product as any)?.product_name}</div>
                        <div className="text-xs text-on-surface-variant">{(version.product as any)?.product_code}</div>
                      </div>
                    </td>
                    <td className="px-lg py-4 font-mono">v{version.version_number}</td>
                    <td className="px-lg py-4">
                      <span className="bg-primary/15 text-primary px-2 py-1 rounded-full text-[12px] font-bold">Production Ready</span>
                    </td>
                    <td className="px-lg py-4 text-right">
                      <Link to={`/versions/product/${version.product_id}`} className="text-primary p-2 hover:bg-primary/10 rounded-full transition-all inline-block">
                        <span className="material-symbols-outlined">visibility</span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {versions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-lg py-8 text-center text-outline">No active versions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
