import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { ProductionDashboard as IProductionDashboard } from '@ecoflow/shared-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ProductionDashboard() {
  const [data, setData] = useState<IProductionDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/production');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch production dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-secondary">Loading Dashboard...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-xl">
      {/* Left Side: Main Stats & Table */}
      <div className="flex-1 flex flex-col gap-xl">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {/* KPI Card 1 */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-sm">
              <span className="text-on-surface-variant font-label-md text-label-md">Active Products</span>
              <span className="material-symbols-outlined text-primary text-xl">inventory</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{data.productsReleased}</h3>
            </div>
          </div>
          
          {/* KPI Card 2 */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-sm">
              <span className="text-on-surface-variant font-label-md text-label-md">Active Versions</span>
              <span className="material-symbols-outlined text-primary text-xl">vibration</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{data.activeVersions}</h3>
            </div>
          </div>

          {/* KPI Card 3 */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-sm">
              <span className="text-on-surface-variant font-label-md text-label-md">Version Changes</span>
              <span className="material-symbols-outlined text-primary text-xl">published_with_changes</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{data.versionChanges}</h3>
            </div>
          </div>

          {/* KPI Card 4: Urgent Alert */}
          <div className="bg-error-container border border-error/20 p-lg rounded-xl shadow-sm relative overflow-hidden animate-pulse">
            <div className="flex justify-between items-start mb-sm">
              <span className="text-on-error-container font-label-md text-label-md font-bold">Pending Releases</span>
              <span className="material-symbols-outlined text-error text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="font-headline-lg text-headline-lg text-on-error-container">{data.pendingReleases} <span className="text-label-md font-medium text-error">Pending</span></h3>
            </div>
          </div>
        </div>

        {/* Main Section: Current Production Versions */}
        <section className="bg-white/80 backdrop-blur-md border border-outline-variant rounded-xl shadow-sm flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-title-lg text-title-lg text-on-surface">Current Production Versions</h2>
            <div className="flex gap-sm">
              <button className="bg-secondary-container text-on-secondary-container px-md py-sm rounded-lg font-label-lg text-label-lg flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">filter_list</span> Filter
              </button>
              <button className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-lg text-label-lg flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">download</span> Export
              </button>
            </div>
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
                {data.activeProductVersions.map((version) => (
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
                {data.activeProductVersions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-lg py-8 text-center text-outline">No active versions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right Sidebar: Recent Releases Timeline */}
      <aside className="w-[340px] flex flex-col gap-xl">
        <section className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-lg">Recent Releases Timeline</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-lg relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-outline-variant"></div>
            
            {data.releaseTimeline.map((release) => (
              <div key={release.id} className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-surface">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </div>
                <div>
                  <div className="text-label-md font-bold text-on-surface">Version {(release.product_version as any)?.version_number}</div>
                  <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">Released by {(release as any).releaser?.full_name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded text-on-secondary-container uppercase font-bold tracking-tighter">Released</span>
                    <span className="text-[10px] text-on-surface-variant">{format(new Date(release.release_date!), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            ))}
            {data.releaseTimeline.length === 0 && (
              <div className="text-center py-4 text-outline text-sm">No recent releases.</div>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
