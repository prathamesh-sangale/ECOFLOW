import { useEffect, useState } from 'react';
import { useAuth, api } from '../../store/AuthContext';
import type { User } from '@ecoflow/shared-types';
import UserForm from './UserForm';

export default function UserManagement() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-xl">
        <h2 className="font-headline-lg text-on-surface">User Management</h2>
      </header>

        {/* Content Body */}
        <div className="p-lg md:p-xl space-y-xl max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div className="flex flex-wrap items-center gap-md">
              {/* Filters */}
            </div>
            <div className="flex items-center gap-sm">
              <button onClick={() => setShowForm(true)} className="flex items-center gap-sm px-lg py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:opacity-90 transition-all shadow-md">
                <span className="material-symbols-outlined">person_add</span> Add User
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-outline-variant">
                    <th className="px-lg py-md">User Name</th>
                    <th className="px-lg py-md">Role</th>
                    <th className="px-lg py-md">Email Address</th>
                    <th className="px-lg py-md">Status</th>
                    <th className="px-lg py-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center p-md">Loading users...</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-lg py-md">
                        <div className="flex flex-col">
                          <span className="font-title-lg text-title-lg text-on-surface leading-tight">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-on-surface">
                        {u.role ? u.role.role_name : 'No Role'}
                      </td>
                      <td className="px-lg py-md text-body-md text-on-surface-variant">{u.email}</td>
                      <td className="px-lg py-md">
                        <span className={`px-md py-xs rounded-full text-label-md font-bold inline-flex items-center gap-xs ${u.status === 'ACTIVE' ? 'bg-primary-container/20 text-primary' : 'bg-error-container text-error'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {u.status !== 'ACTIVE' && (
                            <button onClick={() => handleStatusChange(u.id, 'ACTIVE')} className="p-xs text-on-surface-variant hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            </button>
                          )}
                          {u.status === 'ACTIVE' && (
                            <button onClick={() => handleStatusChange(u.id, 'SUSPENDED')} className="p-xs text-on-surface-variant hover:text-error transition-colors">
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </button>
                          )}
                          <button onClick={() => handleDelete(u.id)} className="p-xs text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {showForm && (
        <UserForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => { setShowForm(false); fetchUsers(); }} 
        />
      )}
    </div>
  );
}
