import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Send, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { logCommunicationEvent } from '../utils/historyLogger';

const DEFAULT_INPUTS = {
  projectTitle: 'Autonomous Enterprise Multi-Agent OS',
  projectDescription: 'Production-ready AI Operating System featuring specialized agent microservices for financial estimation, real-time prompt simplification, and formal project report generation.',
  techStack: 'React JS, FastAPI, Python 3.11, PostgreSQL, Redis, Docker, Tailwind CSS',
  recipientRole: 'Client Executive & CTO',
  emailTone: 'Professional Executive',
  keyFeatures: 'AI Project Cost Estimator, Real-time Text Simplifier, 9-Section Project Report Generator, Multi-Cloud Pricing Matrix'
};

export const GenerateEmailView: React.FC = () => {
  const [formInputs, setFormInputs] = useState(DEFAULT_INPUTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedBody, setCopiedBody] = useState<boolean>(false);
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [sentToast, setSentToast] = useState<boolean>(false);

  const [generatedEmail, setGeneratedEmail] = useState<{
    subject: string;
    recipient: string;
    salutation: string;
    opening: string;
    projectOverview: string;
    techStackHighlight: string;
    deliverables: string[];
    nextSteps: string[];
    signOff: string;
  } | null>(null);

  const handleGenerateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.projectTitle.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const stackList = formInputs.techStack.split(',').map((s) => s.trim()).filter(Boolean);
      const featList = formInputs.keyFeatures.split(',').map((f) => f.trim()).filter(Boolean);

      let subjectLine = `[Project Brief] ${formInputs.projectTitle} - Delivery Overview`;
      if (formInputs.emailTone === 'Technical Briefing') {
        subjectLine = `[Engineering Spec] Technical Stack & Milestone Update: ${formInputs.projectTitle}`;
      } else if (formInputs.emailTone === 'Milestone Release') {
        subjectLine = `[Release Announcement] Key Milestone Achieved for ${formInputs.projectTitle}`;
      }

      const emailData = {
        subject: subjectLine,
        recipient: formInputs.recipientRole,
        salutation: `Dear ${formInputs.recipientRole},`,
        opening: `I am writing to provide you with a comprehensive status update regarding our progress on "${formInputs.projectTitle}".`,
        projectOverview: `Project Scope:\n${formInputs.projectDescription}\n\nOur team has successfully engineered the core system architecture to fulfill all business requirements and delivery metrics.`,
        techStackHighlight: `Technology Architecture:\nThe solution leverages ${stackList.slice(0, 3).join(', ')} for the client presentation layer and ${stackList.slice(3).join(', ') || 'FastAPI, Docker'} for backend API controllers and database persistence.`,
        deliverables: featList.map((f) => `${f}: Fully architected and validated in current build.`),
        nextSteps: [
          `Review system performance metrics for ${formInputs.projectTitle}.`,
          `Proceed with staging deployment and client acceptance testing.`,
          `Finalize production release schedule.`
        ],
        signOff: `Best regards,\nLead Software Architect\n${formInputs.projectTitle} Project Team`
      };

      setGeneratedEmail(emailData);

      logCommunicationEvent({
        type: 'email',
        title: `Email Brief: ${formInputs.projectTitle}`,
        details: `To: ${formInputs.recipientRole} | Tone: ${formInputs.emailTone}`,
        preview: `Subject: ${emailData.subject}\n\n${emailData.salutation}\n${emailData.opening}`,
        badge: 'AI Email'
      });

      setLoading(false);
    }, 900);
  };

  const getFullEmailText = () => {
    if (!generatedEmail) return '';
    return `Subject: ${generatedEmail.subject}\nTo: ${generatedEmail.recipient}\n\n${generatedEmail.salutation}\n\n${generatedEmail.opening}\n\n${generatedEmail.projectOverview}\n\n${generatedEmail.techStackHighlight}\n\nKey Feature Deliverables:\n${generatedEmail.deliverables.map((d) => `• ${d}`).join('\n')}\n\nNext Steps:\n${generatedEmail.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${generatedEmail.signOff}`;
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(getFullEmailText());
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopySubject = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleSendEmail = () => {
    if (!generatedEmail) return;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(getFullEmailText())}`;
    window.location.href = mailtoUrl;
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/30 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              AI Project Email Generator
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 mt-2 tracking-tight">
            Generate Professional Project Emails
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Input your project title, description, tech stack, and key deliverables below. The AI Communication Agent will compile a polished, executive-ready email update.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <form onSubmit={handleGenerateEmail} className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Project Email Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-400">AI Email Draft</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title / Name</label>
            <input
              type="text"
              value={formInputs.projectTitle}
              onChange={(e) => setFormInputs({ ...formInputs, projectTitle: e.target.value })}
              placeholder="e.g. Autonomous Enterprise Multi-Agent OS"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Role / Audience</label>
            <input
              type="text"
              value={formInputs.recipientRole}
              onChange={(e) => setFormInputs({ ...formInputs, recipientRole: e.target.value })}
              placeholder="e.g. Client Executive & CTO"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Tone & Communication Style</label>
            <select
              value={formInputs.emailTone}
              onChange={(e) => setFormInputs({ ...formInputs, emailTone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="Professional Executive">Professional Executive Update</option>
              <option value="Technical Briefing">Technical Engineering Briefing</option>
              <option value="Milestone Release">Milestone Release Announcement</option>
              <option value="Client Status Report">Client Weekly Status Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description & Context</label>
            <textarea
              rows={3}
              value={formInputs.projectDescription}
              onChange={(e) => setFormInputs({ ...formInputs, projectDescription: e.target.value })}
              placeholder="Describe the core business logic, goal, and system architecture..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technology Stack (Comma Separated)</label>
            <input
              type="text"
              value={formInputs.techStack}
              onChange={(e) => setFormInputs({ ...formInputs, techStack: e.target.value })}
              placeholder="e.g. React JS, FastAPI, PostgreSQL, Redis, Docker"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Features & Deliverables (Comma Separated)</label>
            <textarea
              rows={3}
              value={formInputs.keyFeatures}
              onChange={(e) => setFormInputs({ ...formInputs, keyFeatures: e.target.value })}
              placeholder="e.g. AI Project Cost Estimator, Real-time Text Simplifier, 9-Section Report Generator"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formInputs.projectTitle.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating AI Email...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Email</span>
              </>
            )}
          </button>
        </form>

        {/* GENERATED EMAIL DRAFT PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sky-500/30 bg-slate-950/80 space-y-6">
            {generatedEmail ? (
              <>
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                      EMAIL DRAFT • {formInputs.emailTone}
                    </span>
                    <h2 className="text-base font-bold text-slate-100 mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-sky-400" />
                      <span>{generatedEmail.subject}</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySubject}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                    >
                      {copiedSubject ? 'Subject Copied' : 'Copy Subject'}
                    </button>

                    <button
                      onClick={handleCopyBody}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedBody ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBody ? 'Copied Full Email' : 'Copy Email'}</span>
                    </button>

                    <button
                      onClick={handleSendEmail}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Mail</span>
                    </button>
                  </div>
                </div>

                {/* Email Client Header Box */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-semibold w-16">To:</span>
                    <span className="text-sky-300 font-bold">{generatedEmail.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold w-16">Subject:</span>
                    <span className="text-slate-200 font-bold">{generatedEmail.subject}</span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs text-slate-200 leading-relaxed font-sans">
                  {/* Salutation */}
                  <p className="font-bold text-slate-100">{generatedEmail.salutation}</p>

                  {/* Opening */}
                  <p>{generatedEmail.opening}</p>

                  {/* Project Overview */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">Project Overview</span>
                    <p className="whitespace-pre-line">{generatedEmail.projectOverview}</p>
                  </div>

                  {/* Tech Stack Highlights */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Technology Architecture & Stack</span>
                    <p className="whitespace-pre-line">{generatedEmail.techStackHighlight}</p>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Key Feature Deliverables</span>
                    <div className="space-y-1.5 pt-1">
                      {generatedEmail.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Immediate Next Steps</span>
                    <div className="space-y-1 pt-1">
                      {generatedEmail.nextSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <span className="font-mono text-amber-400 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-3 border-t border-slate-800/80 text-slate-400 whitespace-pre-line">
                    {generatedEmail.signOff}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Mail className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Fill out the project inputs on the left and click "Generate Project Email"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
