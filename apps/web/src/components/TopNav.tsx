import { Link, useLocation } from 'react-router-dom';
import { NotificationPopover } from './NotificationPopover';

interface TopNavProps {
    onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
    const location = useLocation();

    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between h-16 px-4 md:px-margin-desktop">
            <div className="flex items-center gap-4 md:gap-8">
                <button onClick={onMenuClick} className="md:hidden text-secondary hover:text-primary p-2">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                
                <div className="relative hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Search components, ECOs, or BOMs..." 
                        className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-64 lg:w-80 text-body-md focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                    />
                </div>
                
                <nav className="hidden lg:flex items-center gap-6">
                    <Link 
                        to="/dashboard" 
                        className={`py-5 transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/boms" 
                        className={`py-5 transition-colors ${location.pathname.startsWith('/boms') ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        BOMs
                    </Link>
                    <Link 
                        to="/ecos" 
                        className={`py-5 transition-colors ${location.pathname.startsWith('/ecos') ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        ECOs
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <NotificationPopover />

                <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high hidden sm:block">
                    <span className="material-symbols-outlined">help</span>
                </button>
                
                <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>
                
                <Link to="/products/new" className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md hover:bg-primary hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span className="hidden sm:inline">Add Product</span>
                </Link>
            </div>
        </header>
    );
}
