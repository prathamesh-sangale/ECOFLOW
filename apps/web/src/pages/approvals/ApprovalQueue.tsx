import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { ECO } from '@ecoflow/shared-types';

export default function ApprovalQueue() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ecos, setEcos] = useState<ECO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and pagination state
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchQueue();
  }, [search, priority, page]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (priority) params.append('priority', priority);
      
      const res = await api.get(`/approvals?${params.toString()}`);
      setEcos(res.data.ecos);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
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
    <div className="flex flex-col h-full gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-on-surface flex items-center gap-3">Approval Queue</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Review and process submitted Engineering Change Orders.</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search ECOs..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <select 
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </header>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50 sticky top-0">
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
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant font-medium">You're all caught up! No pending approvals matching criteria.</td></tr>
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
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
          <span className="text-body-sm text-secondary">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1 || loading} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-1.5 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-50 text-sm font-bold"
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages || loading} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-1.5 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-50 text-sm font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
