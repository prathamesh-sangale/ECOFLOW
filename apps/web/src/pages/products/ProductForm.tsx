import React, { useState, useEffect } from 'react';
import { api } from '../../store/AuthContext';
import type { CreateProductInput } from '@ecoflow/shared-validations';
import type { ProductCategory } from '@ecoflow/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

interface ProductFormProps {
  productId?: string | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ProductForm({ productId, onClose, onSuccess }: ProductFormProps) {
  const params = useParams();
  const navigate = useNavigate();
  const id = productId || params.id;
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState<Partial<CreateProductInput>>({
    product_name: '',
    product_code: '',
    category_id: '',
    description: '',
    status: 'Draft'
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
    if (id) {
      api.get(`/products/${id}`).then(res => {
        const product = res.data;
        setFormData({
          product_name: product.product_name,
          product_code: product.product_code,
          category_id: product.category_id,
          description: product.description || '',
          status: product.status as any
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'engineer'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-surface rounded-xl p-xl w-full max-w-lg">
        <h2 className="text-title-lg font-title-lg mb-md text-on-surface">Create New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-secondary mb-1">Product Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.product_name} onChange={e => setFormData({ ...formData, product_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Product Code / SKU</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.product_code} onChange={e => setFormData({ ...formData, product_code: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Category</label>
            <select required className="w-full p-2 border rounded" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
              <option value="">Select Category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Status</label>
            <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div className="flex justify-end gap-md mt-lg">
            <button type="button" onClick={() => onClose ? onClose() : navigate(-1)} className="px-4 py-2 text-secondary hover:bg-surface-container rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-container">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
