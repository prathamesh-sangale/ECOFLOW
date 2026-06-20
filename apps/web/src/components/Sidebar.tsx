import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-base gap-2 z-50">
            <div className="px-6 py-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined">eco</span>
                </div>
                <div>
                    <h1 className="font-headline-sm text-headline-sm font-bold text-primary">ECOFlow</h1>
                    <p className="text-[10px] uppercase tracking-wider text-outline">Furniture Engineering</p>
                </div>
            </div>
            
            <nav className="flex-1 flex flex-col gap-1 px-3 sidebar-scroll overflow-y-auto">
                <Link 
                    to="/dashboard" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/dashboard') && location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                
                <Link 
                    to="/products" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/products') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span>Products</span>
                </Link>

                <Link 
                    to="/boms" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/boms') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">account_tree</span>
                    <span>BOMs</span>
                </Link>

                <Link 
                    to="/ecos" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/ecos') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">published_with_changes</span>
                    <span>ECOs</span>
                </Link>

                <Link 
                    to="/approvals/dashboard" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/approvals') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">verified_user</span>
                    <span>Approvals</span>
                </Link>

                <Link 
                    to="/releases" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/releases') || isActive('/versions') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">history</span>
                    <span>History</span>
                </Link>

                <div className="my-4 border-t border-outline-variant mx-4"></div>

                <Link 
                    to="/audit" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/audit') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">fact_check</span>
                    <span>Audit Logs</span>
                </Link>

                <Link 
                    to="/reports" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/reports') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">analytics</span>
                    <span>Reports</span>
                </Link>

                {user?.role?.role_name === 'Admin' && (
                    <>
                        <Link 
                            to="/admin/users" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/admin/users') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">group</span>
                            <span>Users</span>
                        </Link>
                        
                        <Link 
                            to="/admin/roles" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/admin/roles') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-6 bg-surface-container-low mx-3 rounded-xl mb-4">
                <Link to="/ecos/new" className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-primary-container">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Create ECO
                </Link>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant flex flex-col gap-2">
                <div onClick={logout} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-error-container/20 rounded-lg px-2 -mx-2 transition-colors text-error group">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary font-bold text-xs group-hover:bg-error-container/50">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-label-md truncate group-hover:text-error text-on-surface">{user?.first_name} {user?.last_name}</p>
                        <p className="text-[10px] text-outline truncate group-hover:text-error/70">{user?.role?.role_name}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-error">logout</span>
                </div>
            </div>
        </aside>
    );
}
