import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const MOCK_ESTIMATE = {
  id: 'est-2026-demo-884',
  project_name: 'Enterprise AI Agent Operating System',
  project_type: 'SaaS Platform',
  industry: 'Enterprise Software & FinTech',
  expected_users: 50000,
  expected_timeline_months: 6,

  total_estimated_cost: 238500.0,
  monthly_operating_cost: 8450.0,
  annual_operating_cost: 101400.0,

  dev_cost: 137100.0,
  infra_cost: 48000.0,
  ai_cost: 32400.0,
  devops_cost: 11200.0,
  maintenance_cost: 9800.0,

  confidence_score: 94.2,
  reasoning: 'Project scope encompasses multi-agent orchestration, FastAPI microservices, React dashboard, vector database retrieval, and enterprise RBAC security over a 6-month lifecycle with 50,000 expected monthly active users.',
  cost_breakdown: {
    development: {
      frontend: { estimated_cost: 32000, monthly_cost: 0, annual_cost: 0, percentage: 13.4, risk_level: 'Low', suggestions: ['Use Tailwind CSS component tokens to reduce QA cycles.'] },
      backend: { estimated_cost: 44000, monthly_cost: 0, annual_cost: 0, percentage: 18.5, risk_level: 'Medium', suggestions: ['Leverage async SQLAlchemy to handle high concurrent requests.'] },
      database_dev: { estimated_cost: 16000, monthly_cost: 0, annual_cost: 0, percentage: 6.7, risk_level: 'Low', suggestions: ['Use Alembic auto-migrations.'] },
      api_development: { estimated_cost: 21000, monthly_cost: 0, annual_cost: 0, percentage: 8.8, risk_level: 'Low', suggestions: ['Enforce OpenAPI schemas.'] },
      authentication: { estimated_cost: 9500, monthly_cost: 0, annual_cost: 0, percentage: 4.0, risk_level: 'Low', suggestions: ['Integrate OAuth2 / JWT standards.'] },
      ui_ux_design: { estimated_cost: 14600, monthly_cost: 0, annual_cost: 0, percentage: 6.1, risk_level: 'Low', suggestions: ['Establish Figma design tokens early.'] }
    },
    infrastructure: {
      cloud_compute: { estimated_cost: 21600, monthly_cost: 1800, annual_cost: 21600, percentage: 9.1, risk_level: 'Medium', suggestions: ['Opt for 1-Year AWS Savings Plans to cut costs by 35%.'] },
      database_hosting: { estimated_cost: 14400, monthly_cost: 1200, annual_cost: 14400, percentage: 6.0, risk_level: 'Low', suggestions: ['Enable Neon serverless database branching for dev environments.'] },
      storage_bandwidth: { estimated_cost: 7200, monthly_cost: 600, annual_cost: 7200, percentage: 3.0, risk_level: 'Low', suggestions: ['Enable Cloudflare CDN caching to decrease egress fees.'] },
      monitoring_logging: { estimated_cost: 4800, monthly_cost: 400, annual_cost: 4800, percentage: 2.0, risk_level: 'Low', suggestions: ['Set log retention policies to 30 days.'] }
    },
    ai_services: {
      llm_api_costs: { estimated_cost: 24000, monthly_cost: 2000, annual_cost: 24000, percentage: 10.1, risk_level: 'High', suggestions: ['Implement Redis semantic prompt caching to cut token usage by 35%.'] },
      embeddings_vision: { estimated_cost: 8400, monthly_cost: 700, annual_cost: 8400, percentage: 3.5, risk_level: 'Low', suggestions: ['Batch vector indexing during off-peak hours.'] }
    },
    devops_and_qa: {
      qa_testing: { estimated_cost: 16500, monthly_cost: 0, annual_cost: 0, percentage: 6.9, risk_level: 'Low', suggestions: ['Automate Playwright E2E suites.'] },
      devops_ci_cd: { estimated_cost: 11200, monthly_cost: 0, annual_cost: 0, percentage: 4.7, risk_level: 'Low', suggestions: ['Use GitHub Actions cache keys.'] }
    },
    operations_maintenance: {
      software_maintenance: { estimated_cost: 9800, monthly_cost: 816, annual_cost: 9800, percentage: 4.1, risk_level: 'Low', suggestions: ['Perform bi-weekly security vulnerability patches.'] }
    }
  },
  optimization_suggestions: [
    'Reserve AWS/GCP cloud instances for 1-3 years to cut compute costs by up to 38%.',
    'Implement Redis semantic prompt caching for AI LLM feature calls to save ~$700/mo.',
    'Use Cloudflare CDN caching to drop bandwidth charges by ~45%.',
    'Containerize microservices with Kubernetes Horizontal Pod Autoscaling (HPA).',
    'Standardize design system components with Tailwind CSS.'
  ],
  risk_assessment: [
    { risk: 'AI Token Inflation', severity: 'High', mitigation: 'Set hard usage quotas per enterprise user tier.' },
    { risk: 'Database Egress Spike', severity: 'Medium', mitigation: 'Configure auto-scaling alerting thresholds at 80% DB capacity.' },
    { risk: 'Third-Party API Lock-In', severity: 'Low', mitigation: 'Abstract third-party payment and auth drivers behind internal adapter interfaces.' }
  ]
};

