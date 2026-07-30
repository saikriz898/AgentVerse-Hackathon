import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Printer,
  Layers,
  RefreshCw,
  Cpu,
  Server,
  CheckCircle2,
  BookOpen,
  Monitor,
  Workflow,
  CheckSquare,
  Compass,
  Link,
  Award
} from 'lucide-react';
import { logCommunicationEvent } from '../utils/historyLogger';

const DEFAULT_INPUTS = {
  projectTitle: 'Autonomous Enterprise Multi-Agent OS',
  projectDescription: 'Production-ready AI Operating System featuring specialized agent microservices for financial estimation, real-time prompt simplification, and distributed execution.',
  techStack: 'React JS, FastAPI, Python 3.11, PostgreSQL, Redis, Docker, Tailwind CSS',
  targetAudience: 'Tech Professionals & System Architects',
  keyFeatures: 'AI Project Cost Estimator, Real-time Text Simplifier, Multi-Cloud Price Comparison Matrix, Automated Risk Assessment'
};

export const GenerateReportView: React.FC = () => {
  const [formInputs, setFormInputs] = useState(DEFAULT_INPUTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<{
    title: string;
    generatedAt: string;
    abstract: string;
    introduction: {
      overview: string;
      problemStatement: string;
      objectives: string[];
      scope: string;
    };
    systemAnalysis: {
      existingSystem: string;
      proposedSystem: string;
      functionalRequirements: string[];
      nonFunctionalRequirements: string[];
    };
    systemDesign: {
      architectureOverview: string;
      useCaseSummary: string;
      databaseDesign: string;
    };
    implementation: {
      softwareRequirements: string[];
      hardwareRequirements: string[];
      modules: { name: string; description: string }[];
    };
    results: {
      outputScreenshots: string[];
      testingSummary: string[];
    };
    conclusion: string;
    futureEnhancements: string[];
    references: string[];
  } | null>(null);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.projectTitle.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const stackList = formInputs.techStack.split(',').map((s) => s.trim()).filter(Boolean);
      const featList = formInputs.keyFeatures.split(',').map((f) => f.trim()).filter(Boolean);

      const reportData = {
        title: formInputs.projectTitle,
        generatedAt: new Date().toLocaleDateString(),
        abstract: `This project report presents the formal engineering documentation for "${formInputs.projectTitle}". Developed for ${formInputs.targetAudience}, the platform leverages modern clean architecture principles to deliver scalable performance, automated risk assessment, and streamlined technical communication.`,
        introduction: {
          overview: `${formInputs.projectTitle} is designed to solve operational bottlenecks by providing automated, high-precision software services. Scope: ${formInputs.projectDescription}`,
          problemStatement: 'Existing software workflows lack structured automated reports and struggle with complex AI output comprehension across multi-disciplinary engineering teams.',
          objectives: featList.map((f) => `Deliver automated ${f} functionality.`),
          scope: `Encompasses client interfaces, REST controllers, technology stack integration (${stackList.join(', ')}), and automated documentation export.`
        },
        systemAnalysis: {
          existingSystem: 'Manual document creation, unformatted spreadsheets, and raw unstructured AI prompt outputs.',
          proposedSystem: `Proposed ${formInputs.projectTitle} platform featuring decoupled architecture, real-time simplification, and structured report compilation.`,
          functionalRequirements: featList.map((f, i) => `FR-${i + 1}: Automated execution of ${f}.`),
          nonFunctionalRequirements: [
            'NFR-1 (Performance): Endpoint response time under 300ms.',
            'NFR-2 (Security): Rate limiting and input validation schemas.',
            'NFR-3 (Reliability): High-concurrency async handling.'
          ]
        },
        systemDesign: {
          architectureOverview: `Client (${stackList[0] || 'React'}) <---> API Gateway <---> Backend Controller (${stackList[1] || 'FastAPI'}) <---> Database / Storage Layer.`,
          useCaseSummary: `Primary Actors: ${formInputs.targetAudience}. Core Use Cases: Interactive Input Processing, Real-time Conversion, Formal Report Export.`,
          databaseDesign: 'Relational data model supporting persistent project entities, user parameters, and structured reports.'
        },
        implementation: {
          softwareRequirements: stackList.map((s) => `Software: ${s}`),
          hardwareRequirements: [
            'CPU: Multi-core 2.0 GHz Processor',
            'RAM: 8 GB RAM Minimum',
            'Network: Broadband Internet Connection'
          ],
          modules: featList.map((f) => ({
            name: `${f} Module`,
            description: `Handles processing, execution, and presentation for ${f}.`
          }))
        },
        results: {
          outputScreenshots: [
            `${formInputs.projectTitle} Main Interactive View`,
            'Real-Time AI Output Conversion Panel',
            'Formatted 9-Section Engineering Report Output'
          ],
          testingSummary: [
            'Unit Tests: Passed API schema and endpoint validation.',
            'Integration Tests: Verified client-server payload communication.',
            'Build Tests: Successful production bundle build.'
          ]
        },
        conclusion: `${formInputs.projectTitle} successfully delivers a robust, scalable system that fulfills all core objectives tailored for ${formInputs.targetAudience}.`,
        futureEnhancements: [
          'Live AI Large Language Model stream integration.',
          'Multi-format export (PDF, DOCX, Markdown).',
          'Enterprise single-sign-on (SSO) authentication.'
        ],
        references: [
          'FastAPI Microservices Reference Guide',
          'React Architecture Best Practices',
          'Clean Software Architecture Guidelines'
        ]
      };

      setGeneratedReport(reportData);

      logCommunicationEvent({
        type: 'report',
        title: `9-Section Report: ${formInputs.projectTitle}`,
        details: `Target Audience: ${formInputs.targetAudience} | Stack: ${stackList.join(', ')}`,
        preview: reportData.abstract,
        badge: 'AI Report'
      });

      setLoading(false);
    }, 1000);
  };

  const handleCopyReport = () => {
    if (!generatedReport) return;
    const r = generatedReport;
    const markdown = `# PROJECT REPORT: ${r.title}
Generated Date: ${r.generatedAt}

## 1. Abstract
${r.abstract}

## 2. Introduction
### 2.1 Project Overview
${r.introduction.overview}
### 2.2 Problem Statement
${r.introduction.problemStatement}
### 2.3 Objectives
${r.introduction.objectives.map((o) => `* ${o}`).join('\n')}
### 2.4 Scope
${r.introduction.scope}

## 3. System Analysis
### 3.1 Existing System
${r.systemAnalysis.existingSystem}
### 3.2 Proposed System
${r.systemAnalysis.proposedSystem}
### 3.3 Functional Requirements
${r.systemAnalysis.functionalRequirements.map((fr) => `* ${fr}`).join('\n')}
### 3.4 Non-Functional Requirements
${r.systemAnalysis.nonFunctionalRequirements.map((nfr) => `* ${nfr}`).join('\n')}

## 4. System Design
### 4.1 Architecture Diagram
${r.systemDesign.architectureOverview}
### 4.2 Use Case Diagram
${r.systemDesign.useCaseSummary}
### 4.3 Database Design (ER Diagram)
${r.systemDesign.databaseDesign}

## 5. Implementation
### 5.1 Software Requirements
${r.implementation.softwareRequirements.map((sw) => `* ${sw}`).join('\n')}
### 5.2 Hardware Requirements
${r.implementation.hardwareRequirements.map((hw) => `* ${hw}`).join('\n')}
### 5.3 Modules
${r.implementation.modules.map((m) => `* **${m.name}**: ${m.description}`).join('\n')}

## 6. Results
### 6.1 Output Screenshots
${r.results.outputScreenshots.map((s) => `* ${s}`).join('\n')}
### 6.2 Testing
${r.results.testingSummary.map((t) => `* ${t}`).join('\n')}

## 7. Conclusion
${r.conclusion}

## 8. Future Enhancements
${r.futureEnhancements.map((e) => `* ${e}`).join('\n')}

## 9. References
${r.references.map((ref) => `* ${ref}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Standard 9-Section Project Report Generator
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 mt-2 tracking-tight">
            Generate Formal Engineering Project Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Provide your project details below to automatically compile an academic/industrial 9-section project report (Abstract, Introduction, System Analysis, System Design, Implementation, Results, Conclusion, Future Enhancements, References).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <form onSubmit={handleGenerateReport} className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Project Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-400">9-Section Spec</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title / Name</label>
            <input
              type="text"
              value={formInputs.projectTitle}
              onChange={(e) => setFormInputs({ ...formInputs, projectTitle: e.target.value })}
              placeholder="e.g. Autonomous Enterprise Multi-Agent OS"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description & Objectives</label>
            <textarea
              rows={4}
              value={formInputs.projectDescription}
              onChange={(e) => setFormInputs({ ...formInputs, projectDescription: e.target.value })}
              placeholder="Describe the core business logic, goal, and system architecture..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technology Stack (Comma Separated)</label>
            <input
              type="text"
              value={formInputs.techStack}
              onChange={(e) => setFormInputs({ ...formInputs, techStack: e.target.value })}
              placeholder="e.g. React JS, FastAPI, PostgreSQL, Redis, Docker"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
            <input
              type="text"
              value={formInputs.targetAudience}
              onChange={(e) => setFormInputs({ ...formInputs, targetAudience: e.target.value })}
              placeholder="e.g. Tech Professionals & System Architects"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Features & Deliverables (Comma Separated)</label>
            <textarea
              rows={3}
              value={formInputs.keyFeatures}
              onChange={(e) => setFormInputs({ ...formInputs, keyFeatures: e.target.value })}
              placeholder="e.g. AI Project Cost Estimator, Real-time Text Simplifier, Multi-Cloud Price Comparison Matrix"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formInputs.projectTitle.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compiling 9-Section Report...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Report</span>
              </>
            )}
          </button>
        </form>

        {/* GENERATED 9-SECTION REPORT OUTPUT PANEL */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-slate-950/80 space-y-8">
            {generatedReport ? (
              <>
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
                      FORMAL ENGINEERING PROJECT REPORT
                    </span>
                    <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-2">{generatedReport.title}</h1>
                    <span className="text-xs text-slate-400">Generated: {generatedReport.generatedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReport}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>

                {/* 1. ABSTRACT */}
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    1. Abstract
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    {generatedReport.abstract}
                  </div>
                </div>

                {/* 2. INTRODUCTION */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    2. Introduction
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 2.1 Project Overview</h3>
                      <p>{generatedReport.introduction.overview}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 2.2 Problem Statement</h3>
                      <p>{generatedReport.introduction.problemStatement}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 2.3 Objectives</h3>
                      <ul className="space-y-1 pl-4 list-disc text-slate-300">
                        {generatedReport.introduction.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 2.4 Scope</h3>
                      <p>{generatedReport.introduction.scope}</p>
                    </div>
                  </div>
                </div>

                {/* 3. SYSTEM ANALYSIS */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4" />
                    3. System Analysis
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 3.1 Existing System</h3>
                      <p>{generatedReport.systemAnalysis.existingSystem}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 3.2 Proposed System</h3>
                      <p>{generatedReport.systemAnalysis.proposedSystem}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 3.3 Functional Requirements</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {generatedReport.systemAnalysis.functionalRequirements.map((fr, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
                            {fr}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 3.4 Non-Functional Requirements</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                        {generatedReport.systemAnalysis.nonFunctionalRequirements.map((nfr, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                            {nfr}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. SYSTEM DESIGN */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    4. System Design
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 4.1 Architecture Diagram</h3>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-sky-400">
                        {generatedReport.systemDesign.architectureOverview}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 4.2 Use Case Diagram</h3>
                      <p>{generatedReport.systemDesign.useCaseSummary}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 4.3 Database Design (ER Diagram)</h3>
                      <p>{generatedReport.systemDesign.databaseDesign}</p>
                    </div>
                  </div>
                </div>

                {/* 5. IMPLEMENTATION */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    5. Implementation
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 5.1 Software Requirements</h3>
                      <div className="space-y-1">
                        {generatedReport.implementation.softwareRequirements.map((sw, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{sw}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 5.2 Hardware Requirements</h3>
                      <div className="space-y-1">
                        {generatedReport.implementation.hardwareRequirements.map((hw, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-300">
                            <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{hw}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 5.3 Modules</h3>
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        {generatedReport.implementation.modules.map((m, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                            <span className="font-bold text-slate-100 block">{m.name}</span>
                            <span className="text-[11px] text-slate-400">{m.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. RESULTS */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    6. Results
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 6.1 Output Screenshots & Module Verification</h3>
                      <ul className="space-y-1 pl-4 list-disc text-slate-300">
                        {generatedReport.results.outputScreenshots.map((scr, i) => (
                          <li key={i}>{scr}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-xs mb-1">• 6.2 Testing & Validation</h3>
                      <div className="space-y-1">
                        {generatedReport.results.testingSummary.map((t, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. CONCLUSION */}
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    7. Conclusion
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    {generatedReport.conclusion}
                  </div>
                </div>

                {/* 8. FUTURE ENHANCEMENTS */}
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    8. Future Enhancements
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                    {generatedReport.futureEnhancements.map((enh, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">{i + 1}.</span>
                        <span>{enh}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 9. REFERENCES */}
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    9. References
                  </h2>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs font-mono text-slate-400">
                    {generatedReport.references.map((ref, i) => (
                      <div key={i}>[{i + 1}] {ref}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Fill out the project parameters on the left and click "Generate Project Report"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
