import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { BOM } from '@ecoflow/shared-types';
import BomForm from './BomForm';

export default function BomList() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);

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
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-xl">
        <h2 className="font-headline-lg text-on-surface">BOM Management</h2>
        <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 shadow-sm transition-all" onClick={() => setShowForm(true)}>Create BOM</button>
      </header>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-8">
        <div>
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
      {showForm && (
        <BomForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => { setShowForm(false); fetchData(); }} 
        />
      )}
    </div>
  );
}
