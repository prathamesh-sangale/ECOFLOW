import React, { useState, useEffect } from 'react';
import { api } from '../../store/AuthContext';

interface UserFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserForm({ onClose, onSuccess }: UserFormProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role_id: '',
    phone: ''
  });

  useEffect(() => {
    api.get('/roles').then(res => setRoles(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to save user');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-surface rounded-xl p-xl w-full max-w-lg">
        <h2 className="text-title-lg font-title-lg mb-md text-on-surface">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-secondary mb-1">Full Name</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Email</label>
            <input required type="email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Password</label>
            <input required type="password" minLength={6} className="w-full p-2 border rounded" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Role</label>
            <select required className="w-full p-2 border rounded" value={formData.role_id} onChange={e => setFormData({ ...formData, role_id: e.target.value })}>
              <option value="">Select Role...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.role_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-label-md text-secondary mb-1">Phone</label>
            <input type="text" className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="flex justify-end gap-md mt-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary hover:bg-surface-container rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-container">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
