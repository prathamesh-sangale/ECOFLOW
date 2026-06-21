import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { BOM, BOMComponent, CostSummary } from '@ecoflow/shared-types';
import ComponentForm from './ComponentForm';

export default function BomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bom, setBom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showComponentForm, setShowComponentForm] = useState(false);

  useEffect(() => {
    fetchBom();
  }, [id]);

  const fetchBom = async () => {
    try {
      const res = await api.get(`/boms/${id}`);
      setBom(res.data);
    } catch (e) {
      console.error(e);
      navigate('/boms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-on-surface">Loading...</div>;
  if (!bom) return null;

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="flex items-center gap-4 h-16 px-8 bg-surface border-b border-outline-variant">
        <button onClick={() => navigate('/boms')} className="text-secondary hover:bg-surface-container p-2 rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-primary">BOM Details</h1>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Overview Header */}
        <section>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="font-headline-lg">{bom.bom_name}</h2>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container/20 text-primary">{bom.status}</span>
          </div>
          <p className="text-on-surface-variant font-mono">Code: {bom.bom_code} | Product: {bom.product?.product_name}</p>
          <p className="mt-2 text-body-md text-on-surface-variant">{bom.description}</p>
        </section>

        {/* Cost Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Total Material Cost</h3>
            <p className="text-headline-lg font-bold font-mono text-primary">${bom.costSummary.totalMaterialCost.toFixed(2)}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Total Components</h3>
            <p className="text-headline-lg font-bold">{bom.costSummary.totalComponents}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Avg Component Cost</h3>
            <p className="text-headline-lg font-bold font-mono text-secondary">${bom.costSummary.averageComponentCost.toFixed(2)}</p>
          </div>
        </section>

        {/* Components Table */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
            <h3 className="font-title-lg">Engineering Components List</h3>
            <button 
              onClick={() => setShowComponentForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Component
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase">Component</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase">Material</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase text-right">Qty</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase">Unit</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase text-right">Unit Cost</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant uppercase text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {bom.components.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">No components added yet.</td></tr>
                ) : (
                  bom.components.map((comp: BOMComponent) => (
                    <tr key={comp.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 font-semibold">{comp.component_name}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{comp.material_type}</td>
                      <td className="px-6 py-4 text-right font-mono">{comp.quantity}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{comp.unit}</td>
                      <td className="px-6 py-4 text-right font-mono">${comp.unit_cost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold font-mono">${comp.total_cost.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Activity Timeline */}
        <section>
          <h3 className="font-title-lg mb-4">Revision Timeline</h3>
          <div className="space-y-4 relative pl-8 border-l-2 border-outline-variant/30 ml-4">
            {bom.activities?.map((act: any) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-surface-container-high border-[3px] border-background" />
                <div className="bg-surface-container p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <p className="font-bold text-on-surface">{act.action}</p>
                    <span className="text-xs text-on-surface-variant">{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{act.metadata} by {act.user?.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showComponentForm && (
        <ComponentForm
          bomId={bom.id}
          onClose={() => setShowComponentForm(false)}
          onSuccess={() => { setShowComponentForm(false); fetchBom(); }}
        />
      )}
    </div>
  );
}
