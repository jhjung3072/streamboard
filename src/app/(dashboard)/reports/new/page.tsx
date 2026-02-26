import NewReportShell from './_components/new-report-shell.client';

export default function NewReportPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
        <NewReportShell />
      </div>
    </div>
  );
}
