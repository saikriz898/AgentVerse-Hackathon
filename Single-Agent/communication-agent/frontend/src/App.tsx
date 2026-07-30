import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { AiSimplifierView } from './components/AiSimplifierView';
import { GenerateReportView } from './components/GenerateReportView';
import { GenerateEmailView } from './components/GenerateEmailView';
import { CommunicationHistoryView } from './components/CommunicationHistoryView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LanguageType } from './types/communication';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simplifier');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('English');
  
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    api.getHealth()
      .then(setSystemStatus)
      .catch(console.error);

    const storedUser = localStorage.getItem('lifeos_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleShowToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      type,
      title,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    handleShowToast("Logged Out", "Successfully signed out of session.", "info");
  };

  return (
    <div className={`min-h-screen flex text-slate-100 font-sans antialiased ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          systemStatus={systemStatus}
          onOpenStudio={() => setActiveTab('simplifier')}
          onOpenAuth={() => setAuthModalOpen(true)}
          user={user}
        />

        {/* Dynamic Canvas Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'simplifier' && (
            <AiSimplifierView />
          )}

          {activeTab === 'report' && (
            <GenerateReportView />
          )}

          {activeTab === 'email' && (
            <GenerateEmailView />
          )}

          {activeTab === 'history' && (
            <CommunicationHistoryView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900/80 dark:border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
          LifeOS Multi-Agent Ecosystem — AI Communication Agent (AI Simplifier, Report Generator, Email Architect & History Audit Log)
        </footer>

      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          handleShowToast("Authentication Successful", `Welcome back, ${u.username}!`, "success");
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={handleCloseToast} />

    </div>
  );
};

export default App;