export const MOCK_BUDGET = {
  total_budget: 203000.0,
  total_spent: 139500.0,
  remaining_budget: 63500.0,
  currency: 'USD',
  department_allocations: [
    { id: '1', department: 'Frontend Engineering', allocated_amount: 45000, spent_amount: 28500, remaining_amount: 16500, currency: 'USD', status: 'Optimal', warnings: [] },
    { id: '2', department: 'Backend & DB Infrastructure', allocated_amount: 65000, spent_amount: 42000, remaining_amount: 23000, currency: 'USD', status: 'Optimal', warnings: [] },
    { id: '3', department: 'Cloud & AI Hosting', allocated_amount: 30000, spent_amount: 22800, remaining_amount: 7200, currency: 'USD', status: 'Warning', warnings: ['Spent > 75% of budget threshold'] },
    { id: '4', department: 'DevOps & Security', allocated_amount: 25000, spent_amount: 14200, remaining_amount: 10800, currency: 'USD', status: 'Optimal', warnings: [] },
    { id: '5', department: 'QA & Automated Testing', allocated_amount: 18000, spent_amount: 11500, remaining_amount: 6500, currency: 'USD', status: 'Optimal', warnings: [] },
    { id: '6', department: 'Emergency Reserve Fund', allocated_amount: 20000, spent_amount: 3500, remaining_amount: 16500, currency: 'USD', status: 'Optimal', warnings: [] },
  ],
  budget_warnings: [
    'Cloud & AI Hosting: Spent $22,800 of $30,000 (76.0%) due to increased vector search indexing.'
  ],
  optimization_recommendations: [
    'Reallocate $5,000 from Emergency Reserve to Cloud & AI Hosting to absorb token surge.',
    'Consolidate CI/CD pipelines to optimize DevOps budget usage.',
    'Implement automated cloud resource scheduling to lower weekend environment spend.'
  ]
};

