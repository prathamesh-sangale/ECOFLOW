import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { BOM } from '@ecoflow/shared-types';

export default function BomList() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/boms');
      setBoms(res.data.boms);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#006a63]/15 text-[#006a63]';
      case 'Draft': return 'bg-[#7f4025]/15 text-[#7f4025]';
      case 'Archived': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Sidebar Placeholder */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-sm gap-2 z-50">
        <div className="px-lg py-xl">
          <h1 className="font-bold text-headline-sm text-primary tracking-tight">ECOFlow</h1>
          <p className="text-label-md text-on-surface-variant opacity-70">Furniture Engineering</p>
        </div>
        <nav className="flex-1 px-sm space-y-1">
          <a className="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-low transition-colors" href="/products">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-body-md">Products</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 bg-secondary-container text-primary font-semibold border-l-4 border-primary" href="/boms">
            <span className="material-symbols-outlined">account_tree</span>
            <span className="font-body-md">BOMs</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant p-md">
          <button onClick={logout} className="flex items-center gap-3 w-full px-2 py-2 text-error hover:bg-error-container/20 rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1">
        <header className="flex items-center justify-between h-16 px-8 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-outline-variant/30 shadow-sm">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20" placeholder="Search Engineering Database..." type="text"/>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 shadow-sm transition-all" onClick={() => {/* Open Create Modal */}}>Create BOM</button>
        </header>

        <section className="px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-8">
            <div>
              <h2 className="font-headline-lg text-on-surface flex items-center gap-3">BOM Management</h2>
              <p className="text-body-md text-on-surface-variant mt-1">Manage Bills of Materials for your product catalog.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-md text-on-surface-variant font-medium uppercase tracking-tight">Total BOMs</span>
              </div>
              <div className="text-headline-lg font-bold text-on-surface">{total}</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
              <h3 className="font-title-lg text-on-surface">Live BOMs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider">BOM Code / Name</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider">Product</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider text-right">Components</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider text-right">Total Cost</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider">Status</th>
                    <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
                  ) : (
                    boms.map((bom: any) => (
                      <tr key={bom.id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer" onClick={() => navigate(`/boms/${bom.id}`)}>
                        <td className="px-6 py-4">
                          <p className="font-body-md font-semibold text-on-surface">{bom.bom_code}</p>
                          <p className="text-xs text-on-surface-variant">{bom.bom_name}</p>
                        </td>
                        <td className="px-6 py-4 text-body-md">{bom.product?.product_name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-body-md text-right font-mono">{bom.componentsCount}</td>
                        <td className="px-6 py-4 text-body-md text-right font-mono">${(bom.totalCost || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-body-md">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(bom.status)}`}>{bom.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 text-on-surface-variant hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/boms/${bom.id}`); }}>
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
