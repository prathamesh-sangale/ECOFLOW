import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { EngineerDashboard as IEngineerDashboard } from '@ecoflow/shared-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function EngineerDashboard() {
  const [data, setData] = useState<IEngineerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/engineer');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch engineer dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-secondary">Loading Dashboard...</div>;

  const totalEcos = data.draftEcos + data.pendingReviews + data.approvedEcos + data.rejectedEcos;
  const approvedPct = totalEcos === 0 ? 0 : (data.approvedEcos / totalEcos) * 100;
  const pendingPct = totalEcos === 0 ? 0 : (data.pendingReviews / totalEcos) * 100;
  const draftPct = totalEcos === 0 ? 0 : (data.draftEcos / totalEcos) * 100;
  const rejectedPct = totalEcos === 0 ? 0 : (data.rejectedEcos / totalEcos) * 100;

  const today = new Date();

  return (
    <div className="space-y-gutter">
      {/* Hero Title & Context */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Engineering Overview</h2>
          <p className="text-on-surface-variant mt-1">Real-time lifecycle management for furniture components.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white p-2 border border-outline-variant rounded-lg flex items-center gap-2 text-label-md">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <span>{format(today, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Layout: 70/30 Split */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Area (70%) */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-outline-variant card-hover transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container rounded-lg">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                </div>
              </div>
              <p className="text-label-sm text-outline uppercase tracking-wider">My Products</p>
              <h3 className="text-headline-lg font-bold mt-1">{data.totalProducts}</h3>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-outline-variant card-hover transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container rounded-lg">
                  <span className="material-symbols-outlined text-primary">account_tree</span>
                </div>
              </div>
              <p className="text-label-sm text-outline uppercase tracking-wider">My BOMs</p>
              <h3 className="text-headline-lg font-bold mt-1">{data.totalBoms}</h3>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-outline-variant card-hover transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-error-container rounded-lg">
                  <span className="material-symbols-outlined text-error">published_with_changes</span>
                </div>
              </div>
              <p className="text-label-sm text-outline uppercase tracking-wider">Pending Reviews</p>
              <h3 className="text-headline-lg font-bold mt-1">{data.pendingReviews}</h3>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-outline-variant card-hover transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary-container/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary-container">verified</span>
                </div>
              </div>
              <p className="text-label-sm text-outline uppercase tracking-wider">Approved ECOs</p>
              <h3 className="text-headline-lg font-bold mt-1">{data.approvedEcos}</h3>
            </div>
          </div>

          {/* Change Impact Overview & Donut */}
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 flex-1 border-r border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">donut_large</span>
                Change Impact Status
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f4f3" strokeWidth="3"></circle>
                    {/* Approved */}
                    <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="#005c55" strokeWidth="3" strokeDasharray={`${approvedPct} ${100 - approvedPct}`} strokeDashoffset="0"></circle>
                    {/* Pending */}
                    <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="#0f766e" strokeWidth="3" strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={`-${approvedPct}`}></circle>
                    {/* Draft */}
                    <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="#bdc9c6" strokeWidth="3" strokeDasharray={`${draftPct} ${100 - draftPct}`} strokeDashoffset={`-${approvedPct + pendingPct}`}></circle>
                    {/* Rejected */}
                    <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="#ba1a1a" strokeWidth="3" strokeDasharray={`${rejectedPct} ${100 - rejectedPct}`} strokeDashoffset={`-${approvedPct + pendingPct + draftPct}`}></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-lg font-bold">{totalEcos}</span>
                    <span className="text-label-sm text-outline">Total ECOs</span>
                  </div>
                </div>
                
                <div className="space-y-3 w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-body-md flex-1">Approved</span>
                    <span className="font-bold text-body-md">{data.approvedEcos}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                    <span className="text-body-md flex-1">Pending</span>
                    <span className="font-bold text-body-md">{data.pendingReviews}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                    <span className="text-body-md flex-1">Draft</span>
                    <span className="font-bold text-body-md">{data.draftEcos}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-error"></span>
                    <span className="text-body-md flex-1">Rejected</span>
                    <span className="font-bold text-body-md">{data.rejectedEcos}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 p-8 bg-surface-container-low flex flex-col justify-center">
              <h4 className="font-bold text-label-md mb-2">Performance Insight</h4>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                You currently have <span className="text-primary font-bold">{data.draftEcos}</span> drafts. Complete your draft ECOs to push them into review.
              </p>
              <Link to="/reports" className="mt-6 text-primary font-bold text-label-md flex items-center gap-2 hover:translate-x-1 transition-transform inline-block">
                View Full Report <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Recent Products Table */}
          <div className="bg-white rounded-xl border border-outline-variant">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm">Recent Products</h3>
              <div className="flex gap-2">
                <Link to="/products" className="px-3 py-1.5 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container-low transition-colors">View All</Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-outline text-label-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-body-md">
                  {data.recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{p.product_code}</td>
                      <td className="px-6 py-4">{p.product_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.status === 'Released' ? 'bg-primary-container/10 text-primary-container' : 
                          p.status === 'In Review' ? 'bg-secondary-container text-primary' : 
                          'bg-surface-container-high text-outline'
                        }`}>
                          {p.status?.toUpperCase() || 'DRAFT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.recentProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-outline">No recent products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Area (30%) */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* Visual Weight Image Card */}
          <div className="relative h-64 rounded-xl overflow-hidden border border-outline-variant group shadow-lg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW4UV0-8QO0sG8xHFed-q-4wsoB4T8Pw6EUlvsCTOkj5GRRQigSGAEKNFZ4PmNBlqMQ7ShWNtlBB9HC3h4J93WQgJzhouIsgyUWeO6WoN6c9V7v8yebyQ_dpOs6EppfibXAheLHUePdTVo6-TMhCXDkz7bCOpMLVpP6UYimX4U4nx8m4eiQ5oMGcKDrZw-RZ0u2ieJ3VPpUCAhoGlL02aUCg87pWQlA_PaHD961NsKfKFb96v-V-DjQOMlVlUuHddxqdswJizFIXgj" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Engineering" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="font-bold text-headline-sm">Engineering Workshop</h4>
              <p className="text-label-sm opacity-90">Phase 2: Material Testing Lab</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h3 className="font-headline-sm text-headline-sm mb-6">Recent ECO Activity</h3>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
              {data.recentActivities.map((a, idx) => (
                <div key={a.id} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                    idx === 0 ? 'bg-secondary-container' : idx === 1 ? 'bg-primary-container/10' : 'bg-surface-container-high'
                  }`}>
                    <span className={`material-symbols-outlined text-[14px] ${
                      idx === 0 ? 'text-primary' : idx === 1 ? 'text-primary-container' : 'text-outline'
                    }`}>
                      {a.action === 'CREATE' ? 'add' : a.action === 'UPDATE' ? 'edit' : a.action === 'STATUS_CHANGE' ? 'published_with_changes' : 'history'}
                    </span>
                  </div>
                  <p className="text-label-md font-bold text-on-surface">{a.action} Activity</p>
                  <p className="text-body-md text-on-surface-variant truncate">
                    {(a.eco as any)?.eco_number || 'Unknown ECO'}
                  </p>
                  <p className="text-[11px] text-outline mt-1">{format(new Date(a.created_at!), 'MMM d, HH:mm')}</p>
                </div>
              ))}
              {data.recentActivities.length === 0 && (
                <div className="text-center py-4 text-outline text-sm">No activity recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
