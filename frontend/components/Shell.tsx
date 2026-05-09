import Link from 'next/link';
import { Activity, BarChart3, CheckCircle2, Database, FileSearch, GitBranch, Layers3, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const links = [
  ['Dashboard', '/dashboard'],
  ['Traces', '/traces'],
  ['RAG', '/rag'],
  ['Approvals', '/approvals'],
  ['Evaluation', '/evaluation'],
  ['Evidence', '/evidence']
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen app-grid text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white shadow-card">
              <GitBranch size={18} className="text-brand" />
            </span>
            <span className="hidden sm:block">AgentOS Enterprise Platform</span>
            <span className="sm:hidden">AgentOS</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-soft hover:text-ink">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Governed runtime</span>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">{children}</section>
    </main>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand">{eyebrow}</p>}
        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, description }: { title: string; children: ReactNode; description?: string }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card lg:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, caption, icon, tone = 'default' }: { label: string; value: string; caption: string; icon?: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const toneMap = {
    default: 'bg-blue-50 text-brand border-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-red-50 text-red-700 border-red-100'
  }[tone];
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <div className={`grid h-10 w-10 place-items-center rounded-xl border ${toneMap}`}>{icon || <Activity size={18} />}</div>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-ink">{value}</div>
      <p className="mt-2 text-sm leading-6 text-muted">{caption}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const style = normalized.includes('approved') || normalized.includes('completed')
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : normalized.includes('pending') || normalized.includes('waiting')
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : normalized.includes('rejected') || normalized.includes('failed')
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-slate-200 bg-slate-50 text-slate-700';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{status.replaceAll('_', ' ')}</span>;
}

export function EmptyState({ title, description, icon = 'database' }: { title: string; description: string; icon?: 'database' | 'trace' | 'eval' | 'layers' }) {
  const Icon = icon === 'trace' ? FileSearch : icon === 'eval' ? BarChart3 : icon === 'layers' ? Layers3 : Database;
  return (
    <div className="rounded-2xl border border-dashed border-line bg-slate-50 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-card"><Icon size={22} /></div>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`focus-ring inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 ${props.className || ''}`} />;
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`focus-ring inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-soft disabled:cursor-not-allowed disabled:text-slate-400 ${props.className || ''}`} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`focus-ring w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 ${props.className || ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`focus-ring w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm leading-6 text-ink placeholder:text-slate-400 ${props.className || ''}`} />;
}
