import React, { useState } from 'react';
import type { AuditLog } from '@ecoflow/shared-types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditTable({ logs }: { logs: AuditLog[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'STATUS_CHANGED': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
            <th className="p-4 w-12"></th>
            <th className="p-4">Timestamp</th>
            <th className="p-4">User</th>
            <th className="p-4">Action</th>
            <th className="p-4">Entity</th>
            <th className="p-4">Entity ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => (
            <React.Fragment key={log.id}>
              <tr 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <td className="p-4 text-slate-400">
                  {expandedId === log.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </td>
                <td className="p-4 text-slate-600 font-medium">
                  {format(new Date(log.performed_at), 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {(log.user?.full_name || 'Sys').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-slate-700 font-medium">{log.user?.full_name || 'System'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-700 font-medium">{log.entity_type}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{log.entity_id}</td>
              </tr>
              {expandedId === log.id && (
                <tr className="bg-slate-50/50">
                  <td colSpan={6} className="p-6 border-l-4 border-l-indigo-400">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Before</h4>
                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64 shadow-inner">
                          <pre className="text-xs text-rose-300 font-mono">
                            {log.old_value ? JSON.stringify(log.old_value, null, 2) : 'null'}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">After</h4>
                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64 shadow-inner">
                          <pre className="text-xs text-emerald-300 font-mono">
                            {log.new_value ? JSON.stringify(log.new_value, null, 2) : 'null'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                No audit events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
