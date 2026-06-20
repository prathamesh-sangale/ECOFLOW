import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { ECO } from '@ecoflow/shared-types';

export default function ApprovalQueue() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ecos, setEcos] = useState<ECO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/approvals'); // Returns Submitted / Under Review by default
      setEcos(res.data.ecos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-error font-bold';
      case 'High': return 'text-[#7f4025] font-semibold';
      case 'Medium': return 'text-[#0f766e]';
      case 'Low': return 'text-secondary';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Sidebar Placeholder */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-sm gap-2 z-50">
        <div className="px-lg py-xl">
          <h1 className="font-bold text-headline-sm text-primary tracking-tight">ECOFlow</h1>
          <p className="text-label-md text-on-surface-variant opacity-70">Review & Approve</p>
        </div>
        <nav className="flex-1 px-sm space-y-1">
          <a className="flex items-center gap-3 px-4 py-2 text-secondary hover:bg-surface-container-low transition-colors" href="/approvals/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 bg-secondary-container text-primary font-semibold border-l-4 border-primary" href="/approvals/queue">
            <span className="material-symbols-outlined">rule_folder</span>
            <span className="font-body-md">Approval Queue</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant p-md">
          <button onClick={logout} className="flex items-center gap-3 w-full px-2 py-2 text-error hover:bg-error-container/20 rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-on-surface flex items-center gap-3">Approval Queue</h2>
            <p className="text-body-md text-on-surface-variant mt-1">Review and process submitted Engineering Change Orders.</p>
          </div>
        </header>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">ECO Number / Title</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Product</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Priority</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Submitted By</th>
                  <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8">Loading queue...</td></tr>
                ) : ecos.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant font-medium">You're all caught up! No pending approvals.</td></tr>
                ) : (
                  ecos.map((eco: any) => (
                    <tr key={eco.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-body-md font-bold text-on-surface">{eco.eco_number}</p>
                        <p className="text-xs text-on-surface-variant">{eco.title}</p>
                      </td>
                      <td className="px-6 py-4 text-body-md">{eco.product?.product_name}</td>
                      <td className="px-6 py-4"><span className={getPriorityColor(eco.priority as string)}>{eco.priority}</span></td>
                      <td className="px-6 py-4 text-body-md text-on-surface-variant">{eco.submitter?.full_name}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => navigate(`/approvals/review/${eco.id}`)} className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-sm hover:opacity-90">Review</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
