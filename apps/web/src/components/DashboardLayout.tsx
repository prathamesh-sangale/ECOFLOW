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
                
                {/* Floating Action Button removed as requested */}
            </main>
        </div>
    );
}
