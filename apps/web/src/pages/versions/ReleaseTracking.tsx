import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { VersionRelease } from '@ecoflow/shared-types';

export default function ReleaseTracking() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [releases, setReleases] = useState<VersionRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const res = await api.get('/versions/releases');
      setReleases(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline-lg text-on-surface flex items-center gap-3">Production Release Tracking</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Monitor the latest released Product and BOM versions for manufacturing.</p>
        </div>
      </header>

        {loading ? (
          <div className="text-on-surface-variant">Loading releases...</div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
              <h3 className="font-title-lg text-on-surface">Release History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Release Date</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Product</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Product Version</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">BOM Version</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Released By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {releases.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-6 text-on-surface-variant">No releases found.</td></tr>
                  ) : (
                    releases.map((release: any) => (
                      <tr key={release.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-on-surface-variant">{new Date(release.release_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-body-md font-bold">{release.product_version?.product?.product_name}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#006a63]">{release.product_version?.version_number}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#006a63]">{release.bom_version?.version_number}</td>
                        <td className="px-6 py-4 text-body-md">{release.releaser?.full_name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
