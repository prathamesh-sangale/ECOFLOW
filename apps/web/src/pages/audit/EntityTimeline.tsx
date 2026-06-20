import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { AuditLog } from '@ecoflow/shared-types';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

export default function EntityTimeline({ entityType, entityId }: { entityType: string, entityId: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [entityType, entityId]);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/audit', { params: { entity_type: entityType } });
      const entityLogs = data.filter((log: AuditLog) => log.entity_id === entityId);
      setLogs(entityLogs);
    } catch (error) {
      console.error('Failed to fetch timeline logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-slate-500">Loading timeline...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
        <Activity className="w-5 h-5 text-indigo-500" />
        Activity Timeline
      </h3>
      <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 py-4">
        {logs.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm" />
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-800">{log.action}</span>
                <span className="text-xs text-slate-400 font-medium">{format(new Date(log.performed_at), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <p className="text-sm text-slate-500">Performed by: <span className="font-medium text-slate-700">{log.user?.full_name || 'System'}</span></p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="pl-6 text-sm text-slate-400">No activity recorded for this entity.</div>
        )}
      </div>
    </div>
  );
}
