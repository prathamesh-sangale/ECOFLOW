import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, Filter, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { ReportFilterInput } from '@ecoflow/shared-validations';

const reportTypes = [
  { id: 'products', label: 'Products' },
  { id: 'boms', label: 'BOMs' },
  { id: 'ecos', label: 'ECOs' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'versions', label: 'Versions' },
  { id: 'users', label: 'Users' },
];

export default function ReportsCenter() {
  const [activeReport, setActiveReport] = useState('products');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilterInput>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [activeReport, filters]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${activeReport}`, { params: filters });
      setData(res.data);
    } catch (error) {
      console.error(`Failed to fetch ${activeReport} report`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/reports/export', { 
        params: { type: activeReport, ...filters },
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeReport}-report-${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Reports Center</h1>
        <button 
          onClick={handleExport}
          disabled={exporting || data.length === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => { setActiveReport(type.id); setFilters({}); }}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeReport === type.id 
                  ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {type.label} Report
            </button>
          ))}
        </div>

        <div className="p-6 border-b border-slate-100 bg-white flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Start Date</label>
            <input 
              type="date" 
              value={filters.startDate || ''}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">End Date</label>
            <input 
              type="date" 
              value={filters.endDate || ''}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Status</label>
            <select 
              value={filters.status || ''}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[120px]"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button 
            onClick={() => setFilters({})}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <Filter size={16} /> Clear Filters
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-indigo-600">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-slate-400">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-slate-500">No data found for the selected filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {Object.keys(data[0] || {}).filter(k => typeof data[0][k] !== 'object').map((key) => (
                    <th key={key} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    {Object.keys(row).filter(k => typeof row[k] !== 'object').map((key) => (
                      <td key={key} className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap">
                        {String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-500 font-medium flex justify-between">
          <span>Showing {data.length} records</span>
          {data.length >= 100 && <span>Max limit reached. Please use filters to narrow down.</span>}
        </div>
      </div>
    </div>
  );
}
