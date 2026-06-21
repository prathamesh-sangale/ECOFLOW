import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { ApproverDashboard as IApproverDashboard } from '@ecoflow/shared-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ApproverDashboard() {
  const [data, setData] = useState<IApproverDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('this_month');

  useEffect(() => {
    fetchDashboard(timeframe);
  }, [timeframe]);

  const fetchDashboard = async (tf: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/approver?timeframe=${tf}`);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch approver dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-secondary">Loading Dashboard...</div>;

  return (
    <div className="space-y-xl">
      {/* Dashboard Header & KPI Cards */}
      <section>
        <div className="flex items-end justify-between mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Approvals Dashboard</h2>
            <p className="text-body-lg text-secondary">Review and manage pending Engineering Change Orders for the selected cycle.</p>
          </div>
          <div className="flex gap-sm">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md bg-surface hover:bg-surface-container-low transition-colors outline-none cursor-pointer"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
        </div>

        {/* Bento Grid KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Pending Approvals */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col justify-between group hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-label-md font-label-md text-secondary uppercase tracking-wider">Pending Approvals</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{data.pendingReviews}</h3>
              <p className="text-body-sm text-primary flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                Action Required
              </p>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col justify-between group hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-surface-tint/10 rounded-lg text-surface-tint">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-label-md font-label-md text-secondary uppercase tracking-wider">Approved Requests</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{data.approvalsThisMonth}</h3>
              <p className="text-body-sm text-on-secondary-container flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Avg Time: {data.averageReviewTimeHours} hrs
              </p>
            </div>
          </div>

          {/* Rejected Requests */}
          <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col justify-between group hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-error/10 rounded-lg text-error">
                <span className="material-symbols-outlined">cancel</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-label-md font-label-md text-secondary uppercase tracking-wider">Rejected Requests</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{data.rejectionsThisMonth}</h3>
              <p className="text-body-sm text-error flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Needs documentation review
              </p>
            </div>
          </div>

          {/* High Priority Changes */}
          <div className="bg-primary-container/10 border-primary/20 border p-lg rounded-xl flex flex-col justify-between group hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary rounded-lg text-on-primary">
                <span className="material-symbols-outlined">priority_high</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-label-md font-label-md text-primary uppercase tracking-wider">High Priority</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">{data.highPriorityRequests}</h3>
              <p className="text-body-sm text-primary flex items-center gap-1 mt-2 font-semibold">
                Urgent Review Required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-gutter items-start">
        {/* Approval Queue Table (Col 8) */}
        <section className="col-span-12 lg:col-span-8 space-y-lg">
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
              <h4 className="font-title-lg text-title-lg text-on-surface">Approval Queue</h4>
              <div className="flex items-center gap-sm">
                <span className="text-body-sm text-secondary">Showing {data.approvalQueue.length} of {data.pendingReviews} pending</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase">ECO ID</th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase">Description</th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase">Priority</th>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.approvalQueue.map((eco) => (
                    <tr key={eco.id} className={`hover:bg-surface-container-lowest transition-colors border-l-4 ${eco.priority === 'Critical' ? 'border-error' : eco.priority === 'High' ? 'border-orange-500' : 'border-surface-tint'}`}>
                      <td className="px-lg py-4">
                        <Link to={`/approvals/review/${eco.id}`} className="font-label-md text-label-md text-primary hover:underline">{eco.eco_number}</Link>
                        <p className="text-body-sm text-secondary">{(eco as any).submitter?.full_name}</p>
                      </td>
                      <td className="px-lg py-4 max-w-xs">
                        <p className="text-body-md text-on-surface truncate">{eco.title}</p>
                      </td>
                      <td className="px-lg py-4">
                        <span className={`${eco.priority === 'Critical' ? 'bg-error/15 text-error' : eco.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant'} text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>
                          {eco.priority}
                        </span>
                      </td>
                      <td className="px-lg py-4">
                        <div className="flex gap-2">
                          <Link to={`/approvals/review/${eco.id}`} className="w-8 h-8 rounded-lg bg-surface-tint text-on-primary flex items-center justify-center hover:opacity-90 shadow-sm transition-all" title="Review">
                            <span className="material-symbols-outlined text-[18px]">rate_review</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.approvalQueue.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-lg py-8 text-center text-outline">No pending approvals.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar Widgets (Col 4) */}
        <aside className="col-span-12 lg:col-span-4 space-y-lg">
          {/* Recent Activity Timeline */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <h4 className="font-title-lg text-title-lg text-on-surface mb-lg">Recent Review Activity</h4>
            <div className="space-y-lg relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {data.recentReviews.map((review) => (
                <div key={review.id} className="relative pl-lg">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${review.decision === 'Approved' ? 'bg-primary' : review.decision === 'Rejected' ? 'bg-error' : 'bg-outline'}`}>
                    <span className="material-symbols-outlined text-[14px] text-on-primary">
                      {review.decision === 'Approved' ? 'check' : review.decision === 'Rejected' ? 'close' : 'history'}
                    </span>
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">{(review.eco as any)?.eco_number} {review.decision}</p>
                    <p className="text-body-sm text-secondary truncate">{(review.eco as any)?.title}</p>
                    <p className="text-[10px] text-outline font-bold uppercase mt-1">{format(new Date(review.reviewed_at!), 'MMM d, yyyy HH:mm')}</p>
                  </div>
                </div>
              ))}
              {data.recentReviews.length === 0 && (
                <div className="text-center py-4 text-outline text-sm">No recent reviews.</div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
