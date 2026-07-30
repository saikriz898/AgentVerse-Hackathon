'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import CommandPalette from '../../components/CommandPalette';
import MobileBottomNav from '../../components/MobileBottomNav';
import MobileBottomSheet from '../../components/MobileBottomSheet';
import MobileDrawer from '../../components/MobileDrawer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F6F7F9] dark:bg-[#090909] text-[#111827] dark:text-neutral-100 flex flex-col overflow-hidden relative selection:bg-[#2563EB] selection:text-white transition-colors duration-150">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed((prev) => !prev)} />
      </div>

      {/* Mobile Slide-Out Drawer (300px) */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />

      {/* Top Header Navbar */}
      <Navbar isCollapsed={isCollapsed} onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)} />

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Main Content Region - Fixed Viewport Height */}
      <main
        className={`flex-1 h-[calc(100vh-64px)] mt-[64px] bg-[#F6F7F9] dark:bg-[#090909] text-[#111827] dark:text-neutral-100 overflow-hidden transition-all duration-200 ease-in-out ${
          isCollapsed ? 'md:pl-[96px] md:pr-6' : 'md:pl-[304px] md:pr-6'
        } py-4`}
      >
        {children}
      </main>

      {/* Mobile Fixed 72px Bottom Navigation Bar */}
      <MobileBottomNav onOpenBottomSheet={() => setIsBottomSheetOpen(true)} />

      {/* Mobile Quick Create Bottom Sheet Modal */}
      <MobileBottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
    </div>
  );
}
