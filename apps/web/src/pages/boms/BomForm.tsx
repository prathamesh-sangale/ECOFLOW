import React, { useState, useEffect } from 'react';
import { api } from '../../store/AuthContext';
import type { Product } from '@ecoflow/shared-types';

interface BomFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BomForm({ onClose, onSuccess }: BomFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    product_id: '',
    bom_code: '',
    bom_name: '',
    description: '',
    status: 'Draft'
  });

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.products));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/boms', formData);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to save BOM');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-surface rounded-xl p-xl w-full max-w-lg">
        <h2 className="text-title-lg font-title-lg mb-md text-on-surface">Create New BOM</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-secondary mb-1">Product</label>
            <select required className="w-full p-2 border rounded" value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })}>
              <option value="">Select Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.product_name} ({p.product_code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">BOM Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.bom_name} onChange={e => setFormData({ ...formData, bom_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">BOM Code</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.bom_code} onChange={e => setFormData({ ...formData, bom_code: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Status</label>
            <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div className="flex justify-end gap-md mt-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary hover:bg-surface-container rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-container">Save BOM</button>
          </div>
        </form>
      </div>
    </div>
  );
}
