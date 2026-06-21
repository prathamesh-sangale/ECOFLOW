import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { ECO, ECOChange } from '@ecoflow/shared-types';

export default function ApprovalReview() {
  const { id } = useParams<{ id: string }>(); // This is the ECO ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eco, setEco] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Request Changes' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchEco();
  }, [id]);

  const fetchEco = async () => {
    try {
      const res = await api.get(`/ecos/${id}`);
      setEco(res.data);
    } catch (e) {
      console.error(e);
      navigate('/approvals/queue');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (type: 'Approve' | 'Reject' | 'Request Changes') => {
    setActionType(type);
    setShowModal(true);
  };

  const submitAction = async () => {
    if ((actionType === 'Reject' || actionType === 'Request Changes') && !reviewNotes.trim()) {
      alert('Review notes are required for this action.');
      return;
    }
    
    try {
      if (actionType === 'Approve') {
        await api.post(`/approvals/${id}/approve`, { review_notes: reviewNotes });
      } else if (actionType === 'Reject') {
        await api.post(`/approvals/${id}/reject`, { review_notes: reviewNotes });
      } else if (actionType === 'Request Changes') {
        await api.post(`/approvals/${id}/request-changes`, { review_notes: reviewNotes });
      }
      setShowModal(false);
      navigate('/approvals/queue');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit action');
    }
  };

  if (loading) return <div className="p-8">Loading review...</div>;
  if (!eco) return null;

  const getImpactBadgeColor = (impact: string) => {
    if (impact === 'Cost') return 'bg-[#7f4025]/15 text-[#7f4025]';
    if (impact === 'Material') return 'bg-[#0f766e]/15 text-[#0f766e]';
    if (impact === 'Quality') return 'bg-[#006a63]/15 text-[#006a63]';
    return 'bg-secondary-container text-secondary';
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="flex items-center justify-between h-16 px-8 bg-surface border-b border-outline-variant sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/approvals/queue')} className="text-secondary hover:bg-surface-container p-2 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-primary">ECO Review</h1>
        </div>
        
        {/* Floating Action Bar */}
        {(eco.status === 'Submitted' || eco.status === 'Under Review' || eco.status === 'Pending') && (user?.role?.role_name === 'Approver' || user?.role?.role_name === 'Admin') && (
          <div className="flex gap-3">
            <button onClick={() => handleActionClick('Request Changes')} className="px-4 py-2 bg-surface-container text-on-surface font-bold rounded-lg border border-outline hover:bg-outline-variant">
              Request Changes
            </button>
            <button onClick={() => handleActionClick('Reject')} className="px-4 py-2 bg-error text-on-error font-bold rounded-lg hover:opacity-90">
              Reject
            </button>
            <button onClick={() => handleActionClick('Approve')} className="px-4 py-2 bg-[#006a63] text-white font-bold rounded-lg shadow-md hover:opacity-90">
              Approve ECO
            </button>
          </div>
        )}
      </header>

      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context & Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="font-title-lg mb-2">{eco.eco_number}</h2>
            <h3 className="font-headline-sm mb-4">{eco.title}</h3>
            
            <div className="space-y-3 text-body-md">
              <p><span className="font-bold text-on-surface-variant">Product:</span> {eco.product?.product_name}</p>
              <p><span className="font-bold text-on-surface-variant">Priority:</span> <span className="font-bold text-error">{eco.priority}</span></p>
              <p><span className="font-bold text-on-surface-variant">Submitted By:</span> {eco.submitter?.full_name}</p>
              <p><span className="font-bold text-on-surface-variant">Status:</span> {eco.status}</p>
            </div>

            <hr className="my-4 border-outline-variant" />
            
            <h4 className="font-bold text-on-surface-variant mb-1">Reason for Change</h4>
            <p className="text-body-md text-on-surface">{eco.reason || 'Not provided'}</p>
            
            <h4 className="font-bold text-on-surface-variant mt-4 mb-1">Description</h4>
            <p className="text-body-md text-on-surface">{eco.description || 'Not provided'}</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="font-title-lg mb-4">Activity Timeline</h3>
            <div className="space-y-4 pl-4 border-l-2 border-outline-variant/30">
              {eco.activities?.map((act: any) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-secondary" />
                  <div>
                    <p className="text-body-sm font-bold">{act.action}</p>
                    <p className="text-xs text-on-surface-variant">{new Date(act.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Changes & Comparisons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="font-title-lg mb-4">Side-by-Side Comparison</h3>
            
            {eco.changes?.length === 0 ? (
              <p className="text-on-surface-variant italic">No specific changes recorded.</p>
            ) : (
              <div className="space-y-4">
                {eco.changes?.map((change: ECOChange) => {
                  let changeStatus = 'Modified';
                  if (!change.old_value && change.new_value) changeStatus = 'Added';
                  if (change.old_value && !change.new_value) changeStatus = 'Removed';

                  return (
                    <div key={change.id} className="border border-outline-variant rounded-lg overflow-hidden">
                      <div className="bg-surface-container-low/50 px-4 py-3 border-b border-outline-variant flex justify-between items-center">
                        <span className="font-bold">{change.field_name}</span>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${getImpactBadgeColor(change.impact_type as string)}`}>
                            Impact: {change.impact_type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex divide-x divide-outline-variant">
                        {/* Old Value */}
                        <div className="flex-1 p-4 bg-error-container/10">
                          <p className="text-xs text-error font-bold mb-1 uppercase tracking-wider">Old Value</p>
                          <p className={`font-mono text-body-lg ${changeStatus === 'Removed' || changeStatus === 'Modified' ? 'text-error line-through' : 'text-on-surface-variant'}`}>
                            {change.old_value || '-'}
                          </p>
                        </div>
                        
                        {/* New Value */}
                        <div className="flex-1 p-4 bg-[#006a63]/10">
                          <p className="text-xs text-[#006a63] font-bold mb-1 uppercase tracking-wider">New Value</p>
                          <p className={`font-mono text-body-lg text-[#006a63] font-bold`}>
                            {change.new_value || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg max-w-lg w-full border border-outline-variant">
            <h3 className="font-headline-sm mb-4">
              {actionType === 'Approve' ? 'Approve ECO' : actionType === 'Reject' ? 'Reject ECO' : 'Request Changes'}
            </h3>
            <p className="text-body-md text-on-surface-variant mb-4">
              Please provide detailed notes regarding this decision. These notes will be visible to the submitter and recorded in the audit log.
            </p>
            <textarea
              className="w-full h-32 bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 mb-6"
              placeholder="Enter your review notes here..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-secondary hover:bg-surface-container rounded-lg">Cancel</button>
              <button 
                onClick={submitAction}
                className={`px-6 py-2 text-white font-bold rounded-lg shadow-sm hover:opacity-90 ${
                  actionType === 'Approve' ? 'bg-[#006a63]' : actionType === 'Reject' ? 'bg-error' : 'bg-[#7f4025]'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
