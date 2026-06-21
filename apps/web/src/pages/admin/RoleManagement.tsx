import React, { useEffect, useState } from 'react';
import { useAuth, api } from '../../store/AuthContext';
import type { Role, Permission } from '@ecoflow/shared-types';
import RoleForm from './RoleForm';

export default function RoleManagement() {
  const { logout } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/roles'),
        api.get('/permissions')
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (roleId: string, permissionId: string, isAssigned: boolean) => {
    try {
      if (isAssigned) {
        await api.delete(`/permissions/roles/${roleId}/permissions/${permissionId}`);
      } else {
        await api.post(`/permissions/roles/${roleId}/permissions`, { permission_id: permissionId });
      }
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module_name]) acc[perm.module_name] = [];
    acc[perm.module_name].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-xl">
          <div className="space-y-xs">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Role & Permissions</h2>
            <p className="text-body-md text-on-surface-variant">Manage organization access levels and engineering control capabilities.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-lg text-label-lg flex items-center gap-sm shadow-sm hover:opacity-90 transition-all">
            <span className="material-symbols-outlined">group_add</span>
            Create New Role
          </button>
        </header>

        {/* Permission Matrix */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-on-surface-variant">rule</span>
              <h3 className="text-title-lg font-title-lg">System Capabilities Matrix</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="px-lg py-md text-label-md font-label-md text-on-surface-variant uppercase tracking-wider sticky left-0 bg-surface-container-high z-10 w-64 border-r border-outline-variant">Capability</th>
                  {roles.map(role => (
                    <th key={role.id} className="px-lg py-md text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-label-md font-bold text-primary">{role.role_name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  <tr><td colSpan={roles.length + 1} className="text-center p-md">Loading...</td></tr>
                ) : (
                  Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                    <React.Fragment key={moduleName}>
                      <tr className="bg-surface-container-low/30">
                        <td colSpan={roles.length + 1} className="px-lg py-sm text-label-md font-bold text-on-surface-variant uppercase bg-surface-container-low border-y border-outline-variant">
                          Module: {moduleName}
                        </td>
                      </tr>
                      {perms.map(perm => (
                        <tr key={perm.id} className="hover:bg-surface-container-lowest transition-colors group">
                          <td className="px-lg py-md sticky left-0 bg-white border-r border-outline-variant">
                            <div className="flex flex-col">
                              <span className="text-body-md font-semibold">{perm.permission_name}</span>
                              <span className="text-body-sm text-on-surface-variant">{perm.description}</span>
                            </div>
                          </td>
                          {roles.map(role => {
                            // The permissions on Role object might be nested under role_permissions
                            const rolePerms = (role as any).role_permissions || [];
                            const isAssigned = rolePerms.some((rp: any) => rp.permission_id === perm.id);
                            return (
                              <td key={role.id} className="text-center cursor-pointer hover:bg-surface-container-low" onClick={() => handleTogglePermission(role.id, perm.id, isAssigned)}>
                                <span 
                                  className={`material-symbols-outlined ${isAssigned ? 'text-primary' : 'text-outline-variant'}`}
                                  style={{ fontVariationSettings: isAssigned ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                  {isAssigned ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      {showForm && (
        <RoleForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => { setShowForm(false); fetchData(); }} 
        />
      )}
    </div>
  );
}
