import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { AdminDashboard as IAdminDashboard } from '@ecoflow/shared-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState<IAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      if (localStorage.getItem('mockUser')) {
        setData({ totalUsers: 24, activeUsers: 21, totalProducts: 142, totalBoms: 456, totalEcos: 89, totalApprovals: 67, totalVersions: 320, totalAuditEvents: 1205, recentAuditEvents: [] });
      } else {
        const res = await api.get('/dashboard/admin');
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-secondary">Loading Dashboard...</div>;

  return (
    <div className="flex flex-col gap-xl">
      {/* Dashboard Overview Header */}
      <div className="flex flex-col gap-xs">
        <h2 className="font-headline-lg text-headline-lg text-primary">System Administration</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Real-time status of manufacturing data and version control.</p>
      </div>
      
      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {/* Total Users */}
        <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col gap-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Users</p>
            <h3 className="font-headline-lg text-headline-lg mt-1">{data.totalUsers}</h3>
          </div>
          <div className="h-10 mt-auto opacity-40 group-hover:opacity-80 transition-opacity">
            <div className="w-full h-full flex items-end gap-1">
              <div className="bg-primary w-full h-[40%] rounded-t-sm"></div>
              <div className="bg-primary w-full h-[60%] rounded-t-sm"></div>
              <div className="bg-primary w-full h-[55%] rounded-t-sm"></div>
              <div className="bg-primary w-full h-[80%] rounded-t-sm"></div>
              <div className="bg-primary w-full h-[70%] rounded-t-sm"></div>
              <div className="bg-primary w-full h-[95%] rounded-t-sm"></div>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col gap-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">inventory_2</span>
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">+4%</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Products</p>
            <h3 className="font-headline-lg text-headline-lg mt-1">{data.totalProducts}</h3>
          </div>
          <div className="h-10 mt-auto opacity-40 group-hover:opacity-80 transition-opacity">
            <div className="w-full h-full flex items-end gap-1">
              <div className="bg-secondary w-full h-[70%] rounded-t-sm"></div>
              <div className="bg-secondary w-full h-[65%] rounded-t-sm"></div>
              <div className="bg-secondary w-full h-[90%] rounded-t-sm"></div>
              <div className="bg-secondary w-full h-[75%] rounded-t-sm"></div>
              <div className="bg-secondary w-full h-[85%] rounded-t-sm"></div>
              <div className="bg-secondary w-full h-[80%] rounded-t-sm"></div>
            </div>
          </div>
        </div>

        {/* Total ECOs */}
        <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col gap-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">published_with_changes</span>
            </div>
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">Active</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total ECOs</p>
            <h3 className="font-headline-lg text-headline-lg mt-1">{data.totalEcos}</h3>
          </div>
          <div className="h-10 mt-auto opacity-40 group-hover:opacity-80 transition-opacity">
            <div className="w-full h-full flex items-end gap-1">
              <div className="bg-tertiary w-full h-[20%] rounded-t-sm"></div>
              <div className="bg-tertiary w-full h-[45%] rounded-t-sm"></div>
              <div className="bg-tertiary w-full h-[35%] rounded-t-sm"></div>
              <div className="bg-tertiary w-full h-[55%] rounded-t-sm"></div>
              <div className="bg-tertiary w-full h-[40%] rounded-t-sm"></div>
              <div className="bg-tertiary w-full h-[60%] rounded-t-sm"></div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/80 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col gap-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-700">health_and_safety</span>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Optimal</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">System Health</p>
            <h3 className="font-headline-lg text-headline-lg mt-1">99.9%</h3>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="w-[99.9%] h-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Activity */}
      <div className="grid grid-cols-1 gap-xl">
        {/* Activity Overview Timeline */}
        <div className="flex flex-col gap-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-title-lg text-title-lg text-on-surface">Recent Audit Activity</h4>
            <Link to="/audit" className="text-primary font-label-md hover:underline">View All</Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-lg flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative flex flex-col gap-xl">
              <div className="absolute left-4 top-1 bottom-1 w-[2px] bg-outline-variant"></div>
              
              {data.recentAuditEvents.map(log => (
                <div key={log.id} className="relative pl-10">
                  <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full ${log.action === 'CREATED' ? 'bg-primary' : log.action === 'DELETED' ? 'bg-error' : 'bg-secondary'} border-4 border-white shadow-sm ring-2 ${log.action === 'CREATED' ? 'ring-primary/20' : log.action === 'DELETED' ? 'ring-error/20' : 'ring-secondary/20'}`}></div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg text-on-surface">{log.action} {log.entity_type}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{format(new Date(log.performed_at!), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Entity ID: {log.entity_id}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">By User: {(log.user as any)?.full_name || 'System'}</p>
                  </div>
                </div>
              ))}
              {data.recentAuditEvents.length === 0 && (
                <div className="text-center py-4 text-outline text-sm pl-10">No recent audit activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* System Configuration & Health (Bottom Section) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-margin-desktop">
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">settings_input_component</span>
            <h4 className="font-title-lg text-title-lg">System Configuration</h4>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="p-md rounded-lg bg-surface-container flex flex-col gap-2 group hover:bg-primary/5 cursor-pointer transition-colors">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">API Thresholds</span>
              <span className="font-headline-md text-headline-md text-primary">85% <span className="text-body-sm font-normal text-on-surface-variant">Utilization</span></span>
            </div>
            <div className="p-md rounded-lg bg-surface-container flex flex-col gap-2 group hover:bg-primary/5 cursor-pointer transition-colors">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">Auto-Archive</span>
              <span className="font-headline-md text-headline-md text-primary">Enabled</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-md border-t border-outline-variant">
            <p className="font-body-sm text-body-sm text-on-surface-variant italic">Last synced: Today, {format(new Date(), 'hh:mm a')}</p>
            <button className="text-primary font-label-md hover:underline">Manage Settings</button>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-lg overflow-hidden relative">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">lan</span>
            <h4 className="font-title-lg text-title-lg">Global Node Status</h4>
          </div>
          <div className="flex items-center gap-xl">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="25.12" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-bold text-lg text-primary">90%</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">North America Node</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">European Union Node</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Asia-Pacific Node</span>
                <span className="text-amber-500 font-bold">Warning</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
