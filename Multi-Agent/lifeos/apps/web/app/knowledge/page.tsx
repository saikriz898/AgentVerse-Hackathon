'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightContextPanel } from '@/components/layout/RightContextPanel';
import { MobileNav } from '@/components/layout/MobileNav';
import { KnowledgeView } from '@/components/workspace/KnowledgeView';

export default function KnowledgePage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary font-sans antialiased">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <KnowledgeView />
      </div>
      <RightContextPanel />
      <MobileNav />
    </div>
  );
}
