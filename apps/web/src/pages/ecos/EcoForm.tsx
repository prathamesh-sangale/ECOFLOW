import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, api } from '../../store/AuthContext';
import { ECOPrioritySchema } from '@ecoflow/shared-validations';
import type { CreateECOInput } from '@ecoflow/shared-validations';
import type { Product, BOM } from '@ecoflow/shared-types';
import { useQueryClient } from '@tanstack/react-query';

export default function EcoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [boms, setBoms] = useState<BOM[]>([]);
  const [formData, setFormData] = useState({
    eco_number: `ECO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    product_id: '',
    bom_id: '',
    title: '',
    description: '',
    reason: '',
    priority: 'Low',
  });

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchEco();
    }
  }, [id]);

  useEffect(() => {
    if (formData.product_id) {
      fetchBoms(formData.product_id);
    } else {
      setBoms([]);
    }
  }, [formData.product_id]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBoms = async (productId: string) => {
    try {
      const res = await api.get(`/boms?product_id=${productId}`);
      setBoms(res.data.boms || res.data); // Handle both formats
    } catch (e) {
      console.error(e);
      setBoms([]);
    }
  };

  const fetchEco = async () => {
    try {
      const res = await api.get(`/ecos/${id}`);
      const eco = res.data;
      setFormData({
        eco_number: eco.eco_number,
        product_id: eco.product_id,
        bom_id: eco.bom_id,
        title: eco.title,
        description: eco.description || '',
        reason: eco.reason || '',
        priority: eco.priority,
      });
    } catch (e) {
      console.error(e);
      navigate('/ecos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/ecos/${id}`, formData);
      } else {
        await api.post('/ecos', formData);
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'engineer'] });
      navigate('/ecos');
    } catch (error) {
      console.error(error);
      alert('Failed to save ECO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="flex items-center gap-4 h-16 px-8 bg-surface border-b border-outline-variant">
        <button onClick={() => navigate('/ecos')} className="text-secondary hover:bg-surface-container p-2 rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-primary">{id ? 'Edit Draft ECO' : 'Create New ECO'}</h1>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md font-medium text-on-surface-variant mb-1">Product</label>
              <select
                required
                className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20"
                value={formData.product_id}
                onChange={e => setFormData({ ...formData, product_id: e.target.value, bom_id: '' })}
              >
                <option value="">Select Product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface-variant mb-1">BOM</label>
              <select
                required
                className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                value={formData.bom_id}
                onChange={e => setFormData({ ...formData, bom_id: e.target.value })}
                disabled={!formData.product_id || boms.length === 0}
              >
                <option value="">Select BOM...</option>
                {boms.map(b => <option key={b.id} value={b.id}>{b.bom_code} - {b.bom_name}</option>)}
              </select>
              {boms.length === 0 && formData.product_id && (
                <p className="text-error text-sm mt-1">No BOM available for this product. Create a BOM first.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1">ECO Title</label>
            <input
              required
              type="text"
              className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Change Desktop Material to Solid Oak"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md font-medium text-on-surface-variant mb-1">ECO Number</label>
              <input
                required
                type="text"
                disabled={!!id}
                className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md opacity-70"
                value={formData.eco_number}
                onChange={e => setFormData({ ...formData, eco_number: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface-variant mb-1">Priority</label>
              <select
                className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1">Description</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 h-24"
              placeholder="Detailed description of the change..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1">Reason for Change</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 h-24"
              placeholder="Why is this change necessary?"
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant">
            <button type="button" onClick={() => navigate('/ecos')} className="px-6 py-2 text-primary font-label-md hover:bg-surface-container rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : id ? 'Save Changes' : 'Create Draft'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
