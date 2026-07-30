import Link from 'next/link';
import { Database, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center select-none font-sans text-[#111827] dark:text-neutral-100">
      <Database className="w-16 h-16 text-[#2563EB]" />
      <h1 className="text-4xl font-bold text-[#111827] dark:text-white">404 - Page Not Found</h1>
      <p className="text-[#6B7280] dark:text-neutral-400 text-xs max-w-md">
        The memory path or route you are looking for does not exist in this workspace partition.
      </p>
      <Link
        href="/dashboard"
        className="h-11 px-6 bg-[#2563EB] hover:bg-blue-600 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-none"
      >
        <Home className="w-4 h-4" />
        Return to Workspace Dashboard
      </Link>
    </div>
  );
}
