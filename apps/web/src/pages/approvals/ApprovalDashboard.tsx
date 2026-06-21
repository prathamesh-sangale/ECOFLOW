import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';

export default function ApprovalDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ pending: 0, approvedThisMonth: 0, rejected: 0, highPriority: 0 });
  const [recentApprovals, setRecentApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, queueRes] = await Promise.all([
        api.get('/approvals/metrics'),
        api.get('/approvals?limit=5&status=Under Review')
      ]);
      setMetrics(metricsRes.data);
      setRecentApprovals(queueRes.data.ecos);
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
          <h2 className="font-headline-lg text-on-surface flex items-center gap-3">Approver Dashboard</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Overview of ECOs awaiting your review.</p>
        </div>
        <button onClick={() => navigate('/approvals/queue')} className="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity">
          View All Pending
        </button>
      </header>

        {loading ? (
          <div className="text-on-surface-variant">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm border-l-4 border-l-[#7f4025]">
                <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Pending Approvals</h3>
                <p className="text-headline-lg font-bold text-[#7f4025]">{metrics.pending}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm border-l-4 border-l-[#ba1a1a]">
                <h3 className="text-label-md text-on-surface-variant uppercase mb-2">High Priority</h3>
                <p className="text-headline-lg font-bold text-[#ba1a1a]">{metrics.highPriority}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm border-l-4 border-l-[#006a63]">
                <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Approved This Month</h3>
                <p className="text-headline-lg font-bold text-[#006a63]">{metrics.approvedThisMonth}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm border-l-4 border-l-error">
                <h3 className="text-label-md text-on-surface-variant uppercase mb-2">Rejected</h3>
                <p className="text-headline-lg font-bold text-error">{metrics.rejected}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
                <h3 className="font-title-lg text-on-surface">Recent Submissions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low/50">
                    <tr>
                      <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">ECO Number</th>
                      <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Title</th>
                      <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant">Priority</th>
                      <th className="px-6 py-4 text-label-md font-bold uppercase text-on-surface-variant text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {recentApprovals.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-6 text-on-surface-variant">No pending ECOs.</td></tr>
                    ) : (
                      recentApprovals.map((eco: any) => (
                        <tr key={eco.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-6 py-4 font-semibold">{eco.eco_number}</td>
                          <td className="px-6 py-4 text-body-md">{eco.title}</td>
                          <td className="px-6 py-4 font-bold text-[#ba1a1a]">{eco.priority}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => navigate(`/approvals/review/${eco.id}`)} className="text-primary font-bold hover:underline">Review →</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
