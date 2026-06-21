import React, { useState } from 'react';
import { api } from '../../store/AuthContext';

interface ComponentFormProps {
  bomId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ComponentForm({ bomId, onClose, onSuccess }: ComponentFormProps) {
  const [formData, setFormData] = useState({
    component_name: '',
    material_type: '',
    quantity: 1,
    unit: 'pcs',
    unit_cost: 0.0,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/boms/${bomId}/components`, {
        ...formData,
        quantity: Number(formData.quantity),
        unit_cost: Number(formData.unit_cost)
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to add component. Ensure quantity > 0 and unit cost >= 0.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-surface rounded-xl p-xl w-full max-w-lg">
        <h2 className="text-title-lg font-title-lg mb-md text-on-surface">Add Component</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-secondary mb-1">Component Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.component_name} onChange={e => setFormData({ ...formData, component_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Material Type</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.material_type} onChange={e => setFormData({ ...formData, material_type: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-label-md text-secondary mb-1">Quantity</label>
              <input required type="number" step="0.01" min="0.01" className="w-full p-2 border rounded" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} />
            </div>
            <div className="flex-1">
              <label className="block text-label-md text-secondary mb-1">Unit</label>
              <input required type="text" className="w-full p-2 border rounded" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Unit Cost (₹)</label>
            <input required type="number" step="0.01" min="0" className="w-full p-2 border rounded" value={formData.unit_cost} onChange={e => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Notes</label>
            <textarea className="w-full p-2 border rounded" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-md mt-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary hover:bg-surface-container rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-container">Add Component</button>
          </div>
        </form>
      </div>
    </div>
  );
}
