import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import type { ECO, ECOChange, ECOComment } from '@ecoflow/shared-types';

export default function EcoDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eco, setEco] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for Add Change form
  const [showAddChange, setShowAddChange] = useState(false);
  const [changeForm, setChangeForm] = useState({ change_type: '', field_name: '', old_value: '', new_value: '', impact_type: 'Cost' });
  
  // State for Comment
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchEco();
  }, [id]);

  const fetchEco = async () => {
    try {
      const res = await api.get(`/ecos/${id}`);
      setEco(res.data);
    } catch (e) {
      console.error(e);
      navigate('/ecos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEco = async () => {
    try {
      if (eco.changes.length === 0) {
        alert('You must add at least one ECO Change before submitting.');
        return;
      }
      await api.patch(`/ecos/${id}/status`, { status: 'Submitted' });
      fetchEco();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit ECO');
    }
  };

  const handleAddChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/ecos/${id}/changes`, changeForm);
      setChangeForm({ change_type: '', field_name: '', old_value: '', new_value: '', impact_type: 'Cost' });
      setShowAddChange(false);
      fetchEco();
    } catch (error) {
      alert('Failed to add change');
    }
  };

  const handleDeleteChange = async (changeId: string) => {
    try {
      await api.delete(`/ecos/changes/${changeId}`);
      fetchEco();
    } catch (error) {
      alert('Failed to delete change');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/ecos/${id}/comments`, { comment: commentText });
      setCommentText('');
      fetchEco();
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  if (loading) return <div className="p-8 text-on-surface">Loading...</div>;
  if (!eco) return null;

  const canEdit = (eco.status === 'Draft') && (user?.role_name === 'Engineer' || user?.role_name === 'Admin');

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="flex items-center justify-between h-16 px-8 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/ecos')} className="text-secondary hover:bg-surface-container p-2 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-primary">ECO Details</h1>
        </div>
        <div className="flex gap-4">
          {canEdit && (
            <>
              <button onClick={() => navigate(`/ecos/${id}/edit`)} className="px-4 py-2 border border-outline rounded-lg text-label-md font-semibold hover:bg-surface-container">
                Edit Draft
              </button>
              <button onClick={handleSubmitEco} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:opacity-90">
                Submit ECO
              </button>
            </>
          )}
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <section>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="font-headline-lg">{eco.title}</h2>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container/20 text-primary">{eco.status}</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-surface-container">{eco.priority}</span>
          </div>
          <p className="text-on-surface-variant font-mono">ECO: {eco.eco_number} | Product: {eco.product?.product_name}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description & Reason */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
              <h3 className="font-title-lg mb-4">Details</h3>
              <p className="text-body-md text-on-surface font-semibold">Description:</p>
              <p className="text-body-md text-on-surface-variant mb-4">{eco.description || 'N/A'}</p>
              
              <p className="text-body-md text-on-surface font-semibold">Reason for Change:</p>
              <p className="text-body-md text-on-surface-variant">{eco.reason || 'N/A'}</p>
            </div>

            {/* Proposed Changes */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
                <h3 className="font-title-lg">Proposed Changes</h3>
                {canEdit && !showAddChange && (
                  <button onClick={() => setShowAddChange(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add Change
                  </button>
                )}
              </div>

              {showAddChange && (
                <form onSubmit={handleAddChange} className="p-6 bg-surface-container-low/10 border-b border-outline-variant">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input required type="text" placeholder="Change Type (e.g. Quantity Change)" className="p-2 border rounded" value={changeForm.change_type} onChange={e => setChangeForm({...changeForm, change_type: e.target.value})} />
                    <input required type="text" placeholder="Field Name (e.g. Screws)" className="p-2 border rounded" value={changeForm.field_name} onChange={e => setChangeForm({...changeForm, field_name: e.target.value})} />
                    <input type="text" placeholder="Old Value" className="p-2 border rounded" value={changeForm.old_value} onChange={e => setChangeForm({...changeForm, old_value: e.target.value})} />
                    <input type="text" placeholder="New Value" className="p-2 border rounded" value={changeForm.new_value} onChange={e => setChangeForm({...changeForm, new_value: e.target.value})} />
                    <select required className="p-2 border rounded" value={changeForm.impact_type} onChange={e => setChangeForm({...changeForm, impact_type: e.target.value})}>
                      <option value="Cost">Cost</option>
                      <option value="Material">Material</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded">Save</button>
                    <button type="button" onClick={() => setShowAddChange(false)} className="px-4 py-2 bg-surface-container rounded">Cancel</button>
                  </div>
                </form>
              )}

              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    <th className="px-6 py-4 text-label-md text-on-surface-variant">Change Type</th>
                    <th className="px-6 py-4 text-label-md text-on-surface-variant">Field</th>
                    <th className="px-6 py-4 text-label-md text-on-surface-variant">Old</th>
                    <th className="px-6 py-4 text-label-md text-on-surface-variant">New</th>
                    <th className="px-6 py-4 text-label-md text-on-surface-variant">Impact</th>
                    {canEdit && <th className="px-6 py-4"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {eco.changes.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-6 text-error font-semibold">Mandatory: You must add at least one change record to submit this ECO.</td></tr>
                  ) : (
                    eco.changes.map((change: ECOChange) => (
                      <tr key={change.id}>
                        <td className="px-6 py-4">{change.change_type}</td>
                        <td className="px-6 py-4 font-semibold">{change.field_name}</td>
                        <td className="px-6 py-4 text-error line-through">{change.old_value || '-'}</td>
                        <td className="px-6 py-4 text-[#006a63] font-bold">{change.new_value || '-'}</td>
                        <td className="px-6 py-4">{change.impact_type}</td>
                        {canEdit && (
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteChange(change.id)} className="text-error">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Comments Thread */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
              <h3 className="font-title-lg mb-4">Discussion & Comments</h3>
              <div className="space-y-4 mb-6">
                {eco.comments.map((comment: ECOComment) => (
                  <div key={comment.id} className="bg-surface-container-low p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-primary">{comment.user?.full_name}</span>
                      <span className="text-xs text-on-surface-variant">{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-body-md text-on-surface">{comment.comment}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input required type="text" placeholder="Add a comment..." className="flex-1 p-3 border border-outline-variant rounded-lg" value={commentText} onChange={e => setCommentText(e.target.value)} />
                <button type="submit" className="px-6 bg-secondary text-on-secondary rounded-lg font-bold">Post</button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            {/* Activity Timeline */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
              <h3 className="font-title-lg mb-4">Activity</h3>
              <div className="space-y-4 relative pl-6 border-l-2 border-outline-variant/30 ml-3">
                {eco.activities?.map((act: any) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-secondary border-[3px] border-background" />
                    <div>
                      <p className="text-body-sm font-semibold">{act.action}</p>
                      <p className="text-xs text-on-surface-variant">{act.metadata}</p>
                      <p className="text-[10px] text-outline mt-1">{new Date(act.created_at).toLocaleString()} by {act.user?.full_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
