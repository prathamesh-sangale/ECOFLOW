import { useEffect, useState } from 'react';
import { useAuth, api } from '../../store/AuthContext';
import type { User } from '@ecoflow/shared-types';

export default function UserManagement() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-background text-on-background font-body-md min-h-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container-low flex flex-col py-xl px-md gap-sm z-50 border-r border-outline-variant">
        <div className="flex items-center gap-md mb-xl px-sm">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary leading-none">ECOFlow</h1>
            <p className="text-on-surface-variant font-label-md text-label-md">Engineering Control</p>
          </div>
        </div>
        <nav className="flex-grow flex flex-col gap-xs">
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-secondary-fixed transition-all rounded-lg font-label-lg text-label-lg group" href="/dashboard">
            <span className="material-symbols-outlined group-hover:text-primary">dashboard</span> Dashboard
          </a>
          <a className="bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-md px-md py-sm font-label-lg text-label-lg" href="/admin/users">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span> User Management
          </a>
          <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-secondary-fixed transition-all rounded-lg font-label-lg text-label-lg group" href="/admin/roles">
            <span className="material-symbols-outlined group-hover:text-primary">admin_panel_settings</span> Role Management
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant pt-lg flex flex-col gap-xs">
          <button onClick={logout} className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-secondary-fixed transition-all rounded-lg font-label-lg text-label-lg group">
            <span className="material-symbols-outlined">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-[260px] flex flex-col min-h-screen relative bg-background overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 w-full sticky top-0 z-40 bg-surface shadow-sm border-b border-transparent">
          <div className="flex items-center gap-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">User Management</h2>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">{user?.full_name}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-lg md:p-xl space-y-xl max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div className="flex flex-wrap items-center gap-md">
              {/* Filters */}
            </div>
            <div className="flex items-center gap-sm">
              <button className="flex items-center gap-sm px-lg py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:opacity-90 transition-all shadow-md">
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
      </main>
    </div>
  );
}
