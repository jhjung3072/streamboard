import AiPanel from './_components/ai-panel';
import Editor from './_components/editor.client';
import Toolbar from './_components/toolbar.client';

interface ReportDetailPageProps {
  params: { reportId: string };
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  return (
    <div>
      <h1>Report {params.reportId}</h1>
      <Toolbar />
      <Editor />
      <AiPanel />
    </div>
  );
}
