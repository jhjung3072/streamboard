import Link from "next/link";
import ReportEditorShell from "./_components/report-editor-shell.client";
import { getReport } from "@/server/reports/store";

interface ReportDetailPageProps {
  params: Promise<{ reportId: string }>;
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { reportId } = await params;
  const report = getReport(reportId);

  if (!report) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
            <p className="text-lg font-semibold text-white">
              리포트를 찾을 수 없습니다.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              목록으로 돌아가 다른 리포트를 선택해주세요.
            </p>
            <Link
              href="/reports"
              className="mt-4 inline-flex items-center rounded-lg border border-slate-700/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
        <ReportEditorShell
          reportId={report.id}
          initialTitle={report.title}
          initialContent={report.content}
          initialUpdatedAt={report.updatedAt}
        />
      </div>
    </div>
  );
}