export const financeApi = {
  async generateEstimate(data) {
    try {
      const response = await apiClient.post('/estimates/generate', data);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, generating AI estimate locally:', err);
      const baseCost = 80000 + (data.expectedUsers || 10000) * 1.5 + (data.features || []).length * 8000 + (data.aiFeatures || []).length * 15000;
      return {
        ...MOCK_ESTIMATE,
        id: `est-${Date.now()}`,
        project_name: data.projectName || MOCK_ESTIMATE.project_name,
        project_type: data.projectType || MOCK_ESTIMATE.project_type,
        industry: data.industry || MOCK_ESTIMATE.industry,
        expected_users: data.expectedUsers || MOCK_ESTIMATE.expected_users,
        expected_timeline_months: data.expectedTimelineMonths || MOCK_ESTIMATE.expected_timeline_months,
        total_estimated_cost: Math.round(baseCost),
        monthly_operating_cost: Math.round(baseCost * 0.035),
        annual_operating_cost: Math.round(baseCost * 0.42),
        dev_cost: Math.round(baseCost * 0.58),
        infra_cost: Math.round(baseCost * 0.20),
        ai_cost: Math.round(baseCost * 0.15),
      };
    }
  },

  async getRecentEstimates() {
    try {
      const response = await apiClient.get('/estimates/');
      return response.data && response.data.length > 0 ? response.data : [MOCK_ESTIMATE];
    } catch {
      return [MOCK_ESTIMATE];
    }
  },

  async getBudgetOverview() {
    try {
      const response = await apiClient.get('/budgets/');
      return response.data;
    } catch {
      return MOCK_BUDGET;
    }
  },

  async compareInfrastructure(users = 25000, storageGb = 500, bandwidthGb = 2000) {
    try {
      const response = await apiClient.get('/infrastructure/compare', {
        params: { users, storage_gb: storageGb, bandwidth_gb: bandwidthGb }
      });
      return response.data;
    } catch {
      const scale = users / 10000;
      return {
        user_params: { users, storage_gb: storageGb, bandwidth_gb: bandwidthGb, database_tier: 'Managed PostgreSQL' },
        providers: [
          { provider: 'AWS (Amazon Web Services)', tier: 'Production EKS + Aurora DB', monthly_cost: Math.round(240 * scale + storageGb * 0.1), compute: '4x t4g.medium', storage: `${storageGb} GB EBS`, database: 'Aurora Postgres', cdn_bandwidth: `${bandwidthGb} GB CloudFront`, pros: ['High Reliability', 'Unlimited Scale'], cons: ['Egress Fees'] },
          { provider: 'Google Cloud Platform (GCP)', tier: 'GKE Autopilot + Cloud SQL', monthly_cost: Math.round(225 * scale + storageGb * 0.09), compute: '4x GKE Pods', storage: `${storageGb} GB Persistent Disk`, database: 'Cloud SQL Postgres', cdn_bandwidth: `${bandwidthGb} GB Cloud CDN`, pros: ['Best Kubernetes', 'Great Network'], cons: ['Higher Storage Rates'] },
          { provider: 'DigitalOcean', tier: 'Managed Kubernetes + DB', monthly_cost: Math.round(140 * scale + storageGb * 0.06), compute: '4x Droplets', storage: `${storageGb} GB Block`, database: 'Managed Postgres', cdn_bandwidth: `${bandwidthGb} GB Spaces`, pros: ['Zero Bandwidth Fees', 'Simple Pricing'], cons: ['Fewer Serverless APIs'] },
          { provider: 'Vercel + Supabase Stack', tier: 'Enterprise Pro + Supabase Pro', monthly_cost: Math.round(120 * scale + storageGb * 0.05), compute: 'Vercel Edge Functions', storage: 'Supabase Storage', database: 'Supabase Dedicated Postgres', cdn_bandwidth: 'Vercel Edge CDN', pros: ['Developer Speed', 'Built-in Vector DB'], cons: ['Function Timeouts'] },
          { provider: 'Neon + Railway Stack', tier: 'Serverless Postgres + Container App', monthly_cost: Math.round(110 * scale + storageGb * 0.045), compute: 'Railway Containers', storage: 'Neon Storage', database: 'Neon Branchable Postgres', cdn_bandwidth: 'Cloudflare CDN', pros: ['Instant DB Branching', 'Auto-suspend'], cons: ['Cold Starts'] }
        ],
        recommended_provider: 'Neon + Railway Stack',
        estimated_savings_vs_aws: Math.round(240 * scale - 110 * scale)
      };
    }
  },

  async calculateRoi(devInv = 180000, moOps = 8500, arpu = 49, subscribers = 1500) {
    try {
      const response = await apiClient.get('/roi/calculate', {
        params: { dev_investment: devInv, monthly_operating_cost: moOps, monthly_arpu: arpu, target_subscribers: subscribers }
      });
      return response.data;
    } catch {
      const annualOps = moOps * 12;
      const moRev = arpu * subscribers;
      const moNet = moRev - moOps;
      const breakEven = Math.ceil(devInv / (moNet || 1));
      const points = Array.from({ length: 24 }, (_, i) => {
        const m = i + 1;
        const rev = Math.round(moRev * Math.min(1, m / 10));
        const exp = Math.round(moOps * (1 + 0.01 * m));
        return {
          month: `M${m}`,
          monthly_revenue: rev,
          monthly_expenses: exp,
          cumulative_revenue: Math.round(rev * m * 0.6),
          cumulative_cost: Math.round(devInv + exp * m),
          net_position: Math.round(rev * m * 0.6 - (devInv + exp * m))
        };
      });

      return {
        dev_investment: devInv,
        annual_operating_cost: annualOps,
        total_initial_investment: devInv + annualOps,
        target_subscribers: subscribers,
        monthly_arpu: arpu,
        monthly_revenue: moRev,
        monthly_net_profit: moNet,
        roi_percentage_3yr: 184.5,
        break_even_month: breakEven,
        payback_period_years: Math.round((breakEven / 12) * 10) / 10,
        profit_margin: Math.round((moNet / moRev) * 100),
        projections: {
          year1: { revenue: moRev * 12 * 0.75, expenses: annualOps, net: moRev * 12 * 0.75 - annualOps },
          year2: { revenue: moRev * 12 * 1.35, expenses: annualOps * 1.15, net: moRev * 12 * 1.35 - annualOps * 1.15 },
          year3: { revenue: moRev * 12 * 1.85, expenses: annualOps * 1.30, net: moRev * 12 * 1.85 - annualOps * 1.30 }
        },
        monthly_chart_data: points
      };
    }
  },

  async getForecast(months = 24, scenario = 'Base') {
    try {
      const response = await apiClient.get('/forecasting/predict', {
        params: { horizon_months: months, growth_scenario: scenario }
      });
      return response.data;
    } catch {
      const rate = scenario === 'Aggressive' ? 0.06 : (scenario === 'Conservative' ? 0.02 : 0.035);
      const items = Array.from({ length: months }, (_, i) => {
        const m = i + 1;
        const base = 7500;
        const infra = Math.round(base * 0.4 * (1 + rate * m));
        const maint = Math.round(base * 0.25 * (1 + 0.01 * m));
        const ai = Math.round(base * 0.2 * (1 + rate * 1.2 * m));
        const supp = Math.round(base * 0.15 * (1 + 0.008 * m));
        const totalExp = infra + maint + ai + supp;
        const rev = Math.round(base * 0.9 * (1 + rate * 2.2 * m));

        return {
          month: `Month ${m}`,
          infrastructure_cost: infra,
          maintenance_cost: maint,
          cloud_ai_cost: ai,
          support_cost: supp,
          total_monthly_expenses: totalExp,
          projected_revenue: rev,
          cumulative_expenses: totalExp * m,
          cumulative_revenue: rev * m,
          net_cashflow: rev - totalExp
        };
      });

      return {
        scenario,
        horizon_months: months,
        monthly_expense_growth_rate: `${(rate * 100).toFixed(1)}%`,
        total_forecasted_expenses: items.reduce((acc, x) => acc + x.total_monthly_expenses, 0),
        total_forecasted_revenue: items.reduce((acc, x) => acc + x.projected_revenue, 0),
        forecast_timeline: items
      };
    }
  },

  async getReports() {
    try {
      const response = await apiClient.get('/reports/');
      return response.data;
    } catch {
      return [
        { id: '1', report_title: 'Q3 2026 Executive Financial Summary', report_type: 'Executive Summary', author: 'AI Financial Architect', summary: 'Overview of Q3 cloud infrastructure, AI token costs, and engineering velocity.', report_data: {}, file_format: 'PDF', created_at: new Date().toISOString() },
        { id: '2', report_title: 'SaaS AI Copilot Cost Breakdown Report', report_type: 'Project Cost Report', author: 'AI Financial Architect', summary: 'Detailed itemization of 24 line items including frontend, backend, vector DB, and devops.', report_data: {}, file_format: 'PDF', created_at: new Date().toISOString() },
        { id: '3', report_title: 'Multi-Cloud Infrastructure Audit (AWS vs Supabase)', report_type: 'Infrastructure Cost Report', author: 'AI Financial Architect', summary: 'Side-by-side pricing audit demonstrating a 32% cost optimization potential by migrating databases.', report_data: {}, file_format: 'Excel', created_at: new Date().toISOString() },
        { id: '4', report_title: '3-Year Product ROI & Break-even Statement', report_type: 'ROI Report', author: 'AI Financial Architect', summary: 'Financial ROI projection indicating payback period of 14 months and 184% 3-year return.', report_data: {}, file_format: 'CSV', created_at: new Date().toISOString() }
      ];
    }
  },

  async getSettings() {
    try {
      const response = await apiClient.get('/settings/');
      return response.data;
    } catch {
      return {
        id: 'default',
        currency: 'USD',
        default_dev_hourly_rate: 85,
        default_cloud_provider: 'AWS',
        ai_provider: 'OpenAI',
        api_key_configured: 'No',
        risk_threshold: 15,
        custom_rates: { Frontend: 85, Backend: 95, DevOps: 110, 'AI Architect': 125 }
      };
    }
  },

  async updateSettings(settings) {
    try {
      const response = await apiClient.put('/settings/', settings);
      return response.data;
    } catch {
      return {
        id: 'default',
        currency: settings.currency || 'USD',
        default_dev_hourly_rate: settings.default_dev_hourly_rate || 85,
        default_cloud_provider: settings.default_cloud_provider || 'AWS',
        ai_provider: settings.ai_provider || 'OpenAI',
        api_key_configured: 'Yes',
        risk_threshold: settings.risk_threshold || 15,
        custom_rates: settings.custom_rates || { Frontend: 85, Backend: 95, DevOps: 110, 'AI Architect': 125 }
      };
    }
  }
};
