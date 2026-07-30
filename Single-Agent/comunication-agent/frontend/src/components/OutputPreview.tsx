import React, { useState } from 'react';
import {
  FileText,
  Code,
  Mail,
  Presentation,
  Maximize2,
  Check,
  Copy,
  Download,
  AlertTriangle,
  Send,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TransformationResult } from '../types/communication';
import { api } from '../services/api';

interface OutputPreviewProps {
  result: TransformationResult | null;
  loading: boolean;
  onApproveAndDeliver?: () => void;
  delivering?: boolean;
}

export const OutputPreview: React.FC<OutputPreviewProps> = ({
  result,
  loading,
  onApproveAndDeliver,
  delivering
}) => {
  const [viewMode, setViewMode] = useState<'markdown' | 'html' | 'email' | 'presentation' | 'json'>('markdown');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-4 flex flex-col items-center justify-center min-h-[450px]">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 animate-spin flex items-center justify-center shadow-lg shadow-sky-500/30">
            <div className="h-10 w-10 bg-slate-950 rounded-xl" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">AI Communication Pipeline Executing...</h3>
          <p className="text-xs text-slate-400">Context analysis ➔ Audience Detection ➔ Tone Engine ➔ Formatting Live Preview</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3 flex flex-col items-center justify-center min-h-[450px]">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <FileText className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">AI Operations Preview Ready</h3>
          <p className="text-xs text-slate-400 max-w-sm">Select input context parameters and click 'Run AI Reasoning Engine' to generate multi-channel outputs.</p>
        </div>
      </div>
    );
  }

  const rawTextContent = result.content || result.transformed_content || result.markdown || '';

  const getEmailBodyText = () => {
    if (result.email_body) return result.email_body;
    if (typeof result.formatted_views?.email === 'string') return result.formatted_views.email;
    if (result.formatted_views?.email?.body) return result.formatted_views.email.body;
    return rawTextContent;
  };

  const handleCopy = () => {
    let contentToCopy = rawTextContent;
    if (viewMode === 'html') contentToCopy = result.formatted_views?.html || rawTextContent;
    if (viewMode === 'email') contentToCopy = getEmailBodyText();
    if (viewMode === 'json') contentToCopy = JSON.stringify(result, null, 2);

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: 'markdown' | 'html' | 'pdf' | 'docx' | 'email' | 'text' | 'json') => {
    setDownloading(true);
    try {
      const data = await api.exportDocument(rawTextContent, format, result.title);
      const blob = new Blob([typeof data.content === 'object' ? JSON.stringify(data.content, null, 2) : data.content], {
        type: format === 'html' || format === 'pdf' ? 'text/html' : 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || `communication_report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export Failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const slides: string[] = rawTextContent
    .split(/\n(?=## )/)
    .filter((s: string) => s.trim().length > 0);

  const previewContent = (
    <div className="space-y-4">
      {/* View Mode 1: Rendered Document */}
      {viewMode === 'markdown' && (
        <div className="prose prose-invert prose-sky max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-sky-300 prose-code:text-sky-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {rawTextContent}
          </ReactMarkdown>
        </div>
      )}

      {/* View Mode 2: HTML Render */}
      {viewMode === 'html' && (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-2">
          <iframe
            srcDoc={result.formatted_views?.html || rawTextContent}
            title="HTML Document Preview"
            className="w-full h-[550px] border-0 rounded"
          />
        </div>
      )}

      {/* View Mode 3: Email Client View */}
      {viewMode === 'email' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-sans space-y-4">
          <div className="border-b border-slate-800 pb-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex"><span className="w-16 font-medium text-slate-500">From:</span> <span>LifeOS Communication Agent &lt;communication@lifeos.ai&gt;</span></div>
            <div className="flex"><span className="w-16 font-medium text-slate-500">To:</span> <span className="text-sky-400">{result.output_destination} &lt;{result.output_destination.toLowerCase()}@organisation.com&gt;</span></div>
            <div className="flex"><span className="w-16 font-medium text-slate-500">Subject:</span> <span className="font-semibold text-white">{result.email_subject || result.title}</span></div>
          </div>
          <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
            {getEmailBodyText()}
          </div>
        </div>
      )}

      {/* View Mode 4: Slide Deck */}
      {viewMode === 'presentation' && (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400 uppercase tracking-widest font-mono">
            Presentation Slide Breakdown ({slides.length} Slides)
          </div>
          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden bg-slate-950">
                <span className="absolute top-3 right-4 font-mono text-[10px] text-sky-400 font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                  SLIDE {idx + 1}
                </span>
                <div className="prose prose-invert prose-sky max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{slide}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Mode 5: Raw JSON Object */}
      {viewMode === 'json' && (
        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      
      {/* Top Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white truncate max-w-md">{result.title}</h2>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
              <span>Agent: <strong className="text-sky-300">{result.input_agent}</strong></span>
              <span>•</span>
              <span>Audience: <strong className="text-purple-300">{result.output_destination}</strong></span>
              <span>•</span>
              <span>Channel: <strong className="text-emerald-300">{result.recommended_channel || "Email"}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
            title="Copy Output"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
            title="Export PDF"
          >
            <Download className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Fullscreen Reader"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'markdown' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Document</span>
          </button>

          <button
            onClick={() => setViewMode('html')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'html' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>HTML</span>
          </button>

          <button
            onClick={() => setViewMode('email')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'email' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email View</span>
          </button>

          <button
            onClick={() => setViewMode('presentation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'presentation' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>Slides</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'json' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>JSON Object</span>
          </button>
        </div>

        {onApproveAndDeliver && (
          <button
            onClick={onApproveAndDeliver}
            disabled={delivering || result.delivery_status === 'delivered'}
            className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{result.delivery_status === 'delivered' ? 'Delivered ✓' : 'Approve & Deliver'}</span>
          </button>
        )}
      </div>

      {/* Main Preview Container */}
      <div className="p-6 overflow-y-auto max-h-[650px]">
        {result.has_missing_info && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2 text-xs text-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Missing Payload Information Detected</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                {result.missing_info_details?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {previewContent}
      </div>

      {/* Fullscreen Reading Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white">{result.title}</h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
            >
              Close Reading Mode
            </button>
          </div>
          <div className="flex-1 max-w-4xl w-full mx-auto">
            {previewContent}
          </div>
        </div>
      )}

    </div>
  );
};
