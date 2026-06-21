import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

interface SidebarProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen = false, setIsOpen }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <>
            {/* Backdrop overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-scrim/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen && setIsOpen(false)}
                />
            )}
            
            <aside className={`w-[260px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-base gap-2 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="px-6 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                            <span className="material-symbols-outlined">eco</span>
                        </div>
                        <div>
                            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">ECOFlow</h1>
                            <p className="text-[10px] uppercase tracking-wider text-outline">Furniture Engineering</p>
                        </div>
                    </div>
                    {/* Mobile close button */}
                    <button onClick={() => setIsOpen && setIsOpen(false)} className="md:hidden text-secondary p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            
            <nav className="flex-1 flex flex-col gap-1 px-3 sidebar-scroll overflow-y-auto">
                <Link 
                    to="/dashboard" 
                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/dashboard') && location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                
                {(user?.role?.role_name !== 'Production Manager' && user?.role?.role_name !== 'Production') && (
                    <>
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
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/ecos') && !location.search.includes('status=Approved') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">published_with_changes</span>
                            <span>ECOs</span>
                        </Link>
                    </>
                )}

                {(user?.role?.role_name === 'Production Manager' || user?.role?.role_name === 'Production' || user?.role?.role_name === 'Admin') && (
                    <>
                        <Link 
                            to="/versions" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/versions') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">layers</span>
                            <span>Versions</span>
                        </Link>
                        
                        <Link 
                            to="/ecos?status=Approved" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${location.search.includes('status=Approved') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>Approved Changes</span>
                        </Link>
                    </>
                )}

                {(user?.role?.role_name !== 'Engineer' && user?.role?.role_name !== 'Production Manager' && user?.role?.role_name !== 'Production') && (
                    <>
                        <Link 
                            to="/approvals/dashboard" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/approvals') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">verified_user</span>
                            <span>Approvals</span>
                        </Link>
                    </>
                )}
                
                {user?.role?.role_name !== 'Engineer' && (
                    <>
                        <Link 
                            to="/releases" 
                            className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/releases') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className="material-symbols-outlined">history</span>
                            <span>{user?.role?.role_name === 'Production Manager' ? 'Releases' : 'History'}</span>
                        </Link>

                        {user?.role?.role_name === 'Admin' && (
                            <>
                                <div className="my-4 border-t border-outline-variant mx-4"></div>
                                <Link 
                                    to="/audit" 
                                    className={`flex items-center gap-3 px-4 py-2 font-body-md transition-colors duration-200 ${isActive('/audit') ? 'bg-secondary-container text-primary font-semibold border-l-4 border-primary' : 'text-secondary hover:bg-surface-container-low'}`}
                                >
                                    <span className="material-symbols-outlined">fact_check</span>
                                    <span>Audit Logs</span>
                                </Link>
                            </>
                        )}
                    </>
                )}

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

            {user?.role?.role_name === 'Engineer' && (
                <div className="p-6 bg-surface-container-low mx-3 rounded-xl mb-4">
                    <Link to="/ecos/new" className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-primary-container">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create ECO
                    </Link>
                </div>
            )}

            <div className="px-6 py-4 border-t border-outline-variant flex flex-col gap-2">
                <div onClick={logout} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-error-container/20 rounded-lg px-2 -mx-2 transition-colors text-error group">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary font-bold text-xs group-hover:bg-error-container/50">
                        {user?.full_name?.charAt(0)}{user?.full_name?.split(' ')[1]?.charAt(0) || ''}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-label-md truncate group-hover:text-error text-on-surface">{user?.full_name}</p>
                        <p className="text-[10px] text-outline truncate group-hover:text-error/70">{user?.role?.role_name}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-error">logout</span>
                </div>
            </div>
        </aside>
    </>
    );
}
