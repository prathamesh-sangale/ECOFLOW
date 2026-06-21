import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className={`transition-all duration-300 min-h-screen flex flex-col relative ${isSidebarOpen ? 'ml-[260px]' : 'ml-0 md:ml-[260px]'}`}>
                <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 overflow-x-hidden">
                    {children || <Outlet />}
                </div>
                
                {/* Floating Action Button (Global) */}
                <button className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group">
                    <span className="material-symbols-outlined text-[28px]">add</span>
                    <span className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg text-label-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        New Action
                    </span>
                </button>
            </main>
        </div>
    );
}
