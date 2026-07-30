import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { financeApi, MOCK_ESTIMATE, MOCK_BUDGET } from '../services/api';

import { DashboardView } from '../pages/DashboardView';
import { CostEstimatorView } from '../pages/CostEstimatorView';
import { BudgetPlannerView } from '../pages/BudgetPlannerView';
import { CostBreakdownView } from '../pages/CostBreakdownView';
import { InfrastructureCostView } from '../pages/InfrastructureCostView';
import { RoiAnalysisView } from '../pages/RoiAnalysisView';
import { ForecastingView } from '../pages/ForecastingView';
import { FinancialReportsView } from '../pages/FinancialReportsView';
import { AnalyticsView } from '../pages/AnalyticsView';
import { SettingsView } from '../pages/SettingsView';

export const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(true);

  const [currentEstimate, setCurrentEstimate] = useState(MOCK_ESTIMATE);
  const [recentEstimates, setRecentEstimates] = useState([MOCK_ESTIMATE]);
  const [budgetOverview, setBudgetOverview] = useState(MOCK_BUDGET);
  const [loading, setLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      const [estList, budget] = await Promise.all([
        financeApi.getRecentEstimates(),
        financeApi.getBudgetOverview(),
      ]);

      if (estList && estList.length > 0) {
        setRecentEstimates(estList);
        setCurrentEstimate(estList[0]);
      } else {
        setRecentEstimates([MOCK_ESTIMATE]);
        setCurrentEstimate(MOCK_ESTIMATE);
      }

      if (budget) {
        setBudgetOverview(budget);
      } else {
        setBudgetOverview(MOCK_BUDGET);
      }
    } catch (err) {
      console.warn('Backend connection warning, using local financial architecture:', err);
      setCurrentEstimate(MOCK_ESTIMATE);
      setRecentEstimates([MOCK_ESTIMATE]);
      setBudgetOverview(MOCK_BUDGET);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleEstimateGenerated = (newEst) => {
    setCurrentEstimate(newEst);
    setRecentEstimates([newEst, ...recentEstimates]);
  };

  const titlesMap = {
    dashboard: 'Executive Financial Dashboard',
    estimator: 'AI Software Project Cost Estimator',
    budget: 'Department Budget Planner',
    breakdown: 'Granular Cost Breakdown & Audit',
    infrastructure: 'Multi-Cloud Infrastructure Cost Matrix',
    roi: 'ROI Analysis & Break-even Calculator',
    forecasting: 'Predictive Expense & Growth Forecasting',
    reports: 'Financial Reports & PDF Export',
    analytics: 'Advanced Financial Analytics',
    settings: 'System & Currency Settings',
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-wider text-slate-400">Loading AI Financial Architect Workspace...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <Header
          activeTabTitle={titlesMap[activeTab]}
          currency={currency}
          setCurrency={setCurrency}
          onNewEstimate={() => setActiveTab('estimator')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              estimate={currentEstimate}
              budget={budgetOverview}
              recentEstimates={recentEstimates}
              currency={currency}
              onSelectEstimate={(est) => {
                setCurrentEstimate(est);
                setActiveTab('estimator');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'estimator' && (
            <CostEstimatorView
              currentEstimate={currentEstimate}
              onEstimateGenerated={handleEstimateGenerated}
              currency={currency}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetPlannerView estimate={currentEstimate} budget={budgetOverview} currency={currency} />
          )}

          {activeTab === 'breakdown' && (
            <CostBreakdownView estimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'infrastructure' && (
            <InfrastructureCostView estimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'roi' && (
            <RoiAnalysisView estimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'forecasting' && (
            <ForecastingView estimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'reports' && (
            <FinancialReportsView currentEstimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView estimate={currentEstimate} currency={currency} />
          )}

          {activeTab === 'settings' && (
            <SettingsView currency={currency} setCurrency={setCurrency} />
          )}
        </main>
      </div>
    </div>
  );
};
