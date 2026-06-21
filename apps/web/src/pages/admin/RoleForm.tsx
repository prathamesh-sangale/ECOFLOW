import React, { useState } from 'react';
import { api } from '../../store/AuthContext';

interface RoleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RoleForm({ onClose, onSuccess }: RoleFormProps) {
  const [formData, setFormData] = useState({
    role_name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/roles', formData);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to save role');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-surface rounded-xl p-xl w-full max-w-lg">
        <h2 className="text-title-lg font-title-lg mb-md text-on-surface">Create New Role</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-secondary mb-1">Role Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.role_name} onChange={e => setFormData({ ...formData, role_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Description</label>
            <textarea className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-md mt-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary hover:bg-surface-container rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-container">Save Role</button>
          </div>
        </form>
      </div>
    </div>
  );
}
